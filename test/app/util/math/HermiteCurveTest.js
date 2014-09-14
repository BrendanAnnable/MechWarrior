describe("HermiteCurve", function () {
	beforeEach(function () {
		Ext.syncRequire('MW.util.math.HermiteCurve');
	});

	describe("Standard Curve from (0, 0) to (1, 1) with tangents (1, 0) and (1, 0)", function () {

		var startPoint = vec2.fromValues(0, 0);
		var startTangent = vec2.fromValues(1, 0);
		var endPoint = vec2.fromValues(1, 1);
		var endTangent = vec2.fromValues(1, 0);

		var curve = Ext.create('MW.util.math.HermiteCurve', {
			startPoint: startPoint,
			startTangent: startTangent,
			endPoint: endPoint,
			endTangent: endTangent,
			dimensions: 2
		});

		it("should give the start point (0, 0) at time 0", function() {
			expect(curve.getPoint(0)).toEqual(startPoint);
		});

		it("should give the end point (1, 1) at time 1", function() {
			expect(curve.getPoint(1)).toEqual(endPoint);
		});

		it("should be close to (0.100, 0.028) at time 0.1", function() {
			var point = curve.getPoint(0.1);
			expect(point[0]).toBeCloseTo(0.100, 3);
			expect(point[1]).toBeCloseTo(0.028, 3);
		});

		it("should be close to (0.200, 0.104) at time 0.2", function() {
			var point = curve.getPoint(0.2);
			expect(point[0]).toBeCloseTo(0.200, 3);
			expect(point[1]).toBeCloseTo(0.104, 3);
		});

		it("should be close to (0.300, 0.216) at time 0.3", function() {
			var point = curve.getPoint(0.3);
			expect(point[0]).toBeCloseTo(0.300, 3);
			expect(point[1]).toBeCloseTo(0.216, 3);
		});

		it("should be close to (0.400, 0.352) at time 0.4", function() {
			var point = curve.getPoint(0.4);
			expect(point[0]).toBeCloseTo(0.400, 3);
			expect(point[1]).toBeCloseTo(0.352, 3);
		});

		it("should be equal to (0.5, 0.5) at time 0.5", function() {
			var point = curve.getPoint(0.5);
			expect(point[0]).toEqual(0.5);
			expect(point[1]).toEqual(0.5);
		});

		it("should be close to (0.600, 0.648) at time 0.6", function() {
			var point = curve.getPoint(0.6);
			expect(point[0]).toBeCloseTo(0.600, 3);
			expect(point[1]).toBeCloseTo(0.648, 3);
		});

		it("should be close to (0.700, 0.784) at time 0.7", function() {
			var point = curve.getPoint(0.7);
			expect(point[0]).toBeCloseTo(0.700, 3);
			expect(point[1]).toBeCloseTo(0.784, 3);
		});

		it("should be close to (0.800, 0.896) at time 0.8", function() {
			var point = curve.getPoint(0.8);
			expect(point[0]).toBeCloseTo(0.800, 3);
			expect(point[1]).toBeCloseTo(0.896, 3);
		});

		it("should be close to (0.900, 0.972) at time 0.9", function() {
			var point = curve.getPoint(0.9);
			expect(point[0]).toBeCloseTo(0.900, 3);
			expect(point[1]).toBeCloseTo(0.972, 3);
		});
	});

	describe("Linear line with constant speed from (0, 0) to (1, 1)", function () {
		var startPoint = vec2.fromValues(0, 0);
		var startTangent = vec2.fromValues(1, 1);
		var endPoint = vec2.fromValues(1, 1);
		var endTangent = vec2.fromValues(1, 1);

		var curve = Ext.create('MW.util.math.HermiteCurve', {
			startPoint: startPoint,
			startTangent: startTangent,
			endPoint: endPoint,
			endTangent: endTangent,
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