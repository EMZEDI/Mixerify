var express = require("express");
var cors = require('cors');
var { spawn } = require("child_process");
var request = require("request");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");

// load in environment variables
require('dotenv').config();
const BACKEND_URL = process.env.BACKEND_URL
const USE_SSL = process.env.USE_SSL
const FRONTEND_URL = process.env.FRONTEND_URL
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = BACKEND_URL+"/callback";

var http = require('http');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app.use(cors());

app.use(express.static(__dirname + "/public")).use(cookieParser());

// run ML, takes in user token and playlist ID
app.post("/python", (req, res) => {
  const token = req.query.accessToken;
  const playlist = req.query.playlist;
  console.log("running ml with auth "+token)
  console.log("requested on playlist "+playlist)
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python3", ["../../PyPackage/Test.py",token,playlist]);
  // log error to console
  python.stderr.on("data", function (data){
    console.log(data.toString())
  })
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser (should be playlist ID)
    res.json({output : dataToSend});
  });
});

// login with spotify api
app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  var scope = "user-read-private user-read-email user-read-playback-state user-library-modify playlist-modify-public";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          FRONTEND_URL+"/auth/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

// start http server on port 80
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
  console.log("id: "+CLIENT_ID)
  console.log("secret: "+CLIENT_SECRET)
});

// if SSL enabled start HTTPS server
if(USE_SSL!="FALSE"){
  var fs = require('fs');
  var https = require('https');
  // letsencrypt cert
  const certificate = fs.readFileSync('/etc/letsencrypt/live/backend.spotifyai.ml/fullchain.pem', 'utf8');
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/backend.spotifyai.ml/privkey.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
}
