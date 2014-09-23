describe("HermiteSpline", function () {
	beforeEach(function () {
		Ext.syncRequire('FourJS.util.math.HermiteSpline');
	});

	describe("Spline of points (0, 0, 0), (1, 1, 0), (2, 0, 0)", function () {

		beforeEach(function () {
			this.points = [
				vec3.fromValues(0, 0, 0),
				vec3.fromValues(1, 1, 0),
				vec3.fromValues(2, 0, 0)
			];

			this.spline = Ext.create('FourJS.util.math.HermiteSpline', {
				points: this.points
			});
		});

		it("should give the start point (0, 0, 0) at time 0", function () {
			var point = this.spline.getPoint(0);
			expect(point).toBeCloseToArray(vec3.fromValues(0, 0, 0));
		});

		it("should give the mid point (1, 1, 0) at time 0.5", function () {
			var point = this.spline.getPoint(0.5);
			expect(point).toBeCloseToArray(vec3.fromValues(1, 1, 0));
		});

		it("should give the end point (2, 0, 0) at time 1", function () {
			var point = this.spline.getPoint(1);
			expect(point).toBeCloseToArray(vec3.fromValues(2, 0, 0));
		});

		it("should be close to the point (0.168, 0.232, 0) at time 0.1", function () {
			expect(this.spline.getPoint(0.1)).toBeCloseToArray(vec3.fromValues(0.168, 0.232, 0), 3);
		});

		it("should be close to the point (0.304, 0.496, 0) at time 0.2", function () {
			expect(this.spline.getPoint(0.2)).toBeCloseToArray(vec3.fromValues(0.304, 0.496, 0), 3);
		});

		it("should be close to the point (0.456, 0.744, 0) at time 0.3", function () {
			expect(this.spline.getPoint(0.3)).toBeCloseToArray(vec3.fromValues(0.456, 0.744, 0), 3);
		});

		it("should be close to the point (0.672, 0.928, 0) at time 0.4", function () {
			expect(this.spline.getPoint(0.4)).toBeCloseToArray(vec3.fromValues(0.672, 0.928, 0), 3);
		});

		it("should be close to the point (1, 1, 0) at time 0.5", function () {
			expect(this.spline.getPoint(0.5)).toBeCloseToArray(vec3.fromValues(1, 1, 0), 3);
		});

		it("should be close to the point (1.328, 0.928, 0) at time 0.6", function () {
			expect(this.spline.getPoint(0.6)).toBeCloseToArray(vec3.fromValues(1.328, 0.928, 0), 3);
		});

		it("should be close to the point (1.544, 0.744, 0) at time 0.7", function () {
			expect(this.spline.getPoint(0.7)).toBeCloseToArray(vec3.fromValues(1.544, 0.744, 0), 3);
		});

		it("should be close to the point (1.696, 0.496, 0) at time 0.8", function () {
			expect(this.spline.getPoint(0.8)).toBeCloseToArray(vec3.fromValues(1.696, 0.496, 0), 3);
		});

		it("should be close to the point (1.832, 0.232, 0) at time 0.9", function () {
			expect(this.spline.getPoint(0.9)).toBeCloseToArray(vec3.fromValues(1.832, 0.232, 0), 3);
		});
	});

	describe("should support looping splines", function () {

		var spline = Ext.create('FourJS.util.math.HermiteSpline', {
			points: [
				vec3.fromValues(0, 0, -1),
				vec3.fromValues(1, 0, 0),
				vec3.fromValues(0, 0, 1),
				vec3.fromValues(-1, 0, 0)
			],
			loop: true
		});

		it("should have 4 segments", function () {
			expect(spline.segments.length).toEqual(4);
		});

		it("should have a valid first segment", function () {
			var segment = spline.segments[0];
			expect(segment.getStartPoint()).toBeCloseToArray(vec3.fromValues(0, 0, -1));
			expect(segment.getStartTangent()).toBeCloseToArray(vec3.fromValues(2, 0, 0));
			expect(segment.getEndPoint()).toBeCloseToArray(vec3.fromValues(1, 0, 0));
			expect(segment.getEndTangent()).toBeCloseToArray(vec3.fromValues(0, 0, 2));
		});

		it("should have a valid second segment", function () {
			var segment = spline.segments[1];
			expect(segment.getStartPoint()).toBeCloseToArray(vec3.fromValues(1, 0, 0));
			expect(segment.getStartTangent()).toBeCloseToArray(vec3.fromValues(0, 0, 2));
			expect(segment.getEndPoint()).toBeCloseToArray(vec3.fromValues(0, 0, 1));
			expect(segment.getEndTangent()).toBeCloseToArray(vec3.fromValues(-2, 0, 0));
		});

		it("should have a valid third segment", function () {
			var segment = spline.segments[2];
			expect(segment.getStartPoint()).toBeCloseToArray(vec3.fromValues(0, 0, 1));
			expect(segment.getStartTangent()).toBeCloseToArray(vec3.fromValues(-2, 0, 0));
			expect(segment.getEndPoint()).toBeCloseToArray(vec3.fromValues(-1, 0, 0));
			expect(segment.getEndTangent()).toBeCloseToArray(vec3.fromValues(0, 0, -2));
		});

		it("should have a valid fourth segment", function () {
			var segment = spline.segments[3];
			expect(segment.getStartPoint()).toBeCloseToArray(vec3.fromValues(-1, 0, 0));
			expect(segment.getStartTangent()).toBeCloseToArray(vec3.fromValues(0, 0, -2));
			expect(segment.getEndPoint()).toBeCloseToArray(vec3.fromValues(0, 0, -1));
			expect(segment.getEndTangent()).toBeCloseToArray(vec3.fromValues(2, 0, 0));
		});

	});
});

