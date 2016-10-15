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

//This route is simply run only on first launch just to generate some chat history
app.post('/setup', function(req, res) {
  //Array of chat data. Each object properties must match the schema object properties
  var chatData = [{
    created: new Date(),
    content: 'Hi',
    username: 'Chris',
    room: 'php'
  }, {
    created: new Date(),
    content: 'Hello',
    username: 'Obinna',
    room: 'laravel'
  }, {
    created: new Date(),
    content: 'Ait',
    username: 'Bill',
    room: 'angular'
  }, {
    created: new Date(),
    content: 'Amazing room',
    username: 'Patience',
    room: 'socet.io'
  }];

  //Loop through each of the chat data and insert into the database
  for (var c = 0; c < chatData.length; c++) {
    //Create an instance of the chat model
    var newChat = new Chat(chatData[c]);
    //Call save to insert the chat
    newChat.save(function(err, savedChat) {
      console.log(savedChat);
    });
  }
  //Send a resoponse so the serve would not get stuck
  res.send('created');
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
});
/*||||||||||||||||||||END SOCKETS||||||||||||||||||*/


server.listen(3000);
console.log('Server listening on port '+'3000');



