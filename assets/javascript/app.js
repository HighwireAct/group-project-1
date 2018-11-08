// Pre-picked list of films to choose rounds from
let titleBank = ['the mask', 'pulp fiction', 'the princess bride', 'star wars episode iii'];

// List of user icons (for testing purposes)
let iconUrls = ['blueprint_be.svg', 'blueprint_purr.svg', 'blueprint_spook.svg', 'blueprint_chat.svg', 'blueprint_share.svg'];

// Store reference to Firebase database
const database = firebase.database();

// Game state constants
const ICON_SELECT = 0;
const MAIN_GAME = 1;
const ROUND_RESULTS = 2;

// Create a new game
let game = new Game();

// Generate a 3-movie round for the game
game.generateMovies(titleBank, 3);

// Enter the game's initial state
game.states[game.currentState].enter();