Ext.define('FourJS.light.Light', {
	extend: 'FourJS.object.Object',
	requires: [
		'FourJS.util.Color'
	],
	config: {
		color: null,
		intensity: 1
	},
	isLight: true,
	constructor: function (config) {
		this.callParent(arguments);
		if (this.config.color === null) {
			this.setColor(Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1}));
		}
	}
});

