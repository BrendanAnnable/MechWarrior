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
		itemId: 'messages'
	},  {
		xtype: 'textarea',
		cls: 'message',
		border: false,
		style: {
			marginTop: '1em'
		}
	}]
});