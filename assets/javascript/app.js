$(function(){
    //If not images exists for this film
    $('#term').focus(function() {
            var full = $('#poster').has("img").length ? true: false;
            if (full == false {
                    $('#poster').empty();
            }
            
            
    });
    
    var api_key =" gibberish"
    var baseing = "http://image.tmdb.org/t/p/wxx";

    //function definition
    var getPoster = function(){

            //Grab movie title and store it in a variable

            var film = $('#term').val();

            //check if there is user input

            if (film =='') {
                //If the input field was empty, display a message

                $('#poster'.html("<h2 class='loading"> Message Message message to users if they have not entered anything to the pageXOffset.>/h2>");
            } else {

            //The next image loading
            $('#poster').html("<h2 class='loading new image for next round'>Next Round is Loading!</h2>")
            }
            $.getJSON("https://api.themoviedb.org/3/search/movie?query=" + searchterm(film) + "&api_key +"&callback=?",
                function(json) {
                        if (json.total_results) {

                            //Display the poster image + >"Image displayed for this round!!!"</h2<<img id="posterimage" src+'
                        } else {
                                $.getJSON(
                                )
                        }





                        }


                }
            
            
            "
            
            
            ")

            }
    }








})






















$(document).on('pageinit', '#home', function(){
// $(document).ready(function(){
        console.info('hi');
//Obtain the search string, save it in a variable 
    var searchString = 'your_search_string'
    var url = 'http://api.themoviedb.org/3/',
      mode = 'search/movie?query=',
      movieName = '&query='+encodeURI(searchString),
      key = '&api_key=7b5ee640f4a3259d5c7b108eec04211d';
//The above may be like spiderman
    $.ajax({
        url: url + mode + key + movieName ,
        dataType: "jsonp",
        async: true,
        success: function (result) {
        console.dir(result);
        ajax.parseJSONP(result);
        },
            
        });
    });
    $(document).on('pagebeforeshow', '#headline', function(){
        $('#movie-data').empty();
        $.each(movieInfo.result, function(i, row) {
            if(row.id == movieInfo.id) {
                $('#movie-data').append('<li><img src="http://image.tmdb.org/t/p/w92'+row.poster_path+'"></li>');
                $('#movie-data').append('<li>Title: '+row.original_title+'</li>');
                $('#movie-data').append('<li>Release date'+row.release_date+'</li>');
                $('#movie-data').append('<li>Popularity : '+row.vote_average+'</li>');
                $('#movie-data').listview('refresh');
            }
        });
    });
    
    $(document).on('vclick', '#movie-list li a', function(){
        movieInfo.id = $(this).attr('data-id');
        $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
    });
    
    var movieInfo = {
        id : null,
        result : null
    }
    var ajax = {
        parseJSONP:function(result){
            movieInfo.result = result.results;
            $.each(result.results, function(i, row) {
                console.log(JSON.stringify(row));
                $('#movie-list').append('<li><a href="" data-id="' + row.id + '"><img src="http://image.tmdb.org/t/p/w92'+row.poster_path+'"/><h3>' + row.title + '</h3><p>')
       //this is unfinished do you think this type of searching is useful????????????
       
       
            })
        }
    }

    
   
   
          