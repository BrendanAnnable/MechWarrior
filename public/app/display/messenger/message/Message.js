/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.messenger.message.Message', {
	extend: 'Ext.Component',
	requires: [
		'FourJS.util.Color'
	],
	defaultColor: null,
	config: {
		color: null
	},
	initComponent: function (config) {
		this.initConfig(config);
		this.defaultColor = Ext.create('FourJS.util.Color', {r: 255, g: 255, b: 255, a: 1});
		if (this.getColor() === null) {
			this.setColor(this.defaultColor);
		}
		this.on('afterrender', function () {
			this.getEl().setStyle('color', this.getColor().getHex());
		});
	},
	getDefaultColor: function () {
		return this.defaultColor;
	}
});