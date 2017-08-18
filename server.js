// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var mongojs = require('mongojs');

var ObjectId = mongojs.ObjectId;
var db = mongojs('mongodb://hoang:123456@ds145183.mlab.com:45183/tracking', ['user', 'log']);

var app = express();
app.use(cookieParser());
app.use(expressSession({ secret:'secret-token', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  if (request.cookies.id) response.redirect('/home');
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/login", function(request, response) {
  const username = request.body.username;
  const password = request.body.password;
  
  db.user.findOne({ username, password }, function(err, result) {
    if (result) {
      response.cookie('id', result._id, { maxAge: 30*24*3600*100 } );
      response.redirect('/home');
    }
    
    response.redirect('/');
  });
});

app.post("/register", function(request, response) {
  console.log(request.body);
  const username = request.body.username;
  const password = request.body.password;
  db.user.insert({username, password}, (err, result) => {    
    response.cookie('id', result._id, { maxAge: 30*24*3600*100 } );
    response.redirect('/home');
  });
});

app.get('/home', function(request, response){
  if (!request.cookies.id) response.redirect('/');
  response.sendFile(__dirname + '/views/logined.html');
});

app.get('/logout', function(request, response) {
  response.clearCookie('id'); 
  response.redirect('/');
});

// Rest API
app.get('/user', function(request, response) {
  const id = request.cookies.id;
  db.user.findOne({ _id: ObjectId('5996823a5cf7dc616f0edce0') }, function(err, doc) {
    response.json(doc);
  });
});

app.get('/logWrite', function(request, response) {
  const id = request.cookies.id || 'Unknown';
  const referrer = request.header('Referer');
  const time = new Date();
  
  const log = {id, referrer, time};
  response.header('Access-Control-Allow-Origin', referrer);
  console.log(log);
  response.json(log);
});

app.options('/', function(request, response) {
  const referrer = request.header('Referer');
  response.header('Access-Control-Allow-Origin', referrer);
  response.end(200);
});

app.get('/log', function(request, response) {
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
