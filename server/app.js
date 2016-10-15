/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('../routes'),
  api = require('../routes/api'),
  http = require('http'),
  path = require('path');
  morgan = require('morgan');
  bodyparser = require('body-parser');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('templates', '../app/templates');

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:temp', routes.templates);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});