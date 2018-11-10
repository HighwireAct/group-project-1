// List of user icons (for testing purposes)
let iconUrls = ['blueprint_be.svg', 'blueprint_purr.svg', 'blueprint_spook.svg', 'blueprint_swim.svg', 'blueprint_submerge.svg', 'blueprint_believe.svg'];

// Store reference to Firebase database
const database = firebase.database();

// Initialize some player variables
let isGameMaster = false;
let playerId;
let playerRankings;
let playerCount = 0;
let playerIcon = "";
let points = 0;
let playerRef; // Path to player object in Firebase
let sharedTimerId;
let guessedCorrectly;

// Some game constants and variables
const BLUR_INIT = 15; // 15px initial blur for movie stills
let movieStillBlur = BLUR_INIT; // Variable for current blur of movie still
const ROUND_TIMER = 45; // 45 seconds for each round
const REVEAL_TIMER = 5; // Movie revealed for 5 seconds at the end of round
const RESULTS_TIMER = 10; // 10 seconds for round results

// Game state constants
const ICON_SELECT = 0;
const MAIN_GAME = 1;
const ROUND_RESULTS = 2;
const GAME_FULL = 3;
const GAME_RESULTS = 4;

// Create a new game and game timer
let game = new Game();
let timer = new Timer();

// Chat sound!
let messageSound = new Audio('assets/sounds/blop.wav');
let resultsSound = new Audio('assets/sounds/applause.wav');
let pointsSound = new Audio('assets/sounds/pop.wav');

// Give the game its states
game.states = gameStates;

// Generate movies for the round
game.generateMovies(movieBank, 5);

// Handle user presence
database.ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() === true) {
        // Check players tree
        database.ref('/game/players/').once('value', function(snapshot) {
            // Get current player count
            playerCount = snapshot.numChildren();
            console.log(playerCount);
            // If the room is empty
            if (playerCount === 0) {
                // Assign game master
                isGameMaster = true;
                // Set a shared list of movies
                database.ref('/game/movies/').set(game.movies);
                // Set the initial shared game state
                changeSharedState(ICON_SELECT);
            }
            // Push player into player tree if room is under capacity
            if (playerCount <= 5) {
                // Get array of movies for the round from the game master
                database.ref('/game/movies/').once('value', function(snapshot) {
                    game.movies = snapshot.val();
                });
                console.log(playerCount);
                playerRef = database.ref('/game/players/').push({
                    iconUrl: playerIcon,
                    points: 0
                });
                // Assign player ID
                playerId = playerRef.key;
            } else {
                console.log("changing states!")
                game.changeState(GAME_FULL);
            }
            
            // Remove player if they disconnect
            playerRef.onDisconnect().remove();

            // Destroy game if the final player disconnects
            if (playerCount === 1) {
                database.ref("/game/").onDisconnect().remove();
            }
        });
    }
});

// Create and render HTML elements for icons as they're pushed to Firebase
database.ref('/game/icons/').on("child_added", function(snapshot) {
    let data = snapshot.val();

    // Build icon image
    let iconImg = $("<img>");
    iconImg.data("icon-id", snapshot.key);
    iconImg.data("url", data.iconUrl)
    iconImg.attr("src", `assets/images/${data.iconUrl}`);
    iconImg.addClass("icon");
 
    // Append to icon select
    $("#icon-select").append(iconImg);
});

// Remove HTML icons after they've been removed from Firebase
database.ref('/game/icons/').on("child_removed", function(snapshot) {
    let id = snapshot.key;

    $(".icon").filter(function() {
        return $(this).data("icon-id") === id;
    }).remove();  
});

// Change a player's icon url when they click on an icon
$(document).on("click", ".icon", function(event) {
    console.log("Clicked icon");
    let iconId = $(this).data("icon-id");
    let iconUrl = $(this).data("url");

    if (playerIcon !== "") {
        database.ref('/game/icons/').push({
            iconUrl: playerIcon
        });
    } else {
        
    }
    // Set player's icon to clicked icon
    playerIcon = iconUrl;

    // let iconPreview = $("<img>").attr("src", `assets/images/${playerIcon}`);
    
    // if (isGameMaster) {
    //     gameStartButton.before(iconPreview);
    // } else {
    //     gameWait.before(iconPreview);
    // }

    // Update player in firebase to reflect new icon
    database.ref(`/game/players/${playerId}`).set({
        iconUrl: playerIcon,
        points: points
    });

    // Remove icon from Firebase
    database.ref(`/game/icons/${iconId}`).remove();
});

$(document).on("click", "#start-game", function() {
    console.log("Clicked!")
    if (playerCount >= 2) {
        changeSharedState(MAIN_GAME);
    }
});

// Adjust playerCount when new players are added or removed
database.ref('/game/players/').on("value", function(snapshot) {
    playerCount = snapshot.numChildren();
});


/**
 * Adds points to a player's score in the database
 * @param {number} points 
 */
function addPoints(pointsValue) {
    points += pointsValue;
    database.ref(`/game/players/${playerId}`).set({
        iconUrl: playerIcon,
        points: points
    });
}

/**
 * Creates a shared timer on Firebase and outputs its ID
 * @param {number} duration - duration of timer in milliseconds
 */
function createSharedTimer(duration) {
    let endTime = Date.now() + duration;
    let timerShared = database.ref('/game/timers').push({ endTime: endTime });
    let timerId = timerShared.key;
    return timerId;
}

/**
 * Changes the state of the game in Firebase
 * @param {number} state - desired state to change to
 */
function changeSharedState(state) {
    database.ref('/game/state/').set(state);
}

// Change the local game state when the Firebase game state is changed
database.ref('/game/state/').on('value', function(snapshot) {
    game.changeState(snapshot.val());
});

// Start timer when shared timer is pushed up
database.ref('/game/timers/').on("child_added", function(snapshot) {
    let data = snapshot.val();
    timer.endTime = data.endTime;
    timer.start();
});

// Clear timer intervals for non-game-masters
database.ref('/game/timers/').on("child_removed", function(snapshot) {
    clearInterval(timer.ticker);
    console.log('Timer removed');
    // Force player timer to behave
    if (!isGameMaster && game.currentState === MAIN_GAME) {
        timer.htmlElement.text("0");
        timer.htmlElement = null;
        timer.updateCallback = null;
        $("#movie-still").css("filter", "none");
        $("#hint").text(`${game.movies[game.currentRound].title} (${game.movies[game.currentRound].releaseYear})`);
    }
});

//Update player rankings
database.ref('/game/players/').orderByChild('points').on('value', function(snapshot) {
    // Play a little sound effect if we're in the main game
    if (game.currentState === MAIN_GAME) {
        pointsSound.play();
    }

    // Decrement the competition multiplier since someone's been given points for the round
    game.competitionMultiplier--;

    let playerArrayAscending = [];

    // Iterate through sorted player objects
    snapshot.forEach(function(data) {
        console.log(data.val());
        playerArrayAscending.push(data.val());
    });

    // Reverse array to sort from high to low
    let playerArrayDescending = playerArrayAscending.reverse();
    playerRankings = playerArrayDescending; 
});

/**
 * Exactly what it says on the box.
 */
function renderResultsTable() {
    let resultsTable = $("<table>").addClass("table table-striped");
    let resultsHead = $(
        `<thead>` +
            `<tr>` +
                `<th scope="col">#</th>` +
                `<th scope="col">Player</th>` +
                `<th scope="col">Points</th>` +
            `</tr>` +
        `</thead>`
        );
    let resultsBody = $("<tbody>");

    // Generate table rows
    for (let i in playerRankings) {
        console.log(i);
        let index = Number(i);
        let resultsRow = $("<tr>");
        let resultsRowHead = $("<th>").attr("scope", "row").text(index + 1);
        let resultsPlayer = $("<td>");
        let resultsIcon = $("<img>");
        resultsIcon.attr("src", `assets/images/${playerRankings[i].iconUrl}`);
        resultsIcon.attr("height", "30px");
        resultsIcon.css("margin-right", "5px");
        resultsPlayer.append(resultsIcon);
        if (game.currentState === GAME_RESULTS && index === 0) {
            let resultsTrophy = $("<img>");
            resultsTrophy.attr("src", "assets/images/feather_win.svg");
            resultsTrophy.attr("height", "30px");
            resultsPlayer.append(resultsTrophy);
        } 
        let resultsPoints = $("<td>").text(playerRankings[i].points);

        resultsRow.append(resultsRowHead);
        resultsRow.append(resultsPlayer);
        resultsRow.append(resultsPoints);

        resultsBody.append(resultsRow);
    }

    // Assemble table
    resultsTable.append(resultsHead);
    resultsTable.append(resultsBody);

    // Append table to play-area
    $("#play-area").append(resultsTable);
}

// MESSAGING AND INPUT PARSING
/**
 * Pushes a chat message up to Firebase
 * @param {string} message - string containing message
 * @param {string} icon - url of icon to be prepended to message
 * @param {string} type - type of message being displayed
 */
function postMessage(message, icon, type) {
    database.ref('/game/messages/').push({
        message: message,
        icon: icon,
        type: type
    });
}

// If message has been added to Firebase
database.ref('/game/messages/').on("child_added", function(snapshot) {
    let data = snapshot.val();

    // Create HTML element for message
    let messageDiv = $("<div>");
    let messageBody = $("<div>").css("display", "inline-block");
    messageBody.addClass("message");
    let messageIcon = $("<img>").attr("src", `assets/images/${data.icon}`)
    messageIcon.attr("height", "20px");
    if (data.type === 'html') {
        messageBody.html(data.message);
    } else {
        messageBody.text(data.message);
        messageSound.play();
    }
    messageDiv.append(messageIcon);
    messageDiv.append(messageBody);

    $("#chat-body").append(messageDiv);

    // Autoscroll chat to bottom
    let chatDiv = document.getElementById('chat-body')
    chatDiv.scrollTop = chatDiv.scrollHeight;
});

// Processing chat input
$(document).on('submit', '#chat-input', function(event) {
    event.preventDefault();
    // Fetch and trim message
    let message = $("#message-field").val().trim();

    $("#message-field").val('');

    // If we're in the main game, analyze the message
    if (game.currentState === MAIN_GAME) {
        // Make the message lowercase for checking purposes
        let messageLower = message.toLowerCase();

        if (messageLower === "hint") {
            // This'll uh, dynamically generate hints or something
            $("#hint").text(game.movies[game.currentRound].trivia[3 - game.speedMultiplier]);
        } else if (containsAnswer(messageLower)) {
            if (guessedCorrectly === false) {
                postMessage(`<strong>This person got the right answer!</strong>`, playerIcon, 'html');
                game.awardPoints();
                guessedCorrectly = true;
            }
        } else {
            postMessage(message, playerIcon, 'text');
        }
        
    } else {
        postMessage(message, playerIcon, 'text');
    }
});

/**
 * Checks a string for answers, returning true or false
 * @param {string} string - String to be checked for answers
 * @returns {bool}        - Whether or not the string contained an answer
 */
function containsAnswer(string) {
    for (let i in game.movies[game.currentRound].acceptableAnswers) {
        if (string.indexOf(game.movies[game.currentRound].acceptableAnswers[i]) >= 0) {
            return true;
        }
    }
    return false;
}