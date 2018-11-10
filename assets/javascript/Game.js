class Game {
    constructor() {
        // Array of possible game states
        this.states = [];
        this.movies = []; // Movies for the current game match
        this.currentState = 0;
        this.currentRound = 0;
        this.speedMultiplier = 3;
        this.competitionMultiplier = 3;
    }

    /**
     * Changes the current game state
     * @param {number} stateIndex - Index of state to change to
     */
    changeState(stateIndex) {
        this.states[this.currentState].exit();
        this.currentState = stateIndex;
        this.states[this.currentState].enter();
    }

    /**
     * Generates an array of movie objects given a list of titles and
     * a number of rounds to generate for.
     * @param {array} movies - Array of movie IDs and acceptable answers
     * @param {number} roundCount - Number of rounds being generated
     */
    generateMovies(movies, roundCount) {
        let roundMovies = movies;

        // console.log(roundMovies);

        // Shuffle movie bank
        let j, x, i;
        for (i = roundMovies.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = roundMovies[i];
            roundMovies[i] = roundMovies[j];
            roundMovies[j] = x;
        }

        console.log(roundMovies);

        // Cut array off to fit round length
        roundMovies = roundMovies.slice(0, roundCount);

        // Create a movie object for each round
        for (let i in roundMovies) {
            this.pushMovieObject(roundMovies[i].id, roundMovies[i].acceptableGuesses);
        }

        console.log(roundMovies);
    }

    /**
     * Makes an AJAX query to generate a movie from a given ID
     * and pushes a new movie object into the game's movies array
     * @param {string} movieId - ID of movie being requested
     */
    pushMovieObject(movieId, acceptableAnswers) {
        let context = this; // Store reference to game object
        let params = {
            api_key: '7b5ee640f4a3259d5c7b108eec04211d',
            append_to_response: 'credits',
            include_adult: false
        }

        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${movieId}?${$.param(params)}`,
            method: 'get'
        }).then(function(response) {
            // Grab backdrop image
            let imageUrl = response.backdrop_path;

            // Grab title
            let title = response.original_title;

            // Grab release year
            let releaseYear = response.release_date.substr(0, 4);
            
            // Grab director
            let i = 0;
            while (response.credits.crew[i].department !== "Directing") {
                i++;
            }
            let director = response.credits.crew[i].name;

            // Grab leading cast
            let cast = []
            for (i = 0; i < 3; i++) {
                cast.push(response.credits.cast[i].name);
            }

            // Assemble trivia
            let trivia = {
                releaseYear: releaseYear,
                director: director,
                cast: cast.join(", ")
            }
            
            // Create movie object from details and push it into the game object's
            // movie array
            context.movies.push(new Movie(imageUrl, title, acceptableAnswers, trivia));
        });
    }

    /**
     * Awards points based on multipliers
     */
    awardPoints() {
        let pointsAwarded = 50 * this.competitionMultiplier + 20 * this.speedMultiplier;
        addPoints(pointsAwarded);
    }
}