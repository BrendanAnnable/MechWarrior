/**
 * @author Brendan Annable
 */
Ext.define('FourJS.util.math.BezierEasing', {
	requires: [
		'FourJS.util.math.BezierCurve'
	],
	curve: null,
	config: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 0
	},
	constructor: function (config) {
		this.initConfig(config);
		// clamp first control point between 0 and 1
		this.setX1(Math.max(0, Math.min(1, this.getX1())));
		this.setY1(Math.max(0, Math.min(1, this.getY1())));

		this.curve = Ext.create('FourJS.util.math.BezierCurve', {
			startPoint: vec2.fromValues(0, 0),
			startControlPoint: vec2.fromValues(this.getX1(), this.getY1()),
			endControlPoint: vec2.fromValues(this.getX2(), this.getY2()),
			endPoint: vec2.fromValues(1, 1),
			dimensions: 2
		});
	},
	getValueAt: function (input) {
		return this.curve.getY(input);
	}
});
