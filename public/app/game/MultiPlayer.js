Ext.define('MW.game.MultiPlayer', {
	alias: 'MultiPlayer',
	playerName: 'Twelve-60',
	socket: null,
	mixins: {
		observable: 'Ext.util.Observable'
	},
	constructor: function (config) {
		this.initConfig(config);
		this.mixins.observable.constructor.call(this, config);
		this.setupSocket();
	},
	setupSocket: function () {
		var me = this;
		me.socket = io.connect(document.location.origin);
		me.socket.on('connect', function () {
			me.socket.emit('player_connect', {
				player: {
					name: me.playerName
				}
			});
		});
		me.socket.on('game_state', Ext.bind(me.onParseState, me));
	},
	onParseState: function (message) {
		var me = this;
//		console.log('game_state', message);
		me.playerName = message.player.name;
		this.fireEvent('gameState', message);

		// attach listeners
		me.socket.on('player_update', Ext.bind(me.onPlayerUpdate, me));
		me.socket.on('player_death', Ext.bind(me.onPlayerDeath, me));
		me.socket.on('player_connect', Ext.bind(me.onPlayerConnect, me));
		me.socket.on('player_disconnect', Ext.bind(me.onPlayerDisconnect, me));
		me.socket.on('projectile_fired', Ext.bind(me.onProjectileFired, me));
	},
	onPlayerUpdate: function (message) {
//		console.log('player_update', message.player.name);
		this.fireEvent('playerUpdate', message);
	},
	onPlayerConnect: function (message) {
//		console.log('player_connect', message);
		this.fireEvent('playerConnect', message);
	},
	onPlayerDeath: function (message) {
//		console.log('player_death', message);
	},
	onPlayerDisconnect: function (message) {
//		console.log('player_disconnect', message);
		this.fireEvent('playerDisconnect', message);
	},
	onProjectileFired: function (message) {
//		console.log('projectile_fired', message);
	},
	update: function (player) {
		this.playerUpdate({
			player: {
				position: player.getPosition()
			}
		});
	},
	playerUpdate: function (message) {
		this.socket.emit('player_update', message);
	}
});
