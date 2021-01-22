// const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const socketManager = require("./server-socket");

// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
// const CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";
// const client = new OAuth2Client(CLIENT_ID);

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(user, accessToken) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ spotifyId: user.id }).then((existingUser) => {
    if (existingUser) {
      existingUser.accessToken = accessToken;
      return existingUser.save();
    }

    const newUser = new User({
      name: user.display_name,
      spotifyId: user.id,
      accessToken: accessToken,
    });

    return newUser.save().then(() => {
      console.log('new user saved to database: ', newUser);
    });
  });
}

const spotifyLogin = (req, res, spotifyApi) => {
  var html = spotifyApi.createAuthorizeURL(scopes)
  console.log(html)
  res.send({ url: html })
}

const callback = async (req, res, spotifyApi) => {
  const { code } = req.query;
  console.log(code)
  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    const { access_token, refresh_token } = data.body;
    console.log('access token: ', access_token);
    console.log('refresh token: ', refresh_token);
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    spotifyApi.getMe()
      .then((user) => {
        console.log('Some information about the authenticated user', user.body);
        return getOrCreateUser(user.body, access_token);
      }, (err) => {
        console.log('Something went wrong!', err);
      }).then((user) => {
        console.log('in then 2');
        req.session.user = user;
        res.redirect(process.env.CALLBACK_URI); // localhost:5000/
      }).catch((err) => {
        console.log(`Failed to log in: ${err}`);
        res.status(401).send({ err });
      });
  } catch (err) {
    console.log('error in auth.callback');
    res.redirect('/#/error/invalid token'); // what is this
  }
}

// function login(req, res) {
//   verify(req.body.token)
//     .then((user) => getOrCreateUser(user))
//     .then((user) => {
//       // persist user in the session
//       req.session.user = user;
//       res.send(user);
//     })
//     .catch((err) => {
//       console.log(`Failed to log in: ${err}`);
//       res.status(401).send({ err });
//     });
// }

function logout(req, res, spotifyApi) {
  req.session.user = null;
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

module.exports = {
  logout,
  spotifyLogin,
  callback,
  populateCurrentUser,
  ensureLoggedIn,
};
