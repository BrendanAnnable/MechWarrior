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
	input: null,
	config: {
		submitKey: 13   // enter
	},
	control: {
		'#': {
			update: 'onUpdate',
			hide: 'onHide'
		}
	},
	init: function () {
		var view = this.getView();
		this.messages = view.down('#messages');
		this.input = view.down('#input');
		this.input.on({
			keydown: this.onKeyDown,
			scope: this
		});
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
	/**
	 * An event triggered by the keyboard controls when the user presses the key associate with the messenger.
	 *
	 * @param hasMenuContext Whether the menu is in context or not.
	 */
	onUpdate: function (hasMenuContext) {
		var view = this.getView();
		if (hasMenuContext) {                   // check if the menu is active
			view.show();                        // show the messenger
			this.input.focus();                 // focus the textarea
		} else {
			view.hide();                        // hide the messenger
		}
	},
	/**
	 * An event triggered when the user types a message.
	 *
	 * @param input The player input.
	 * @param event The event object.
	 */
	onKeyDown: function (input, event) {
		// check if the user is submitting their message with SHIFT + ENTER
		if (event.keyCode === this.getSubmitKey() && !event.shiftKey) {
			// todo submit the message
			this.input.setValue("");            // clear the message
			event.preventDefault();             // stop a new line from appearing on enter
		}
	}
});
