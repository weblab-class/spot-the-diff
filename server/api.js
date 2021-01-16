/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-read-private', 
          'user-read-email',
          'playlist-modify-public',
          'playlist-modify-private', 
          'user-read-recently-played', 
          'user-top-read',
          'user-read-currently-playing',
          'user-read-playback-state']

require('dotenv').config();

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URI,
});

// button on front end should call & query API for this func

router.get('/spotify-login', (req,res) => {
  var html = spotifyApi.createAuthorizeURL(scopes)
  console.log(html)
  res.send({url:html})  
})

router.get('/callback', async (req,res) => {
  const { code } = req.query;
  console.log(code)
  try {
    var data = await spotifyApi.authorizationCodeGrant(code)
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect('http://localhost:5000');
  } catch(err) {
    res.redirect('/#/error/invalid token');
  }
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
// router.get("/whoami", (req, res) => {
//   if (!req.user) {
//     // not logged in
//     return res.send({});
//   }

//   res.send(req.user);
// });

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});


// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get('/playlists', async (req,res) => {
  try {
    var result = await spotifyApi.getUserPlaylists();
    console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});

router.get('/recent', (req, res) => {
  spotifyApi.getMyRecentlyPlayedTracks({
    limit : 20
  }).then(function(data) {
    // Output items
    console.log("Your 20 most recently played tracks are:");
    data.body.items.forEach(item => console.log(item.track));
    res.send(data.body.items)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

router.get('/topTracks', (req, res) => {
  spotifyApi.getMyTopTracks()
  .then(function(data) {
    let topTracks = data.body.items;
    console.log(topTracks);
    res.send(topTracks);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.get('/currentPlayback', (req, res) => {
  spotifyApi.getMyCurrentPlaybackState()
  .then(function(data) {
    // Output items
    if (data.body && data.body.is_playing) {
      console.log("User is currently playing something!");
      res.send({ data: data.body });
    } else {
      console.log("User is not playing anything, or doing so in private.");
      res.send({ data: null})
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.get('/whoami', (req, res) => {
  console.log('in who am i get request');
  // Get the authenticated user
  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
    res.send({data: data.body});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
