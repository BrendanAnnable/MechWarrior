/**
 * @author Brendan Annable
 */
Ext.define('MW.util.math.BezierCurve', {
	geometry: null,
	coefficients: null,
	derivativeCoefficients: null,
	config: {
		startPoint: null,
		startControlPoint: null,
		endControlPoint: null,
		endPoint: null,
		dimensions: 3
	},
	constructor: function (config) {
		this.initConfig(config);
		this.geometry = mat4.zeros();
		this.coefficients = mat4.zeros();
		this.derivativeCoefficients = mat4.zeros();
		this.updateCoefficients();
		this.updateDerivativeCoefficients();
		this.updateGeometry();
	},
	updateCoefficients: function () {
		var m = this.coefficients;
		m[0] = -1; m[4] =  3; m[8] = -3; m[12] = 1;
		m[1] =  3; m[5] = -6; m[9] =  3; m[13] = 0;
		m[2] = -3; m[6] =  3; m[10] = 0; m[14] = 0;
		m[3] =  1; m[7] =  0; m[11] = 0; m[15] = 0;
	},
	updateDerivativeCoefficients: function () {
		var m = this.derivativeCoefficients;
		m[0] =  0; m[4] =  0; m[8] =  0; m[12] = 0;
		m[1] =  0; m[5] =  3; m[9] = -6; m[13] = 3;
		m[2] =  0; m[6] = -6; m[10] = 6; m[14] = 0;
		m[3] =  0; m[7] =  3; m[11] = 0; m[15] = 0;
	},
	updateGeometry: function () {
		var dimensions = this.getDimensions();
		var cols = [
			this.getStartPoint(),
			this.getStartControlPoint(),
			this.getEndControlPoint(),
			this.getEndPoint()
		];
		for (var x = 0; x < cols.length; x++) {
			var col = cols[x];
			for (var y = 0; y < dimensions; y++) {
				this.geometry[4 * x + y] = col[y];
			}
		}
	},
	getPoint: function (time) {
		var blendingVector = this.getBlendingVector(time);
		return new Float32Array(vec4.transformMat4(
			vec4.create(),
			blendingVector,
			this.geometry
		).subarray(0, this.getDimensions()));
	},
	getY: function (x) {
		// TODO
	},
	getBlendingVector: function (time) {
		// See http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
		var timesqr = time * time;
		var timecube = timesqr * time;
		var v = vec4.fromValues(timecube, timesqr, time, 1);
		return vec4.transformMat4(v, v, this.coefficients);
	}
});