Ext.define('FourJS.light.AmbientLight', {
	extend: 'FourJS.light.Light',
	constructor: function (config) {
		this.callParent(arguments);
		if (this.config.name === null) {
			this.setName('AmbientLight');
		}
	}
});

