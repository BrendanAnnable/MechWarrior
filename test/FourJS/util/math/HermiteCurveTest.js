describe("HermiteCurve", function () {
	beforeEach(function () {
		Ext.syncRequire('FourJS.util.math.HermiteCurve');
	});

	describe("Standard Curve from (0, 0) to (1, 1) with tangents (1, 0) and (1, 0)", function () {

		beforeEach(function () {
			this.startPoint = vec2.fromValues(0, 0);
			this.startTangent = vec2.fromValues(1, 0);
			this.endPoint = vec2.fromValues(1, 1);
			this.endTangent = vec2.fromValues(1, 0);

			this.curve = Ext.create('FourJS.util.math.HermiteCurve', {
				startPoint: this.startPoint,
				startTangent: this.startTangent,
				endPoint: this.endPoint,
				endTangent: this.endTangent,
				dimensions: 2
			});
		});

		it("should give the start point (0, 0) at time 0", function() {
			expect(this.curve.getPoint(0)).toEqual(vec4.fromValues(0, 0, 0, 1));
		});

		it("should give the end point (1, 1) at time 1", function() {
			expect(this.curve.getPoint(1)).toEqual(vec4.fromValues(1, 1, 0, 1));
		});

		it("should be close to (0.100, 0.028) at time 0.1", function() {
			var point = this.curve.getPoint(0.1);
			expect(point).toBeCloseToArray(vec2.fromValues(0.100, 0.028), 3);
		});

		it("should be close to (0.200, 0.104) at time 0.2", function() {
			var point = this.curve.getPoint(0.2);
			expect(point).toBeCloseToArray(vec2.fromValues(0.200, 0.104), 3);
		});

		it("should be close to (0.300, 0.216) at time 0.3", function() {
			var point = this.curve.getPoint(0.3);
			expect(point).toBeCloseToArray(vec2.fromValues(0.300, 0.216), 3);
		});

		it("should be close to (0.400, 0.352) at time 0.4", function() {
			var point = this.curve.getPoint(0.4);
			expect(point).toBeCloseToArray(vec2.fromValues(0.400, 0.352), 3);
		});

		it("should be equal to (0.5, 0.5) at time 0.5", function() {
			var point = this.curve.getPoint(0.5);
			expect(point).toBeCloseToArray(vec2.fromValues(0.500, 0.500), 3);
		});

		it("should be close to (0.600, 0.648) at time 0.6", function() {
			var point = this.curve.getPoint(0.6);
			expect(point).toBeCloseToArray(vec2.fromValues(0.600, 0.648), 3);
		});

		it("should be close to (0.700, 0.784) at time 0.7", function() {
			var point = this.curve.getPoint(0.7);
			expect(point).toBeCloseToArray(vec2.fromValues(0.700, 0.784), 3);
		});

		it("should be close to (0.800, 0.896) at time 0.8", function() {
			var point = this.curve.getPoint(0.8);
			expect(point).toBeCloseToArray(vec2.fromValues(0.800, 0.896), 3);
		});

		it("should be close to (0.900, 0.972) at time 0.9", function() {
			var point = this.curve.getPoint(0.9);
			expect(point[0]).toBeCloseTo(0.900, 3);
			expect(point[1]).toBeCloseTo(0.972, 3);
		});
	});

	describe("Linear line with constant speed from (0, 0) to (1, 1)", function () {
		beforeEach(function () {
			this.startPoint = vec2.fromValues(0, 0);
			this.startTangent = vec2.fromValues(1, 1);
			this.endPoint = vec2.fromValues(1, 1);
			this.endTangent = vec2.fromValues(1, 1);

			this.curve = Ext.create('FourJS.util.math.HermiteCurve', {
				startPoint: this.startPoint,
				startTangent: this.startTangent,
				endPoint: this.endPoint,
				endTangent: this.endTangent,
				dimensions: 2
			});
		})

		var values = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
		values.forEach(function (time) {
			it("should give the point (" + time + ", " + time + ") at time " + time, function () {
				var point = this.curve.getPoint(time);
				expect(point).toBeCloseToArray(vec2.fromValues(time, time));
			});
		});
	});
});
