var express = require('express');
var http = require('http');
var favicon = require('serve-favicon');
var compression = require('compression');
var MechWarrior = require('./lib/MechWarrior');

var app = express();
var server = http.Server(app);

app.set('port', process.env.PORT || 7070);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function () {

	console.log("Express server listening on port " + app.get('port'));

});

var Promise = require("bluebird");
io = require('socket.io').listen(server);

var mechWarrior = new MechWarrior(io);

