describe("BoundingBox", function (){

	Ext.syncRequire('PhysJS.util.math.BoundingBox');

	describe("should accurately determine the axis-aligned bounding box of a set of points", function () {

		beforeEach(function () {

			this.points = [
				vec3.fromValues(1, 30, 1),
				vec3.fromValues(-5, 5, 3),
				vec3.fromValues(7, 10, 1),
				vec3.fromValues(2, -2.5, 20),
				vec3.fromValues(5, 12, -3)
			];

			this.boundingBox = Ext.create('PhysJS.util.math.BoundingBox', {
				points: this.points
			});

		});

		it("expects the min to be [-5, -2.5, -3, 0]", function () {
			expect(this.boundingBox.getMin()).toEqual(vec4.fromValues(-5, -2.5, -3, 0));
		});

		it("expects the max to be [7, 30, 20, 0]", function () {
			expect(this.boundingBox.getMax()).toEqual(vec4.fromValues(7, 30, 20, 0));
		});

		it("expects the radii to be [6, 16.25, 11.5, 0]", function () {
			expect(this.boundingBox.getRadii()).toEqual(vec4.fromValues(6, 16.25, 11.5, 0));
		});

		it("expects the center to be [1, 13.75, 8.5, 1]", function () {
			expect(this.boundingBox.getCenter()).toEqual(vec4.fromValues(1, 13.75, 8.5, 1));
		});
	});

	describe("should be able to correctly detect the collision of two bounding boxes", function () {

		beforeEach(function () {
			this.box1 = Ext.create('PhysJS.util.math.BoundingBox', {
				points: [
					vec3.fromValues(-1, -1, -1),
					vec3.fromValues(1, 1, 1)
				]
			});

			this.box2 = Ext.create('PhysJS.util.math.BoundingBox', {
				points: [
					vec3.fromValues(0, 0, 0),
					vec3.fromValues(2, 2, 2)
				]
			});

		});

		it ("describe should detect the boxes as intersecting", function () {
			expect(PhysJS.util.math.BoundingBox.intersects(this.box1, this.box2).intersects).toBe(true);
		});
	});

	describe("should be able to correctly detect the separation of two bounding boxes", function () {

		beforeEach(function () {
			this.box1 = Ext.create('PhysJS.util.math.BoundingBox', {
				points: [
					vec3.fromValues(0, 0, 0),
					vec3.fromValues(1, 1, 1)
				]
			});

			this.box2 = Ext.create('PhysJS.util.math.BoundingBox', {
				points: [
					vec3.fromValues(2, 2, 2),
					vec3.fromValues(4, 4, 4)
				]
			});

		});

		it("describe should detect the boxes as not intersecting", function () {
			expect(PhysJS.util.math.BoundingBox.intersects(this.box1, this.box2).intersects).toBe(false);
		});
	});
});