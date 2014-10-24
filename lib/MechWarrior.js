var util = require('util');
var events = require('events');
var Client = require('./Client');

function MechWarrior(io) {
	var me = this;

	me.clients = [];
	me.io = io;
	me.io.on('connection', function (socket) {
		var client = new Client(Client.CLIENT_ID++, socket);
		socket.on('player_connect', function (message) {
			me.validatePlayer(client, message);
			me.sendGameState(client);
			me.broadcast(client, 'player_connect', message);

			var broadcastEvents = [
				'player_update'
			];

			broadcastEvents.forEach(function (event) {
				socket.on(event, function (message) {
					message.player.name = client.playerName;
					me.broadcast(client, event, message);
				});
			});
		});

		me.clients.push(client);
//		console.log('New Player', me.clients.length);

		socket.on('disconnect', function () {
			me.clients.splice(me.clients.indexOf(client), 1);
			me.broadcast(null, 'player_disconnect', {
				player: {
					name: client.playerName
				}
			});
//			console.log('Player Lost', me.clients.length);
		});
	});

	this.io.on('player_update', this.onPlayerUpdate);
}

util.inherits(MechWarrior, events.EventEmitter);

MechWarrior.prototype.validatePlayer = function (client, message) {
	var me = this;

	var playerName = message.player.name;
	// remove non-ascii, source: http://stackoverflow.com/a/20856252/868679
	playerName = playerName.replace(/[^A-Za-z0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');

	while (me.playerNameExists(playerName)) {
		playerName += '~';
	}

	client.playerName = playerName;
	message.player.id = client.clientId;
	message.player.name = client.playerName;

	client.validate();
};

MechWarrior.prototype.sendGameState = function (client) {
	var me = this;
	var state = {};
	state.players = [];

	// attach client information
	state.player = {
		id: client.clientId,
		name: client.playerName
	};

	// attach all other client information
	me.clients.forEach(function (target) {
		var playerState = {
			id: target.clientId,
			name: target.playerName
		};
		state.players.push(playerState);
	});

	client.send('game_state', state);
};

MechWarrior.prototype.broadcast = function (client, event, message) {
	this.clients.forEach(function (target) {
		if (target !== client) {
			target.send(event, message);
		}
	});
};

MechWarrior.prototype.playerNameExists = function (playerName) {
	var result = false;
	this.clients.forEach(function (client) {
		if (client.playerName === playerName) {
			result = true;
			return false;
		}
	});
	return result;
};

MechWarrior.prototype.onPlayerUpdate = function (position) {
//	console.log(position);
};

module.exports = MechWarrior;