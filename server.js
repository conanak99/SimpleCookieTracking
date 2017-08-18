// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it

var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var idGenerator = require('./random-id-generator');

const {USERNAME, PASSWORD, DBHOST, DBPORT, DATABASE} = process.env;
const connectionString = `mongodb://${USERNAME}:${PASSWORD}@${DBHOST}:${DBPORT}/${DATABASE}`;
var db = mongojs(connectionString, ['user', 'log']);


var app = express();
app.use(cookieParser());
app.use(expressSession({ secret:'secret-token', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Routing and cookies
app.get("/", function (request, response) {
  if (!request.cookies.id) {
    const randomId = idGenerator.getRandomId();
    console.log(randomId);
    response.cookie('id', randomId , { maxAge: 30*24*3600*100 } );
  }
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/logout', function(request, response) {
  response.clearCookie('id'); 
  response.redirect('/');
});

app.get('/log', function(request, response) {
  const userId = request.cookies.id;
  db.log.find({ userId }).sort( {time: -1} , (err, docs) => {
    response.json({ id: userId, logs: docs });
  });
});

// Tracking API
app.get('/logWrite', function(request, response) {
  const userId = request.cookies.id || 'Unknown';
  const referrer = request.header('Referer').replace(/\/$/, "");;
  const time = new Date();
  
  const log = {userId, referrer, time};
    
  db.log.insert(log, (err, result) => {    
    response.header('Access-Control-Allow-Origin', referrer);
    response.header('Access-Control-Allow-Credentials', 'true');
    
    console.log(result);
    response.json(result);
  });
});

app.get('/tracking.jpg', function(request, response) {
  const userId = request.cookies.id || 'Unknown';
  const referrer = (request.header('Referer') || 'Empty').replace(/\/$/, "");;
  const time = new Date();
  
  const log = {userId, referrer, time};
    
  db.log.insert(log, (err, result) => {    
    response.header('Access-Control-Allow-Origin', referrer);
    response.header('Access-Control-Allow-Credentials', 'true');
    response.sendFile(__dirname + '/public/track.jpg');
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
