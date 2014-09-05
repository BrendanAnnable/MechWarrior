/**
 * @autbor Brendan Annable
 */
Ext.define('MW.camera.Camera', {
	alias: 'Camera',
	extend: 'MW.object.Object',
	config: {
		perspective: null
	},
	constructor: function () {
		this.callParent(arguments);
		this.setPerspective(mat4.create());
	}
});
