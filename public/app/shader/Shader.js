Ext.define('MW.shader.Shader', {
	config: {
		path: null
	},
	constructor: function () {
		this.setPath(Ext.Loader.getPath('MW') + '/shader');
	}
});
