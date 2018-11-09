// Pre-picked list of films to choose rounds from
let movieBank = [
    680, //Pulp Fiction
    550, //Fight Club
    603, //The Matrix
    630, //The Wizard of Oz
    13, //Forrest Gump
    238, //The Godfather
    155, //Dark Knight
    284054, //Black Panther
    769, //Good Fellas
    862, //Toy Story
    274, //The Silence of the Lambs
    27205, //Inception
    857, //Saving Private Ryan
    10681, //WALL·E
    129, //Spirited Away
    157336, //Interstellar
    539, //Psycho
    14022, //Slacker
    1382, //Me and You and Everyone We Know
    2044 //The Lake House
];

// List of user icons (for testing purposes)
let iconUrls = ['blueprint_watch.svg', 'blueprint_be.svg', 'blueprint_purr.svg', 'blueprint_spook.svg', 'blueprint_chat.svg', 'blueprint_share.svg'];

// Store reference to Firebase database
const database = firebase.database();

// Game state constants
const ICON_SELECT = 0;
const MAIN_GAME = 1;
const ROUND_RESULTS = 2;

// Create a new game
let game = new Game();

// Generate a 3-movie round for the game
// game.generateMovies(titleBank, 3);

// Enter the game's initial state
game.states[game.currentState].enter();

let currentMovieID = movieBank[7];
let appendToResponse = ['credits', 'images']
let requestParams = {
    api_key: "7b5ee640f4a3259d5c7b108eec04211d",
    append_to_response: appendToResponse.join(',')
}

$.ajax({
    url: `https://api.themoviedb.org/3/movie/${currentMovieID}?${$.param(requestParams)}`,
    method: 'get'
}).then(function(response) {
    let i = 0;
    while (response.credits.crew[i].department !== "Directing") {
        i++;
    }
    console.log("Director:", response.credits.crew[i].name);
    console.log(response);
});