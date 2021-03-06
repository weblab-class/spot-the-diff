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
const Friends = require("./models/friends")

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

// https://www.npmjs.com/package/spotify-web-api-node#usage
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
  console.log('in api/callback');
  auth.callback(req, res, spotifyApi);
  // res.send({});
}, function(err) {
  console.log('Something went wrong!', err);
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
  const query = { spotifyId: req.query.spotifyId }
  User.findOne(query).then((user) => {
    if (user) {
      res.send({data: user});
    }
    else {
      res.send({data: 'error'})
    }
  // }).catch((err) => {
  //   console.log('error in api/user', err);
  //   res.status(400).send({data: 'error'})
    // res.status(400).send({ err });
  });
});


router.get('/getMe', auth.ensureLoggedIn, (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  // console.log(req.user)
  // const loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  
  // console.log('in getme request');
  // Get the authenticated user
  // spotifyApi.getMe()
  loggedInSpotifyApi.getMe().then(function(data) {
    console.log('Some information about the authenticated user', data.body);
    res.send(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.post("/logout", (req, res) => { auth.logout(req, res, spotifyApi) });

// whoami sends the user object stored in mongo database; i.e. with fields 'name' and 'spotifyId'
router.get("/whoami", (req, res) => {
  // console.log('in whoami')
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

router.get('/playlists', auth.ensureLoggedIn, async (req,res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  try {
    var result = await loggedInSpotifyApi.getUserPlaylists();
    // console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});

router.get('/recent', auth.ensureLoggedIn, (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  loggedInSpotifyApi.getMyRecentlyPlayedTracks({
    limit : 20
  }).then(function(data) {
    // Output items
    // console.log("Your 20 most recently played tracks are:");
    // data.body.items.forEach(item => console.log(item.track));
    res.send(data.body.items)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

router.get('/currentPlayback', auth.ensureLoggedIn, (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  loggedInSpotifyApi.getMyCurrentPlaybackState()
  .then(function(data) {
    // Output items
    if (data.body && data.body.is_playing) {
      // console.log("User is currently playing something!");
      res.send({ playback: data.body });
    } else {
      // console.log("User is not playing anything, or doing so in private.");
      res.send({ playback: null });
    }
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.get('/topTracks', auth.ensureLoggedIn, (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  
  loggedInSpotifyApi.getMyTopTracks({ 'time_range': req.query.timeRange, limit: 15, offset: 0 }).then((data) => {
    // console.log(data);
    let topTracks = data.body.items;
    // let topTitles = [];

    // topTracks.forEach(function (item, i) {
    //     let title = {
    //         name: item.name,
    //         image: item.album.images[0].url,
    //     }
    //     topTitles.push(title);
    // });

    TopTracks.findOne({ userId: req.user.spotifyId, timeRange: req.query.timeRange }).then((doc) => {
      if (doc) {
        if (JSON.stringify(doc.trackList) != JSON.stringify(topTracks)) {
          // update their document
          doc.trackList = topTracks;
          doc.save().then(() => {
            console.log(doc.userId);
            console.log('user & time already exists, updated tracks!');
            res.send(topTracks);
          })
        } 
        else {
          console.log('user & time already exists, top tracks havent changed');
          res.send(doc.trackList);
        }
      }
      else {
        //add a new document
        const tracks = new TopTracks({
          userId: req.user.spotifyId,
          trackList: topTracks,
          timeRange: req.query.timeRange,
        });

        tracks.save().then(() => {
          console.log('tracks saved to mongo');
          res.send(topTracks);
        })
      }
    });
  }).catch((err) => {
      console.log('Something went wrong in /api/topTracks!', err);
  });
})

// Gets a user's top artists, and saves them to mongo database
router.get('/topArtists', auth.ensureLoggedIn, (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  /* Get a User’s Top Artists*/
  loggedInSpotifyApi.getMyTopArtists({ 'time_range': req.query.timeRange, limit: 15, offset: 0 }).then((data) => {
    console.log('getting top artists for clientid: ', spotifyApi.getClientId());
    const topArtists = data.body.items;
    console.log('my top artists', topArtists.length);
    // return res.send({});

    // check if user exists in database: if yes, update their document
    // if not, add a new document
    TopArtists.findOne({ userId: req.user.spotifyId, timeRange: req.query.timeRange }).then((doc) => {
      console.log('finding top artists for: ', req.user.spotifyId);
      if (doc) {
        if (JSON.stringify(doc.artistList) != JSON.stringify(topArtists)) {
          // update their document
          doc.artistList = topArtists;
          doc.save().then(() => {
            // console.log(doc.userId);
            console.log('user & time already exists, updated top artists');
            res.send(topArtists);
          })
        }
        else {
          console.log('user & time already exists, top artists havent changed');
          res.send(doc.artistList);
        }
      }
      else {
        //add a new document
        const artists = new TopArtists({
          userId: req.user.spotifyId,
          artistList: topArtists,
          timeRange: req.query.timeRange,
        });
        artists.save().then(() => {
          console.log(artists.userId);
          console.log('artists saved to mongo');
          res.send(topArtists);
        })
      }
    });
  }).catch((err) => {
    console.log('Something went wrong!', err);
  });
})

router.get('/user-topArtists', (req, res) => {
  // get top artists from a specific user
  const targetId = req.query.otherId;
  console.log(targetId);
  const query = { userId: targetId, timeRange: "medium_term" };

  TopArtists.findOne(query).then((data) => {
    console.log('fetching other top artists');
    // console.log(data.artistList);
    res.send({ artists: data.artistList });
  }).catch((err) => {
    console.log(err);
    res.send({});
  })
})

router.get('/user-topTracks', (req, res) => {
  // get top tracks from a specific user
  const targetId = req.query.otherId;
  console.log('target id: ', targetId);
  const query = { userId: targetId, timeRange: "medium_term" };

  TopTracks.findOne(query).then((data) => {
    console.log('fetching other top tracks');
    // console.log(data.trackList);
    res.send({ tracks: data.trackList });
  }).catch((err) => {
    console.log(err);
    res.send({});
  })
})

router.post('/addFriend', auth.ensureLoggedIn, (req, res) => {
  const targetId = req.user.spotifyId;
  const query = { userId : targetId };
  console.log('inside api')

  // delete my friends for testing! don't do this at home kids
  // Friends.deleteMany(query).then(() => {
  //   console.log('deleted all ur friends u idiot');
  // })

  Friends.findOne(query).then((doc) => {
    // user has an ongoing friends list
    if (doc) { 
      let friends = doc.friendsList;
      let foundFriend = false;
      for (i = 0; i < friends.length; i++) {
        friend = friends[i];
        if (friend.userId === req.body.userId) {
          console.log('found friend');
          foundFriend = true;
          break;
        }
      }
      if (foundFriend == false && doc) {
        doc.friendsList = [...friends, { userId: req.body.userId, friendName: req.body.friendName, rating: 0}]
        console.log(req.body.userId)
        doc.save().then(() => {
          res.send({});
          console.log('we have fetched your friend list' );
        });
        
      } else { 
        // friend already exists in user's list 
        console.log('do nothing')
        res.send({});
      }
    } else {
      // user doesn't't have a friends list
      console.log('oop couldnt find your friend')
      const friends = new Friends({
        userId: req.user.spotifyId,
        friendsList: [{ userId: req.body.userId, friendName: req.body.friendName, rating: 0 }],
      });
      friends.save().then(() => {
        console.log('created new friend');
        res.send({})
      });
    }
  }).catch(err => {
    console.log('error in /api/addFriend: ', err);
    res.send({})
  })
})

router.get('/recommendations', (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);

  // Get Recommendations Based on Seeds
  loggedInSpotifyApi.getRecommendations({
    seed_artists: req.query.seedArtists,
    seed_genres: req.query.seedGenres,
    seed_tracks: req.query.seedTracks
  })
  .then(function(data) {
  let recommendations = data.body;
  // console.log(recommendations);
  res.send(recommendations);
  }, function(err) {
  console.log("Something went wrong!", err);
  res.send({});
  });
})

router.get('/genreSeeds', (req, res) => {
  // Get available genre seeds
  spotifyApi.getAvailableGenreSeeds()
  .then(function(data) {
    let genreSeeds = data.body;
    // console.log(genreSeeds);
    res.send(genreSeeds);
  }, function(err) {
    console.log('Something went wrong!', err);
    res.send({});
  });
})

router.get('/createPlaylist', (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);

  const playlistName = `${req.user.name} and ${req.query.friendName}'s playlist`;
  const playlistDescription = `your compatibility was ${req.query.score}%!`;
  loggedInSpotifyApi.createPlaylist(playlistName, { 'description': playlistDescription})
  .then(function(data) {
    console.log('Created playlist!');
    res.send(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
    res.send({});
  });
})

router.get('/addToPlaylist', (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setAccessToken(req.user.accessToken);
  // Add tracks to a playlist
  loggedInSpotifyApi.addTracksToPlaylist(req.query.playlistId, JSON.parse(req.query.tracks))
  .then(function(data) {
    console.log('Added tracks to playlist!');
    res.send(data)
  }, function(err) {
    console.log('Something went wrong!', err);
    res.send({})
  });
})

router.get('/getUser', (req, res) => {
  spotifyApi.getUser(req.query.userId).then((data) => {
    res.send(data.body);
  }).catch(err => {
    console.log('something went wrong in /api/getUser!', err);
    res.send({})
  });
})



router.post('/addRating', auth.ensureLoggedIn, (req, res) => {
  const targetId = req.user.spotifyId;
  const query = { userId: targetId };

  Friends.findOne(query).then((doc) => {
  //   doc.friendsList.filter((friend) => friend[0] === req.body.userId).map((friends) => {
  //     let friend = friends[0]
  //     friend[1] = req.body.rating;
  //     friend.save().then(() => res.send(doc.friendsList))
  //   })});
    if (doc) {
      let friends = doc.friendsList;
      let friendLoc = null;
      for (i = 0; i < friends.length; i++) {
        friend = friends[i];
        if (friend.userId === req.body.userId)  {
          friendLoc = i;
          console.log('found friend');
          break;
        }
        if (i === friends.length - 1) {
          console.log('didnt find friend');
        }
      } 
      // console.log(req.body.rating)
      friends[friendLoc].rating = req.body.rating;
      friends[friendLoc].friendName = req.body.friendName;
      // console.log(friends)
      friends.sort(compare);
      doc.friendsList = friends
      doc.save().then((doc) => {
        console.log(doc)
        console.log(doc.friendsList[friendLoc].rating)
        res.send(friends)
      })
    }
    else {
      console.log('couldnt find friends in api/addRating');
      return res.send({});
    }
  }).catch(err => {
    console.log('error in /api/addRating: ', err);
  })
})

compare = (a, b) => {
  let comparison = 0;
  if (a.rating > b.rating) {
    comparison = -1;
  } else {
    comparison = 1;
  }
  return comparison;
}

router.get('/friendRanking', (req, res) => {
  const targetId = req.user.spotifyId;
  const query = { userId: targetId };
  Friends.findOne(query).then((doc) => {
    if (!doc) {
      console.log('couldnt find friends in api/friendRanking');
      return res.send({});
    }
    res.send(doc.friendsList);
  }).catch(err => {
    console.log('error in /api/friendRanking: ', err);
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
