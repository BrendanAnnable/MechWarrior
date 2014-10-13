describe("BezierCurve", function () {

	Ext.syncRequire([
		'FourJS.util.math.BezierCurve'
	]);

	describe("Standard Curve from (0, 0) to (1, 1) with control points (1, 0) and (0, 1)", function () {

		beforeEach(function () {
			this.startPoint = vec2.fromValues(0, 0);
			this.startControlPoint = vec2.fromValues(1, 0);
			this.endPoint = vec2.fromValues(1, 1);
			this.endControlPoint = vec2.fromValues(0, 1);

			this.curve = Ext.create('FourJS.util.math.BezierCurve', {
				startPoint: this.startPoint,
				startControlPoint: this.startControlPoint,
				endPoint: this.endPoint,
				endControlPoint: this.endControlPoint,
				dimensions: 2
			});
		});

		it("should give the start point (0, 0) at time 0", function() {
			expect(this.curve.getPoint(0)).toEqual(this.startPoint);
		});

		it("should give the end point (1, 1) at time 1", function() {
			expect(this.curve.getPoint(1)).toEqual(this.endPoint);
		});

		it("should be close to (0.244, 0.028) at time 0.1", function() {
			var point = this.curve.getPoint(0.1);
			expect(point).toBeCloseToArray(vec2.fromValues(0.244, 0.028), 3);
		});

		it("should be close to (0.392, 0.104) at time 0.2", function() {
			var point = this.curve.getPoint(0.2);
			expect(point).toBeCloseToArray(vec2.fromValues(0.392, 0.104), 3);
		});

		it("should be close to (0.468, 0.216) at time 0.3", function() {
			var point = this.curve.getPoint(0.3);
			expect(point).toBeCloseToArray(vec2.fromValues(0.468, 0.216), 3);
		});

		it("should be close to (0.496, 0.352) at time 0.4", function() {
			var point = this.curve.getPoint(0.4);
			expect(point).toBeCloseToArray(vec2.fromValues(0.496, 0.352), 3);
		});

		it("should be equal to (0.5, 0.5) at time 0.5", function() {
			var point = this.curve.getPoint(0.5);
			expect(point).toBeCloseToArray(vec2.fromValues(0.500, 0.500), 3);
		});

		it("should be close to (0.504, 0.648) at time 0.6", function() {
			var point = this.curve.getPoint(0.6);
			expect(point).toBeCloseToArray(vec2.fromValues(0.504, 0.648), 3);
		});

		it("should be close to (0.532, 0.784) at time 0.7", function() {
			var point = this.curve.getPoint(0.7);
			expect(point).toBeCloseToArray(vec2.fromValues(0.532, 0.784), 3);
		});

		it("should be close to (0.608, 0.896) at time 0.8", function() {
			var point = this.curve.getPoint(0.8);
			expect(point).toBeCloseToArray(vec2.fromValues(0.608, 0.896), 3);
		});

		it("should be close to (0.756, 0.972) at time 0.9", function() {
			var point = this.curve.getPoint(0.9);
			expect(point).toBeCloseToArray(vec2.fromValues(0.756, 0.972), 3);
		});
	});

	describe("Linear line with constant speed from (0, 0) to (1, 1)", function () {

		beforeEach(function () {
			this.startPoint = vec2.fromValues(0, 0);
			this.startControlPoint = vec2.fromValues(1 / 3, 1 / 3);
			this.endPoint = vec2.fromValues(1, 1);
			this.endControlPoint = vec2.fromValues(1 - 1 / 3, 1 - 1 / 3);

			this.curve = Ext.create('FourJS.util.math.BezierCurve', {
				startPoint: this.startPoint,
				startControlPoint: this.startControlPoint,
				endPoint: this.endPoint,
				endControlPoint: this.endControlPoint,
				dimensions: 2
			});
		});

		[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].forEach(function (time) {
			it("should give the point (" + time + ", " + time + ") at time " + time, function () {
				var point = this.curve.getPoint(time);
				expect(point).toBeCloseToArray(vec2.fromValues(time, time));
			});
		});
	});

	describe("Solving X for a given time", function () {
		beforeEach(function () {
			this.startPoint = vec2.fromValues(0, 0);
			this.startControlPoint = vec2.fromValues(1, 0);
			this.endPoint = vec2.fromValues(1, 1);
			this.endControlPoint = vec2.fromValues(0, 1);

			this.curve = Ext.create('FourJS.util.math.BezierCurve', {
				startPoint: this.startPoint,
				startControlPoint: this.startControlPoint,
				endPoint: this.endPoint,
				endControlPoint: this.endControlPoint,
				dimensions: 2
			});
		});

		[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].forEach(function (x) {
			it("should have an x value close to " + x + " for a given x of " + x, function () {
				var time = this.curve.getTime(x);
				var point = this.curve.getPoint(time);
				expect(point[0]).toBeCloseTo(x);
			});
		});
	});
});
