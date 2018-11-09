class Game {
    constructor() {
        // Array of possible game states
        this.states = [
            new State(function() {
                // Render the div "icon-select" to the screen
                let iconSelectDiv = $("<div>");
                iconSelectDiv.attr("id", "icon-select");
                iconSelectDiv.addClass("centered");
            
                let iconSelectHeading = $("<h3>").text("Select your icon:")
                iconSelectDiv.append(iconSelectHeading);
            
                for (let i in iconUrls) {
                    let iconImg = $("<img>");
                    iconImg.attr("src", `assets/images/${iconUrls[i]}`);
                    iconImg.attr("height", "50px;");
                    iconImg.addClass("icon");
            
                    $(iconSelectDiv).append(iconImg);
                }
            
                $("#game").append(iconSelectDiv) 
            },
            null)
        ];
        this.movies = [];
        this.players = [];
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
     * Makes an AJAX query to generate a movie from a given ID
     * and pushes a new movie object into the game's movies array
     * @param {string} movieId - ID of movie being requested
     * @param {string} method
     */
    getMovieById(movieId, method) {
        let context = this; 
        let params = {
            api_key: '7b5ee640f4a3259d5c7b108eec04211d',
            page: 1,
            include_adult: false,
        }

        $.ajax({
            url: `https://api.themoviedb.org/3/search/movie?${$.param(params)}`,
            method: 'get'
        }).then(function(response) {
            context.movies.push(new Movie(response.results[0]));
        });
    }
}