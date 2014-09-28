/**
 * @autbor Brendan Annable
 */
Ext.define('FourJS.camera.PerspectiveCamera', {
	alias: 'PerspectiveCamera',
	extend: 'FourJS.camera.Camera',
	config: {
		fov: 45,
		ratio: 1,
		near: 0.1,
		far: 10000
	},
	constructor: function () {
		this.callParent(arguments);
		this.update();
	},
	update: function () {
		mat4.perspective(this.getPerspective(), this.getFov() * Math.PI / 180, this.getRatio(), this.getNear(), this.getFar());
	}
});
