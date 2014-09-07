/**
 * @autbor Brendan Annable
 */
Ext.define('MW.camera.ThirdPersonCamera', {
	alias: 'ThirdPersonCamera',
	extend: 'MW.camera.PerspectiveCamera',
	config: {
		target: null,
		distance: 70,
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

		mat4.multiply(position, position, this.getRotation());
		mat4.translate(position, position, [0, 0, this.getDistance()]);

//		var lookAt = mat4.create();
//		var eye = vec4.fromMat4(position).subarray(0, 3);
//		var center = vec4.fromMat4(target.getPositionInverse()).subarray(0, 3);
//		mat4.lookAt(lookAt, eye, center, [0, 1, 0]);
//		mat4.othoNormalInvert(lookAt, lookAt);
//		mat4.multiply(position, position, lookAt);

		return position;
	}
});
//# sourceURL=ThirdPersonCamera.js
