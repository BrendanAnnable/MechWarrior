/**
 * @author Brendan Annable
 */
Ext.define('FourJS.camera.ThirdPersonCamera', {
	alias: 'ThirdPersonCamera',
	extend: 'FourJS.camera.PerspectiveCamera',
	requires: [
		'FourJS.util.math.BezierCurve'
	],
	curve: null,
	config: {
		target: null,
		distance: 7,
		minDistance: 0,
		rate: -5,
		pitch: 0,
		yaw: 0
	},
	constructor: function (config) {
		this.callParent(arguments);
		this.curve = Ext.create('FourJS.util.math.BezierCurve', {
			startPoint: vec3.fromValues(0, 0, this.getDistance()),
			startControlPoint: vec3.fromValues(0, -1, 0),
			endPoint: vec3.fromValues(0, 0, this.getMinDistance()),
			endControlPoint: vec3.fromValues(0, 0, 1),
			dimensions: 3
		});
	},
	getPosition: function () {
		var position = mat4.create();
		var target = this.getTarget();
		var yaw = this.getYaw();
		var pitch = this.getPitch();
		var distance = this.getDistance();
		var minDistance = this.getMinDistance();
		var rate = this.getRate();

		// translate to target's position, ignoring it's rotation
		mat4.copyTranslation(position, target.getPosition());

		// rotate camera around target
		mat4.rotateY(position, position, yaw);
		mat4.rotateX(position, position, pitch);

		// translate 'distance' away from target
		mat4.translate(position, position, [2, 2, 0]);
		if (this.getPitch() > 0) {
			// looking up, use bezier curve
			mat4.translate(position, position, this.curve.getPoint(pitch));
		} else {
			// lookup forward/down, use simple distance
			mat4.translate(position, position, [0, 0, distance]);
		}

		return position;
	}
});
//# sourceURL=ThirdPersonCamera.js
