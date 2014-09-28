/**
 * @autbor Brendan Annable
 */
Ext.define('FourJS.camera.Camera', {
	alias: 'Camera',
	extend: 'FourJS.object.Object',
	config: {
		perspective: null
	},
	constructor: function () {
		this.callParent(arguments);
		this.setPerspective(mat4.create());
	}
});
