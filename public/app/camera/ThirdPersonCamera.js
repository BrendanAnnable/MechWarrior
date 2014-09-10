/**
 * @autbor Brendan Annable
 */
Ext.define('MW.camera.ThirdPersonCamera', {
	alias: 'ThirdPersonCamera',
	extend: 'MW.camera.PerspectiveCamera',
	config: {
		target: null,
		distance: 50,
		rotation: null
	},
	constructor: function (config) {
		this.callParent(arguments);
		this.setRotation(mat4.create());
	},
	getPosition: function () {
		var position = mat4.create();
		var target = this.getTarget();

		// translate to target's position, ignoring it's rotation
		mat4.copyTranslation(position, target.getPosition());

		// rotate camera around target
		mat4.multiply(position, position, this.getRotation());

		// translate 'distance' away from target
		mat4.translate(position, position, [15, 0, this.getDistance()]);

		return position;
	}
});
//# sourceURL=ThirdPersonCamera.js
