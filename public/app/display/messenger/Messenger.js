/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.messenger.Messenger', {
	alias: 'widget.Messenger',
	extend: 'Ext.container.Container',
	requires: [
		'Ext.form.field.TextArea',
		'MW.display.messenger.MessengerController'
	],
	controller: 'Messenger',
	cls: 'messenger',
	hidden: true,
	items: [{
		xtype: 'container',
		itemId: 'messages',
		cls: 'messages'
	},  {
		xtype: 'textarea',
		itemId: 'input',
		cls: 'message',
		border: false,
		enableKeyEvents: true,
		style: {
			marginTop: '1em'
		}
	}]
});