require("dotenv").config();
    var Spotify = require('node-spotify-api');
    var keys = require('./keys.js');

    var spotify = new Spotify(keys.spotify);
console.log(spotify);

process.stdout.write("\033c");

// log file 
const file_log = "log.txt";

if (!fs.existsSync(file_log)) {
    fs.writeFile(file_log, "", error => {
        if (error) {
            console.log(`Error in creating "${file_log}"\n${error}\n\n\n`);
            return;
        }
    });
}

const option = process.argv[2];
const title  = process.argv.slice(3).join(" ");

mainMenu(option, title);

function mainMenu(option = "", title) {
    switch (option.toLowerCase()) {
        case "spotify-this-song":
            getSong((title) ? title : "The Sign");
            break;

        case "movie-this":
            getMovie((title) ? title : "Mr. Nobody");
            break;

       

        default:
            saveOutput(`Error:\n"${option}" is a not valid command.\nspotify-this-song", "movie-this"\n\n`);

    }
}



function getSong(title) {
    const parameters = {
        "type" : "track",
        "query": title,
        "limit": 1
    };

    spotify.search(parameters, (error, data) => {
        if (error) {
            saveOutput(`Error in calling "Spotify"\n${error}\n\n`);
            return;
        }

    
        const song = data.tracks.items[0];

        // Display artists
        const artists = song.artists.map(a => a.name);

        //terminal 
        let output = "Spotify This Song\n";
        
        output += addSeparator();
        
        output += `Artists      : ${artists.join(", ")}\n`;
        output += `Album        : ${song.album.name}\n`;
        output += `Track        : ${song.name}\n`;
        output += `Preview link : ${song.preview_url}\n\n`;
        
        output += addSeparator() + "\n";

        saveOutput(output);
    });
}


function getMovie(title) {
    const api_url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    
    request(api_url, (error, response, body) => {
        if (error) {
            saveOutput(`Error in calling "OMDB"\n${error}\n\n`);
            return;
        }

        if (response.statusCode !== 200) {
            saveOutput(`Error in calling "OMDB"\n${response}\n\n`);
            return;
        }

        const movie = JSON.parse(body);
        let output = "Movie This\n";

        output += addSeparator();
        
        output += `Title          : ${movie.Title}\n`;
        output += `Release year   : ${movie.Year}\n`;
        output += `IMDB           : ${movie.imdbRating}\n`;
        output += `RottenTomatoes : ${(movie.Ratings[1]) ? movie.Ratings[1].Value : "N/A"}\n`;
        output += `Plot           : ${movie.Plot}\n`;
        output += `Production     : ${movie.Country}\n`;
        output += `Language       : ${movie.Language}\n\n`;
        output += `Actors         : ${movie.Actors}\n`;
        output += addSeparator() + "\n";

        saveOutput(output);
    });
}
