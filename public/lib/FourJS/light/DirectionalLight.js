Ext.define('FourJS.light.DirectionalLight', {
	extend: 'FourJS.light.Light',
	config: {
		target: null
	},
	constructor: function (config) {
		this.callParent(arguments);
		if (this.config.target === null) {
			// by default point at an object at the origin
			this.setTarget(Ext.create('FourJS.object.Object'));
		}
		if (this.config.name === null) {
			this.setName('DirectionalLight');
		}
	}
});