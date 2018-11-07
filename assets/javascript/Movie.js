class Movie {
    constructor(movieObject) {
        console.log(movieObject);
        this.imageUrl = movieObject.backdrop_path;
        this.trivia = [
            `Year released: ${movieObject.release_date.substr(0, 4)}`
        ];
    }
}