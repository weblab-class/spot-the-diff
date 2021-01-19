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
const Badge = require("./models/badge");
const TopArtists = require("./models/top-artists");
const TopTracks = require("./models/top-tracks")

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

const SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-read-private', 
          'user-read-email',
          'playlist-modify-public',
          'playlist-modify-private', 
          'user-read-recently-played', 
          'user-top-read',
          'user-read-currently-playing',
          'user-read-playback-state']

require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URI,
});

// button on front end should call & query API for this func

router.get('/spotify-login', (req,res) => {
  // var html = spotifyApi.createAuthorizeURL(scopes)
  // console.log(html)
  // res.send({url:html})
  auth.spotifyLogin(req, res, spotifyApi)
})

router.get('/callback', async (req,res) => {
  // const { code } = req.query;
  // console.log(code)
  // try {
  //   var data = await spotifyApi.authorizationCodeGrant(code)
  //   const { access_token, refresh_token } = data.body;
  //   spotifyApi.setAccessToken(access_token);
  //   spotifyApi.setRefreshToken(refresh_token);

  //   res.redirect('http://localhost:5000');
  // } catch(err) {
  //   res.redirect('/#/error/invalid token');
  // }
  auth.callback(req, res, spotifyApi)
});

// router.post("/login", auth.login);
// router.post("/logout", auth.logout);
// router.get("/whoami", (req, res) => {
//   if (!req.user) {
//     // not logged in
//     return res.send({});
//   }

//   res.send(req.user);
// });

// do we need something like this where we pull it from mongo?? is tihs the same thing as /getMe???
router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});


router.get('/getMe', (req, res) => {
  console.log('in getme request');
  // Get the authenticated user
  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
    res.send(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.post("/logout", (req, res) => { auth.logout(req, res, spotifyApi) });

// do we need whoami? don't think so...
router.get("/whoami", (req, res) => {
  console.log('in whoami')
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

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

router.get('/currentPlayback', (req, res) => {
  spotifyApi.getMyCurrentPlaybackState()
  .then(function(data) {
    // Output items
    if (data.body && data.body.is_playing) {
      console.log("User is currently playing something!");
      res.send({ playback: data.body });
    } else {
      console.log("User is not playing anything, or doing so in private.");
      res.send({ playback: null });
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.get('/topTracks', (req, res) => {
  spotifyApi.getMyTopTracks({ limit: 6, offset: 0 })
  .then(function(data) {
    let topTracks = data.body.items;
    let topTitles = [];

    topTracks.forEach(function (item, i) {
        let title = {
            name: item.name,
            image: item.album.images[0].url,
        }
        topTitles.push(title);
    });

    TopTracks.findOne({ userId: req.user.spotifyId }).then((data) => {
      if (data && data.trackList !== topTitles) {
        // update their document
        data.trackList = topTitles;
        data.save().then(() => {
          console.log(data.userId);
          console.log('user already exists, updated tracks!');
          res.send(topTracks);
        })
      }
      else {
        //add a new document
        const tracks = new TopTracks({
          userId: req.user.spotifyId,
          trackList: topTitles,
        });

        tracks.save().then(() => {
          console.log('tracks saved to mongo');
          res.send(topTracks);
        })
      }
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

// Gets a user's top artists, and saves them to mongo database
router.get('/topArtists', (req, res) => {
  
  TopArtists.findOne({ userId: req.user.spotifyId} ).then((data) => {
    // check if artistlist is 
    // if response is defined, call spotify api

  })
  
  /* Get a User’s Top Artists*/
  spotifyApi.getMyTopArtists()
  .then(function(data) {
    let topArtists = data.body.items;
    // console.log(topArtists);

    // check if user exists in database: if yes, update their document
    // if not, add a new document
    TopArtists.findOne({ userId: req.user.spotifyId }).then((data) => {
      if (data && data.artistList !== topArtists) {
        // update their document
        data.artistList = topArtists;
        data.save().then(() => {
          console.log(data.userId);
          console.log('user already exists, updated document');
          res.send(topArtists);
        })
      }
      else {
        //add a new document
        const artists = new TopArtists({
          userId: req.user.spotifyId,
          artistList: topArtists,
        });
        artists.save().then(() => {
          console.log(artists.userId);
          console.log('new user! artists saved to mongo');
          res.send(topArtists);
        })
      }
    });
    
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.get('/user-topArtists', (req, res) => {
  // get top artists from a specific user
  const targetId = req.query.otherId;
  console.log(targetId);
  const query = { userId: targetId };

  TopArtists.findOne(query).then((data) => {
    console.log('fetching other top artists');
    console.log(data.artistList);
    res.send({ artists: data.artistList });
  }).catch((err) => {
    console.log(err);
    res.send({});
  })

})

router.post('/user-topArtists', (req, res) => {
  // post top artists for a specific user
})


router.get('/badges', (req, res) => {
  // sends back all badges belong to that user (see badge.js for mongoose schema)
})

router.post('/badges', (req, res) => {
  // posts a new badge for that user
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
