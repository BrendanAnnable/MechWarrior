/**
 * @autbor Brendan Annable
 */
Ext.define('MW.camera.ThirdPersonCamera', {
	alias: 'ThirdPersonCamera',
	extend: 'MW.camera.PerspectiveCamera',
	config: {
		target: null,
		distance: 7,
		pitch: 0,
		yaw: 0
	},
	constructor: function (config) {
		this.callParent(arguments);
},
	getPosition: function () {
		var position = mat4.create();
		var target = this.getTarget();

		// translate to target's position, ignoring it's rotation
		mat4.copyTranslation(position, target.getPosition());

		// rotate camera around target
		mat4.rotateY(position, position, this.getYaw());
		mat4.rotateX(position, position, this.getPitch());

		// translate 'distance' away from target
		var distance =
		mat4.translate(position, position, [2, 2, this.getDistance()]);

		return position;
	}
});
//# sourceURL=ThirdPersonCamera.js
