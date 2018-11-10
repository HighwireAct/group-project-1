class Movie {
    constructor(imageUrl, title, acceptableAnswers, trivia) {
        this.imageUrl = imageUrl;
        this.title = title;
        this.acceptableAnswers = acceptableAnswers;
        this.releaseYear = trivia.releaseYear;
        this.director = trivia.director;
        this.cast = trivia.cast;
        this.trivia = [
            `Year released: ${this.releaseYear}`,
            `Director: ${this.director}`,
            `Leading Cast: ${this.cast}`
        ];
    }
}