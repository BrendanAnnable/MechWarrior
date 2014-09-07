/**
 * @autbor Brendan Annable
 */
Ext.define('MW.camera.PerspectiveCamera', {
	alias: 'PerspectiveCamera',
	extend: 'MW.camera.Camera',
	config: {
		fov: 45,
		ratio: 1,
		near: 0.1,
		far: 2000
	},
	constructor: function () {
		this.callParent(arguments);
		this.update();
	},
	update: function () {
		mat4.perspective(this.getPerspective(), this.getFov() * Math.PI / 180, this.getRatio(), this.getNear(), this.getFar());
	}
});
