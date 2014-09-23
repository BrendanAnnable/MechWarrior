Ext.define('FourJS.util.math.HermiteSpline', {
	requires: [
		'FourJS.util.math.HermiteCurve'
	],
	segments: null,
	config: {
		points: null,
		loop: false,
		dimensions: 3
	},
	constructor: function (config) {
		this.initConfig(config);
		if (this.getPoints() === null) {
			this.setPoints([]);
		}
		this.segments = [];
		this.updateSegments();
	},
	updateSegments: function () {
		var segments = this.segments;
		var points = this.getPoints();
		var dimensions = this.getDimensions();

		if (points.length < 3) {
			throw new Error("Splining less than 3 points not supported");
		}

		if (this.getLoop() && !vec3.equal(points[0], points[points.length - 1])) {
			// if the spline is a loop, make sure the last point is the same as the first point
			points.push(vec3.clone(points[0]));
		}

		for (var i = 1; i < points.length; i++) {
			var previous = points[i - 1];
			var point = points[i];

			var previousTangent = i > 1
				? segments[i - 2].getEndTangent()
				: !this.getLoop()
				? vec3.subtract(vec3.create(), point, previous)
				: vec3.subtract(vec3.create(), points[1], points[points.length - 2]);

			var tangent = i < points.length - 1
				? vec3.subtract(vec3.create(), points[i + 1], previous)
				: !this.getLoop()
				? vec3.subtract(vec3.create(), point, previous)
				: segments[0].getStartTangent();

			segments.push(Ext.create('FourJS.util.math.HermiteCurve', {
				startPoint: previous,
				startTangent: previousTangent,
				endPoint: point,
				endTangent: tangent,
				dimensions: dimensions
			}));
		}
	},
	getPoint: function (time) {
		if (time < 0 || time > 1) {
			throw new Error("Time must be between 0 and 1");
		}

		var numSegments = this.segments.length;
		var scaledTime = time * numSegments;
		var last = scaledTime === numSegments;

		var segmentIndex = !last
			? Math.floor(scaledTime)
			: numSegments - 1;

		var segment = this.segments[segmentIndex];
		var segmentTime = !last ? scaledTime - segmentIndex : 1;

		return segment.getPoint(segmentTime);
	}
});
