describe("BezierEasing", function () {
	Ext.syncRequire([
		'FourJS.util.math.BezierEasing'
	]);

	describe("Standard easing with control points (1, 0) and (0, 1)", function () {

		beforeEach(function () {
			this.x1 = 1;
			this.y1 = 0;
			this.x2 = 0;
			this.y2 = 1;

			this.easing = Ext.create('FourJS.util.math.BezierEasing', {
				x1: this.x1,
				y1: this.y1,
				x2: this.x2,
				y2: this.y2
			});
		});

		it("should output 0 at input 0", function () {
			expect(this.easing.getValueAt(0)).toEqual(0);
		});

		it("should output 1 at input 1", function () {
			expect(this.easing.getValueAt(1)).toEqual(1);
		});

		it("should be close to 0.004 at input 0.1", function () {
			expect(this.easing.getValueAt(0.1)).toBeCloseTo(0.004);
		});

		it("should be close to 0.017 at input 0.2", function () {
			expect(this.easing.getValueAt(0.2)).toBeCloseTo(0.017);
		});

		it("should be close to 0.047 at input 0.3", function () {
			expect(this.easing.getValueAt(0.3)).toBeCloseTo(0.047);
		});

		it("should be close to 0.111 at input 0.4", function () {
			expect(this.easing.getValueAt(0.4)).toBeCloseTo(0.111);
		});

		it("should be close to 0.500 at input 0.5", function () {
			expect(this.easing.getValueAt(0.5)).toBeCloseTo(0.500);
		});

		it("should be close to 0.889 at input 0.6", function () {
			expect(this.easing.getValueAt(0.6)).toBeCloseTo(0.889);
		});

		it("should be close to 0.953 at input 0.7", function () {
			expect(this.easing.getValueAt(0.7)).toBeCloseTo(0.953);
		});

		it("should be close to 0.983 at input 0.8", function () {
			expect(this.easing.getValueAt(0.8)).toBeCloseTo(0.983);
		});

		it("should be close to 0.996 at input 0.9", function () {
			expect(this.easing.getValueAt(0.9)).toBeCloseTo(0.996);
		});
	});

	describe("Linear", function () {

		beforeEach(function () {
			this.x1 = 1 / 3;
			this.y1 = 1 / 3;
			this.x2 = 1 - 1 / 3;
			this.y2 = 1 - 1 / 3;

			this.easing = Ext.create('FourJS.util.math.BezierEasing', {
				x1: this.x1,
				y1: this.y1,
				x2: this.x2,
				y2: this.y2
			});
		});

		[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].forEach(function (x) {
			it("should give " + x + " at " + x, function () {
				expect(this.easing.getValueAt(x)).toBeCloseTo(x);
			});
		});
	});
});
