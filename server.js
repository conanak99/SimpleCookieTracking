// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var mongojs = require('mongojs');
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
  console.log(request.body);
  const username = request.body.username;
  const password = request.body.password;
  response.sendFile(__dirname + '/views/logined.html');
});

app.post("/register", function(request, response) {
  console.log(request.body);
  const username = request.body.username;
  const password = request.body.password;
  db.user.insert({username, password}, (err, result) => {
    console.log(result);      
    const _id = result._id;
    response.cookie('id', _id, { maxAge: 30*24*3600*100 } );
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

app.get('/user', function(request, response) {
  const id = request.cookies.id;
  console.log(id);
  db.mycollection.findOne({ _id: mongojs.ObjectId(id) }, function(err, doc) {
    response.json(doc);
  });
});

app.get('/log', function(request, response) {
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
