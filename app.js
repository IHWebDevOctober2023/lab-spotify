
// ----- REQUIRES ----- //
require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

// ----- CONFIGURATION AND MIDDLEWARES ----- //
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const variable = process.env.CLIENT_ID;
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: variable,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// ---- GET ROUTES ---- //
app.get("/", (req, res) => {
    res.render("search-page");
});

app.get("/artist-search", (req, res) => {
    const requestedArtist = req.query.artist;
    spotifyApi
        .searchArtists(requestedArtist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const arrayOfArtists = data.body.artists.items;
            // NAME : arrayOfArtists[0].name
            // IMAGE: arrayOfArtists[0].images[0].url

            res.render("artist-search-results", { arrayOfArtists });

            /*  I'm creating an object to send to the page like this:
            {
                arrayOfArtists: [
                    {artist1},
                    {artist2},
                ]
            } */
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get("/albums/:artistId", (req, res) => {
    const artistId = req.params.artistId;
    spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => {
            /* 
            THIS WAS JUST A TEST TO CHECK IF THE PATH IS CORRECT
            const albumTitle = data.body.items[0].name;
             const albumImage = data.body.items[0].images[1].url
             res.send({ albumImage, albumTitle }) 
             */

            const arrayOfAlbums = data.body.items;

            res.render("albums", { arrayOfAlbums })
        })

});

app.get("/tracks/:albumId", (req, res) => {
    const albumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(albumId)
        .then((data) => {
            /* const songName = data.body.items[0].name;
            const previewUrl = data.body.items[0].preview_url;
            res.send({songName, previewUrl}) */
            const arrayOfTracks = data.body.items
            res.render("tracks", { arrayOfTracks })
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
