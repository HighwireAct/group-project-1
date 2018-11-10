let gameStates =  [
    // ICON_SELECT
    new State(
        function() {
            // ENTER

            // Create a "Start game" button, but hide it initially
            let startGameButton = $("<button>").text("Start game");
            startGameButton.attr("id", "start-game");
            // startGameButton.css("display", "none");

            $("#game").append(startGameButton);

            // Create icon-select div
            let iconSelectDiv = $("<div>");
            iconSelectDiv.attr("id", "icon-select");
            iconSelectDiv.addClass("centered");
        
            // Create icon select heading
            let iconSelectHeading = $("<h3>").text("Select your icon:")
            iconSelectDiv.append(iconSelectHeading);

            $("#game").append(iconSelectDiv) 
            
            if (isGameMaster) {
                for (let i in iconUrls) {
                    database.ref('/game/icons/').push({ iconUrl: iconUrls[i] });
                }
            } else {
                database.ref('/game/icons/').once("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        let childData = childSnapshot.val();
                        let iconImg = $("<img>");
                        iconImg.data("icon-id", childSnapshot.key);
                        iconImg.data("url", childData.iconUrl);
                        iconImg.attr("src", `assets/images/${childData.iconUrl}`);
                        iconImg.addClass("icon");

                        iconSelectDiv.append(iconImg);
                    });
                });
            }
        
        },
        function() {
            // EXIT
            $("#icon-select").remove();
            $("#start-game").remove();
        }),
    // MAIN_GAME
    new State(
        function() {
            // ENTER

            // Reset guess flag
            guessedCorrectly = false;

            // Reset score multipliers
            game.speedMultiplier = 3;
            game.competitionMultiplier = 3;

            // Only create a chat if we don't have one already
            if ($("#chat").html().trim() === "") {
                //--------------//
                // CHAT         //
                //--------------//
                // Build chat header
                let chatHeader = $("<header>").attr("id", "chat-header");
                let chatHeading = $("<h2>").text("Chat");
                chatHeader.append(chatHeading);
                // Build chat body
                let chatBody = $("<div>").attr("id", "chat-body");
                // Build chat footer and input
                let chatFooter = $("<footer>").attr("id", "chat-footer");
                let chatForm = $("<form>").attr("id", "chat-input");
                let messageInput = $("<input>").attr("type", "text");
                messageInput.attr("autocomplete", "off");
                messageInput.attr("id", "message-field")
                let messageSubmit = $("<input>").attr("type", "submit");
                chatForm.append(messageInput);
                chatForm.append(messageSubmit);
                chatFooter.append(chatForm);
                // Append all to chat div
                $("#chat").append(chatHeader);
                $("#chat").append(chatBody);
                $("#chat").append(chatFooter);
            }

            //---------------------//
            // PLAY AREA           //
            //---------------------//
            // Build image container
            let imageContainer = $("<div>").attr("id", "image-container");
            let movieStill = $("<img>").attr("id", "movie-still");
            movieStill.attr("src", `https://image.tmdb.org/t/p/w500${game.movies[game.currentRound].imageUrl}`);
            movieStill.attr("draggable", false);
            movieStillBlur = BLUR_INIT; // set to initial blur
            movieStill.css("filter", `blur(${movieStillBlur}px)`);
            let timerDiv = $("<div>").attr("id", "timer");
            let timerText = $("<h2>").addClass("centered");
            timerDiv.append(timerText);
            imageContainer.append(movieStill);
            imageContainer.append(timerDiv);

            // Build hint box
            let hintBox = $("<div>").attr("id", "hint");
            hintBox.text("Send \"hint\" in chat for a hint!");

            $("#play-area").append(imageContainer);
            $("#play-area").append(hintBox);

            //-------------------//
            // TIMER             //
            //-------------------//
            timer.htmlElement = timerText;
            // Set special timer privileges for game master
            if (isGameMaster === true) {
                // Set a shared timer for 45 seconds
                sharedTimerId = createSharedTimer(45000);
                timer.stopCallback = function() {
                    database.ref(`/game/timers/${sharedTimerId}`).remove();
                    this.htmlElement = null;
                    this.updateCallback = null;
                    this.stopCallback = function() {
                        database.ref(`/game/timers/${sharedTimerId}`).remove();
                        if (game.movies[game.currentRound + 1] !== undefined) {
                            changeSharedState(ROUND_RESULTS);
                        } else {
                            changeSharedState(GAME_RESULTS);
                        }
                    }
                    // Render film name in hint box
                    $("#hint").text(`${game.movies[game.currentRound].title} (${game.movies[game.currentRound].releaseYear})`);
                    sharedTimerId = createSharedTimer(5000);
                }
            } 

            // Unblur image in 15 second intervals
            timer.updateCallback = function() {
                if (this.value % 15 === 0 && this.value !== 45) {
                    game.speedMultiplier--;
                    movieStillBlur -= 5;
                    $("#movie-still").css("filter", `blur(${movieStillBlur}px)`);
                }
            }
        },
        function() {
            // EXIT
            $("#play-area").empty();
        }
    ),
    // RESULTS
    new State(
        function() {
            // ENTER
            game.currentRound++;

            resultsSound.play();

            timer.stopCallback = null;

            renderResultsTable();

            // Game master sets timer for next round
            if (isGameMaster) {
                sharedTimerId = createSharedTimer(10000);
                timer.stopCallback = function() {
                    database.ref(`/game/timers/${sharedTimerId}`).remove();
                    changeSharedState(MAIN_GAME);
                }
            }

        },
        function() {
            // EXIT
            $("#play-area").empty();
        }
    ),
    // GAME_FULL
    new State(
        function() {
            // ENTER
            $("#game").empty();
            $("#chat").empty();

            let gameFullMessage = $("<h2>").text("Room full; try again later!");
            gameFullMessage.addClass("centered");
            $("#game").append(gameFullMessage);
        },
        function() {
            // EXIT

        }
    ),
    // GAME_RESULTS
    new State(
        function() {
            // ENTER
            renderResultsTable();

            console.log("Someone won!");
        },
        function() {
            // EXIT
        }
    )
];