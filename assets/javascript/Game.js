class Game {
    constructor() {
        this.states = [];
        this.movies = [];
        this.playerCount = 0;
        this.currentState = 0;
        this.currentRound = 0;
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
     * @param {array} titles - Array of movie titles
     * @param {number} roundCount - Number of rounds being generated
     */
    generateMovies(titles, roundCount) {
        let roundTitles = [];

        for (let i = 0; i < roundCount; i++) {
            let randomIndex = Math.floor(Math.random() * titles.length);

            console.log(titles[randomIndex])
            roundTitles.push(titles[randomIndex]);
        }

        for (let index in roundTitles) {
            this.getMovieBySearchTerm(roundTitles[index]);
        }
    }

    /**
     * Makes an AJAX query to generate a movie from a given search term
     * and pushes a new movie object into the game's movies array
     * @param {string} term - term to conduct search with
     */
    getMovieBySearchTerm(term) {
        let context = this;
        let params = {
            api_key: '7b5ee640f4a3259d5c7b108eec04211d',
            page: 1,
            include_adult: false,
            query: term
        }

        $.ajax({
            url: `https://api.themoviedb.org/3/search/movie?${$.param(params)}`,
            method: 'get'
        }).then(function(response) {
            context.movies.push(new Movie(response.results[0]));
        });
    }
}