/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.messenger.message.Player', {
	extend: 'MW.display.messenger.message.Message',
	tpl: '<strong>{player}: </strong> {message}',
	data: {
		player: '',
		message: ''
	},
	initComponent: function () {
		this.setColor(Ext.create('FourJS.util.Color', {r: 30, g: 240, b: 255, a: 1}));
		this.callParent(arguments);
	}
});