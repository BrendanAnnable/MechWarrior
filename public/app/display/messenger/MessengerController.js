/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.messenger.MessengerController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.Messenger',
	requires: [
		'MW.display.messenger.message.Player'
	],
	messages: null,
	control: {
		'#': {
			update: 'onUpdate'
		}
	},
	init: function () {
		this.messages = this.getView().down('#messages');
		this.addPlayerMessage('some name', 'some message');
		this.addPlayerMessage('some name', 'some message');
	},
	/**
	 * Creates and adds a message sent by a player.
	 *
	 * @param player The name of the player.
	 * @param message The message the player is sending.
	 */
	addPlayerMessage: function (player, message) {
		var playerMessage = Ext.create('MW.display.messenger.message.Player');
		playerMessage.update({
			player: player,
			message: message
		});
		this.messages.add(playerMessage);
	},
	onUpdate: function (hasMenuContext) {
		var view = this.getView();
		if (hasMenuContext) {
			view.show();
		} else {
			view.hide();
		}
	}
});
