/**
 * @author Brendan Annable
 */
Ext.define('FourJS.environment.Fog', {
	extend: 'FourJS.object.Object',
	requires: [
		'FourJS.util.Color'
	],
	config: {
		color: null,
		density: 0.1,
		easing: 0.7,
		height: -2
	},
	isFog: true,
	constructor: function (config) {
		this.callParent(arguments);
		if (this.config.color === null) {
			this.setColor(Ext.create('FourJS.util.Color', {r: 0.1, g: 0.1, b: 0.1}));
		}
	}
});
