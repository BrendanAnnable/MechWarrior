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
			startPoint: vec2.fromValues(0, 0),//this.getDistance()),
			startControlPoint: vec2.fromValues(0, 0.5),
			endPoint: vec2.fromValues(1, 1), //Math.PI / 2, this.getMinDistance()),
			endControlPoint: vec2.fromValues(0.5, 1),
			dimensions: 2
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
		if (this.getPitch() > 0) {
			// linear
//			distance = distance + (minDistance() - distance) * pitch / (Math.PI / 2);
			// exponential
			//distance = (distance - minDistance) * Math.pow(2, rate * pitch) + minDistance;
			// bezier spline
			distance = distance + (minDistance - distance) * this.curve.getY(pitch / (Math.PI / 2));
		}
		mat4.translate(position, position, [2, 2, distance]);

		return position;
	}
});
//# sourceURL=ThirdPersonCamera.js
