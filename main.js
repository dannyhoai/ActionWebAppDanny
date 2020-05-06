"use strict";
//Defining our action movie data
const jsonData = {
    "movies": [
        {"title": "Die Hard", "youtubeUrl": "https://www.youtube.com/watch?v=QIOX44m8ktc"},
        {"title": "Rush Hour", "youtubeUrl": "https://www.youtube.com/watch?v=UuHf24GhINc"},
        {"title": "The Matrix", "youtubeUrl": "https://www.youtube.com/watch?v=m8e-FF8MsqU"},
        {"title": "The Terminator", "youtubeUrl": "https://www.youtube.com/watch?v=k64P4l2Wmeg"},
        {"title": "The Mummy", "youtubeUrl": "https://www.youtube.com/watch?v=h3ptPtxWJRs"},
        {"title": "Man of Steel", "youtubeUrl": "https://www.youtube.com/watch?v=wArmHSPIvlQ"},
        {"title": "Monty Python and the Holy Grail", "youtubeUrl" : "https://www.youtube.com/watch?v=urRkGvhXc8w"}
    ]
};

//Finding the root div element
const app = document.getElementById('root');

//Insert Card boxes on the page
function InsertCards() {
    //Initiate variable for sorted array after movie titles in alphabetical order
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

    //Going through each movie in the sorted array, create a div element with a header and attach it to the div "box-content" element
    moviesSorted.forEach(function (movie) {
        let appContent = document.getElementById("main-content");

        let card = document.createElement("div");
        card.setAttribute("class", "card");
        card.setAttribute("id", "" + movie.title);

        let title = document.createElement("h2");
        title.innerText = movie.title;

        card.appendChild(title);
        appContent.appendChild(card);
    });
}

//Fetch data from api and insert it their correct card boxes
function FetchMovieInfo(movie) {
    //Finds the card of the movie and set it in a variable for future reference
    let movieCard = document.getElementById("" + movie.title);

    //Replacing white space with + allow the string to be used on url;
    let titleString = movie.title.replace(" ", "+");
    let url = "http://www.omdbapi.com/?apikey=c6d68ef6&t=" + titleString;

    // Proxy url to enable CORS on publishing platform. (fetch(proxyUrl+url))
    // if cannot fetch then the limited amount of use on the proxy is reached
    // if local change to fetch(url) to see it work
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
            image.classList.add("poster");
            image.setAttribute("src","" + data.Poster);
            image.setAttribute("alt", "" + data.Title);

            //Create ul element
            let ulShortInfo = document.createElement("ul");

            //Create li element and set rating from Imdb, runtime and the age of the movie allowed
            let imdbRating = document.createElement("li");
            imdbRating.innerText = "ImdbRating: " + data.imdbRating + "/10";

            let rated = document.createElement("li");
            rated.innerText = "Age of Movie: " + data.Rated;

            let runtime = document.createElement("li");
            runtime.innerText = "Runtime: " + data.Runtime;

            //Adding the created lis in the ul
            ulShortInfo.appendChild(imdbRating);
            ulShortInfo.appendChild(rated);
            ulShortInfo.appendChild(runtime);

            //Create p element and set the plot
            let plot = document.createElement("p");
            plot.innerText = data.Plot;

            //Create iframe element, set the width, length, the youtube trailer source and allow fullscreen
            let trailer = document.createElement("iframe");
            trailer.setAttribute("width", "400");
            trailer.setAttribute("height", "200");
            trailer.setAttribute("allowfullscreen", "allowfullscreen");
            trailer.setAttribute("src", "" + youtube.generateEmbedUrl(movie.youtubeUrl));
            trailer.setAttribute("title", "" + movie.title)

            //Add all the elements to their movie box
            movieCard.appendChild(image);
            movieCard.appendChild(ulShortInfo);
            movieCard.appendChild(plot);
            movieCard.appendChild(trailer);
        })
        //Error Handling
        .catch(err => {
            // Add error message on the page in the root div element
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

//Invoke the functions
InsertCards();
jsonData.movies.forEach(movie =>{
   FetchMovieInfo(movie);
});






