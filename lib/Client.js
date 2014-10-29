function Client(clientId, socket, broadcast, playerNameExists) {
	this.playerName = "Player";
	this.clientId = clientId;
	this.socket = socket;
	this.broadcast = broadcast;
	this.playerNameExists = playerNameExists;
	this.validated = false;
}

Client.prototype.validate = function () {
	this.validated = true;
};

Client.prototype.send = function (event, message) {
	if (event != 'player_update') {
//		console.log(this.clientId, event, message);
	}
	this.socket.emit(event, message);
};

Client.CLIENT_ID = 0;

module.exports = Client;

