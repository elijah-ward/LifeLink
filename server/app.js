/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');
var unameGen = require('username-generator');
var moment = require('moment');
moment().format();

var indico = require('indico.io');
indico.apiKey =  '26cec65464998714f4d824f9511c8adc';

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }


/*//////////////////////ANALYTICS DATA////////////////*/



///Constants///

var londonLong = '42.9870';
var londonLat = '-81.2432';
var londonRad = '10km';



////////////////TWITTER API/////////////////////

var twitter_credentials = {
  key : '3uKYXpMZ0zmUQmVH3gEuMd2g7',
  secret : 'jx1y3cCGtHhGPd9J5w6gvMdSUN2o59gZf8QKbhB6WcGwzkWRQm',
  token : '3695892973-aSaz6hlnSHjpMay6z0TsAtLwYhkji56oKb9lOsK',
  access_secret : 'D7tLEjzhWt1bhSVITiutx2G8Mp1MGGKQLznAO5XdRFmtl'
};





///////////////INDICIO.IO API CREDS ARE ABOVE/////////////////






///////////////DICTIONARY API////////////////

var dictionary_credentials = {
  api_key : 'a619c4e7-ac9b-4ef8-90c1-e56f443aa7d2'
};



//////////////THESAURUS API STILL DICTIONARYAPI.COM//////////////////

var thesaurus_credentials = {
  api_key : '29b00fa8-05fe-40ce-b8ca-fd021981a495'
};



// single example
// indico.sentimentHQ("I love writing code!")
//   .then(response)
//   .catch(logError);

// batch example
// var batchInput = [
//     "I love writing code!",
//     "Alexander and the Terrible, Horrible, No Good, Very Bad Day"
// ];
// indico.sentimentHQ(batchInput)
//   .then(response)
//   .catch(logError);

app.use(express.static('../app/'));

mongoose.connect("mongodb://127.0.0.1:27017/lifelink");

// create a schema for chat
var ChatSchema = mongoose.Schema({
  created: Date,
  content: String,
  username: String,
  room: String
});

// create a model from the chat schema
var Chat = mongoose.model('Chat', ChatSchema);

// allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});


// server.js

/*||||||||||||||||||||||ROUTES|||||||||||||||||||||||||*/
// route for our index file
app.get('/', function(req, res) {
  //send the index.html in our public directory
  res.sendFile(path.resolve('../app/index.html'));
});


//This route produces a list of chat as filterd by 'room' query
app.get('/msg', function(req, res) {
  //Find
  Chat.find({
    'room': req.query.room.toLowerCase()
  }).exec(function(err, msgs) {
    //Send
    res.json(msgs);
  });
});

/*||||||||||||||||||END ROUTES|||||||||||||||||||||*/



/*||||||||||||||||SOCKET|||||||||||||||||||||||*/

var generateSessionID = function(){
  var output = Math.random().toString(36).substring(7);
  return output
};

var sessions = [];

//Listen for connection
io.on('connection', function(socket) {
  //Globals
  var defaultSession = generateSessionID();
  sessions[sessions.length] = {id:defaultSession, username : unameGen.generateUsername(), time : moment()
};
  console.log("WE ARE CONNECTED", sessions);
  //Emit the rooms array
  socket.emit('setup', {
    sessions: sessions,
  });

  //Listens for new user
  socket.on('new user', function(data) {
    console.log('NEW USER JOINED');
    data.session = defaultSession;
    //New user joins the default room
    socket.join(defaultSession);
    //Tell all those in the room that a new user joined
    io.in(defaultRoom).emit('user joined', data);
  });

    //Listens for new worker
  socket.on('new worker', function(data) {
    console.log('NEW WORKER JOINED');
    data.session = defaultSession;
    //New user joins the default room
    socket.join(defaultSession);
    //Tell all those in the room that a new user joined
    io.in(defaultRoom).emit('user joined', data);
  });



  //Listens for switch room
  socket.on('switch room', function(data) {
    console.log('SWITCHED ROOM');
    //Handles joining and leaving rooms
    //console.log(data);
    socket.leave(data.oldRoom);
    socket.join(data.newRoom);
    io.in(data.oldRoom).emit('user left', data);
    io.in(data.newRoom).emit('user joined', data);

  });

  socket.on('test', function(data){
    console.log(data);
  });

  //Listens for a new chat message
  socket.on('new message', function(data) {
    console.log('NEW MESSAGE');
    //Create message
    var newMsg = new Chat({
      username: data.username,
      content: data.message,
      room: data.room.toLowerCase(),
      created: new Date()
    });
    //Save it to database
    newMsg.save(function(err, msg){
      //Send message to those connected in the room
      io.in(msg.room).emit('message created', msg);
    });
  });

  var data = 'aloha';

app.get('https://api.twitter.com/1.1/search/tweets.json' + 'q=@' + data + 'geocode=' + londonLong+', '+londonLat+', '+londonRad, function(req,res){

console.log(res);


});


});
/*||||||||||||||||||||END SOCKETS||||||||||||||||||*/











//start the server

server.listen(3000);
console.log('Server listening on port '+'3000');



