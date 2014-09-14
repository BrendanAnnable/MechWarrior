describe("BezierCurve", function () {
	beforeEach(function () {
		Ext.syncRequire('MW.util.math.BezierCurve');
	});

	describe("Standard Curve from (0, 0) to (1, 1) with control points (1, 0) and (0, 1)", function () {

		var startPoint = vec2.fromValues(0, 0);
		var startControlPoint = vec2.fromValues(1, 0);
		var endPoint = vec2.fromValues(1, 1);
		var endControlPoint = vec2.fromValues(0, 1);

		var curve = Ext.create('MW.util.math.BezierCurve', {
			startPoint: startPoint,
			startControlPoint: startControlPoint,
			endPoint: endPoint,
			endControlPoint: endControlPoint,
			dimensions: 2
		});

		it("should give the start point (0, 0) at time 0", function() {
			expect(curve.getPoint(0)).toEqual(startPoint);
		});

		it("should give the end point (1, 1) at time 1", function() {
			expect(curve.getPoint(1)).toEqual(endPoint);
		});

		it("should be close to (0.244, 0.028) at time 0.1", function() {
			var point = curve.getPoint(0.1);
			expect(point[0]).toBeCloseTo(0.244, 3);
			expect(point[1]).toBeCloseTo(0.028, 3);
		});

		it("should be close to (0.392, 0.104) at time 0.2", function() {
			var point = curve.getPoint(0.2);
			expect(point[0]).toBeCloseTo(0.392, 3);
			expect(point[1]).toBeCloseTo(0.104, 3);
		});

		it("should be close to (0.468, 0.216) at time 0.3", function() {
			var point = curve.getPoint(0.3);
			expect(point[0]).toBeCloseTo(0.468, 3);
			expect(point[1]).toBeCloseTo(0.216, 3);
		});

		it("should be close to (0.496, 0.352) at time 0.4", function() {
			var point = curve.getPoint(0.4);
			expect(point[0]).toBeCloseTo(0.496, 3);
			expect(point[1]).toBeCloseTo(0.352, 3);
		});

		it("should be equal to (0.5, 0.5) at time 0.5", function() {
			var point = curve.getPoint(0.5);
			expect(point[0]).toEqual(0.5);
			expect(point[1]).toEqual(0.5);
		});

		it("should be close to (0.504, 0.648) at time 0.6", function() {
			var point = curve.getPoint(0.6);
			expect(point[0]).toBeCloseTo(0.504, 3);
			expect(point[1]).toBeCloseTo(0.648, 3);
		});

		it("should be close to (0.532, 0.784) at time 0.7", function() {
			var point = curve.getPoint(0.7);
			expect(point[0]).toBeCloseTo(0.532, 3);
			expect(point[1]).toBeCloseTo(0.784, 3);
		});

		it("should be close to (0.608, 0.896) at time 0.8", function() {
			var point = curve.getPoint(0.8);
			expect(point[0]).toBeCloseTo(0.608, 3);
			expect(point[1]).toBeCloseTo(0.896, 3);
		});

		it("should be close to (0.756, 0.972) at time 0.9", function() {
			var point = curve.getPoint(0.9);
			expect(point[0]).toBeCloseTo(0.756, 3);
			expect(point[1]).toBeCloseTo(0.972, 3);
		});
	});

	describe("Linear line with constant speed from (0, 0) to (1, 1)", function () {
		var startPoint = vec2.fromValues(0, 0);
		var startControlPoint = vec2.fromValues(1 / 3, 1 / 3);
		var endPoint = vec2.fromValues(1, 1);
		var endControlPoint = vec2.fromValues(1 - 1 / 3, 1 - 1 / 3);

		var curve = Ext.create('MW.util.math.BezierCurve', {
			startPoint: startPoint,
			startControlPoint: startControlPoint,
			endPoint: endPoint,
			endControlPoint: endControlPoint,
			dimensions: 2
		});

		[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].forEach(function (time) {
			it("should give the point (" + time + ", " + time + ") at time " + time, function () {
				var point = curve.getPoint(time);
				expect(point[0]).toBeCloseTo(time);
				expect(point[1]).toBeCloseTo(time);
			});
		});
	});
});
