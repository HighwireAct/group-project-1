// Pre-picked list of films to choose rounds from
let titleBank = ['the mask', 'pulp fiction', 'the princess bride', 'star wars episode iii']

let game = new Game();

// let object = {
//     title: "Pulp Fiction",
//     backdrop_path: "something.jpg"
// }

// let testMovie = new Movie(object);

game.generateMovies(titleBank, 3);

console.log(game.getMovieBySearchTerm('the dark knight'));

console.log(game.movies);