"use strict";
//Defining JSON object with action movie data
const jsonData = {
    "movies": [
        {"title": "Die Hard", "youtubeUrl": "https://www.youtube.com/watch?v=QIOX44m8ktc"},
        {"title": "Rush Hour", "youtubeUrl": "https://www.youtube.com/watch?v=UuHf24GhINc"},
        {"title": "The Matrix", "youtubeUrl": "https://www.youtube.com/watch?v=m8e-FF8MsqU"},
        {"title": "The Terminator", "youtubeUrl": "https://www.youtube.com/watch?v=k64P4l2Wmeg"},
        {"title": "The Mummy", "youtubeUrl": "https://www.youtube.com/watch?v=h3ptPtxWJRs"},
        {"title": "Man of Steel", "youtubeUrl": "https://www.youtube.com/watch?v=wArmHSPIvlQ"}
    ]
};

//Finding the root div element
const app = document.getElementById('root');

function InsertBoxes() {
    //Initiate variable for sorted array after Title
    let moviesSorted = jsonData.movies.sort(function(a, b) {
        let titleA = a.title.toUpperCase(); // ignore upper and lowercase
        let titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }

        //Equal
        return 0;
    });

    //Going through each movie in the JSON array, create a div element and attach it to the div "box-content" element
    moviesSorted.forEach(function (movie) {
        let appContent = document.getElementById("box-content");

        let box = document.createElement("div");
        box.setAttribute("class", "box");
        box.setAttribute("id", "" + movie.title);

        let title = document.createElement("h1");
        title.innerText = movie.title;

        box.appendChild(title);
        appContent.appendChild(box);
    });
}

function FetchMovieInfo(movie) {
    let movieBox = document.getElementById("" + movie.title);

    //We replace white space with + allow the string to be used on url;
    let titleString = movie.title.replace(" ", "+");
    let url = "http://www.omdbapi.com/?apikey=c6d68ef6&t=" + titleString;
    
    //Proxy url to enable CORS on publishing platform. (fetch(proxyUrl+url))
    let proxyUrl = "https://cors-anywhere.herokuapp.com/";
    
    fetch(proxyUrl+url)
        //When the promise is resolved we extract the JSON part of the response object
        .then(response => {
            return response.json();
        })
        //Then we can work with the JSON data.
        .then(data => {
            //Create image element and set the source content
            let image = document.createElement("img");
            image.classList.add("poster")
            image.setAttribute("src","" + data.Poster);

            //Create p element and set rating from Imdb
            let imdbRating = document.createElement("p");
            imdbRating.innerText = "ImdbRating: " + data.imdbRating;

            //Create p element and set the age of the movie allowed to watch it
            let rated = document.createElement("p");
            rated.innerText = "Age of Movie: " + data.Rated;

            //Create p element and set the plot
            let plot = document.createElement("p");
            plot.innerText = data.Plot;

            //Create iframe element, set the width, length, allow fullscreen and set the source to the youtube video trailer for the movie
            let trailer = document.createElement("iframe");
            trailer.setAttribute("width", "400");
            trailer.setAttribute("height", "200");
            trailer.setAttribute("allowfullscreen", "allowfullscreen");
            trailer.setAttribute("src", "" + youtube.generateEmbedUrl(movie.youtubeUrl));

            //Attach all the element to their correct movie box
            movieBox.appendChild(image);
            movieBox.appendChild(imdbRating);
            movieBox.appendChild(rated);
            movieBox.appendChild(plot);
            movieBox.appendChild(trailer);
        })
        //Error Handling
        .catch(err => {
            // Do something for an error here
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
            app.appendChild(errorMessage);
        });
}

let youtube = {
    /*
        Expect an argument that is either a youtube Url or a Id and returns back the Id
     */
    getIdFromUrl: function (videoIdOrUrl) {
        if(videoIdOrUrl.indexOf('http') === 0){
            return videoIdOrUrl.split('v=')[1];
        } else{
            return videoIdOrUrl;
        }
    },

    /*
        Expect an argument that is either a youtube Url or a Id and returns the thumbnail for that video
     */
    generateThumbnailUrl: function (videoIdOrUrl) {
        return 'https://i3.ytimg.com/vi/' + youtube.getIdFromUrl(videoIdOrUrl);
    },

    /*
        Expects an argument that is either a youtube Url or a Id, and returns back the embed Url for that video
    */

    generateEmbedUrl: function (videoIdOrUrl) {
        return 'https://www.youtube.com/embed/' + youtube.getIdFromUrl(videoIdOrUrl);
    }
}

InsertBoxes();
jsonData.movies.forEach(movie =>{
   FetchMovieInfo(movie);
   //EmbedTrailers(movie);
});


function EmbedTrailers(movie){
    let movieBox = document.getElementById("" + movie.title);

    //Create iframe element and set the source to the youtube video trailer for the movie
    let trailer = document.createElement("iframe");
    trailer.setAttribute("width", "400");
    trailer.setAttribute("height", "200");
    trailer.setAttribute("src", "" + youtube.generateEmbedUrl(movie.youtubeUrl));
    movieBox.appendChild(trailer);
}





