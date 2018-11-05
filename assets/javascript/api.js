$.ajax({
    url: 'https://api.themoviedb.org/3/search/movie?api_key=7b5ee640f4a3259d5c7b108eec04211d&language=en-US&query=scott%20pilgrim%20vs.%20the%20world&page=1&include_adult=false',
    type: 'get'
}).then(function(response) {
    console.log(response);
    console.log(response.results[0].backdrop_path);
    let movieStill = $("<img>");
    movieStill.attr("src", `https://image.tmdb.org/t/p/w500${response.results[0].backdrop_path}`);
    $("#game").append(movieStill);
});