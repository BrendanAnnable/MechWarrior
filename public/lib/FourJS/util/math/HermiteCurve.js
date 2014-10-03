/**
 * @author Brendan Annable
 */
Ext.define('FourJS.util.math.HermiteCurve', {
	geometry: null,
	coefficients: null,
	derivativeCoefficients: null,
	config: {
		startPoint: null,
		startTangent: null,
		endPoint: null,
		endTangent: null,
		dimensions: 3
	},
	constructor: function (config) {
		this.initConfig(config);
		this.geometry = mat4.zeros();
		this.coefficients = mat4.zeros();
		this.derivativeCoefficients = mat4.zeros();
		this.updateCoefficients();
		this.updateGeometry();
		this.updateDerivativeCoefficients();
	},
	updateCoefficients: function () {
		var m = this.coefficients;
		m[0] =  2; m[4] = -3; m[8] =  0; m[12] = 1;
		m[1] = -2; m[5] =  3; m[9] =  0; m[13] = 0;
		m[2] =  1; m[6] = -2; m[10] = 1; m[14] = 0;
		m[3] =  1; m[7] = -1; m[11] = 0; m[15] = 0;
	},
	updateDerivativeCoefficients: function () {
		var m = this.derivativeCoefficients;
		m[0] =  0; m[4] =  6; m[8] =  -6; m[12] = 0;
		m[1] =  0; m[5] = -6; m[9] =   6; m[13] = 0;
		m[2] =  0; m[6] =  3; m[10] = -4; m[14] = 1;
		m[3] =  0; m[7] =  3; m[11] = -2; m[15] = 0;
	},
	updateGeometry: function () {
		var dimensions = this.getDimensions();
		var cols = [
			this.getStartPoint(),
			this.getEndPoint(),
			this.getStartTangent(),
			this.getEndTangent()
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
		var point = vec4.transformMat4(
			vec4.create(),
			blendingVector,
			this.geometry
		);
		point[3] = 1; // make it a point
		return point;
	},
	getTangent: function (time) {
		var blendingVector = this.getDerivativeBlendingVector(time);
		var tangent = vec4.transformMat4(
			vec4.create(),
			blendingVector,
			this.geometry
		);
		return vec4.normalize(tangent, tangent);
	},
	getBlendingVector: function (time) {
		// See http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
		var timesqr = time * time;
		var timecube = timesqr * time;
		var v = vec4.fromValues(timecube, timesqr, time, 1);
		return vec4.transformMat4(v, v, this.coefficients);
	},
	getDerivativeBlendingVector: function (time) {
		// See http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
		var timesqr = time * time;
		var v = vec4.fromValues(0, timesqr, time, 1);
		return vec4.transformMat4(v, v, this.derivativeCoefficients);
	}
});