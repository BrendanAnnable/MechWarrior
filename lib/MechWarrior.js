var util = require('util');
var events = require('events');

function MechWarrior(io) {
	this.io = io;
}

util.inherits(MechWarrior, events.EventEmitter);

module.exports = MechWarrior;