/**
 * @autbor Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.Scene', {
	alias: 'Scene',
	extend: 'FourJS.object.Object',
	config: {
		lights: null
	},
	constructor: function (config) {
		this.callParent(arguments);
		if (this.getLights() === null) {
			this.setLights([]);
		}
	},
	addChild: function (object) {
		this.callParent(arguments);
		if (object.isLight) {
			this.getLights().push(object);
		}
	}
});
