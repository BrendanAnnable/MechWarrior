describe("Object", function () {

	Ext.syncRequire([
		'FourJS.object.Object'
	]);

	describe("should correctly define local and world position in a nested hierarchy that have each been translated", function () {

		beforeEach(function () {
			// create some objects
			this.grandParent = Ext.create('FourJS.object.Object');
			this.parent = Ext.create('FourJS.object.Object');
			this.object = Ext.create('FourJS.object.Object');
			this.child = Ext.create('FourJS.object.Object');

			// create a nested hierarchy
			this.grandParent.addChild(this.parent);
			this.parent.addChild(this.object);
			this.object.addChild(this.child);

			// translate each by an arbitrary amount
			this.grandParent.translate(1, 2, 3);
			this.parent.translate(-5, -7, -9);
			this.object.translate(2, 4, 8);
			this.child.translate(1, 1, 1);
		});

		it("grandparent local should be [1, 2, 3]", function () {
			var grandParentPosition = this.grandParent.getPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(1, 2, 3));
			expect(grandParentPosition).toBeCloseToArray(expected);
		});

		it("parent local should be [-5, -7, -9]", function () {
			var parentPosition = this.parent.getPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(-5, -7, -9));
			expect(parentPosition).toBeCloseToArray(expected);
		});

		it("object local should be [2, 4, 8]", function () {
			var objectPosition = this.object.getPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(2, 4, 8));
			expect(objectPosition).toBeCloseToArray(expected);
		});

		it("child local should be [1, 1, 1]", function () {
			var childPosition = this.child.getPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(1, 1, 1));
			expect(childPosition).toBeCloseToArray(expected);
		});

		it("grandparent world should be [1, 2, 3]", function () {
			var grandParentPosition = this.grandParent.getWorldPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(1, 2, 3));
			expect(grandParentPosition).toBeCloseToArray(expected);
		});

		it("parent world should be [-4, -5, -6]", function () {
			var parentPosition = this.parent.getWorldPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(-4, -5, -6));
			expect(parentPosition).toBeCloseToArray(expected);
		});

		it("object world should be [-2, -1, 2]", function () {
			var objectPosition = this.object.getWorldPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(-2, -1, 2));
			expect(objectPosition).toBeCloseToArray(expected);
		});

		it("object world should be [-1, 0, -3]", function () {
			var childPosition = this.child.getWorldPosition();
			var expected = mat4.create();
			mat4.translate(expected, expected, vec3.fromValues(-1, 0, 3));
			expect(childPosition).toBeCloseToArray(expected);
		});
	});

    describe("should correctly return all of its children as a single array", function () {

        beforeEach(function () {
            // create some objects
            this.grandParent = Ext.create('FourJS.object.Object');
            this.parent = Ext.create('FourJS.object.Object');
            this.object = Ext.create('FourJS.object.Object');
            this.sibling = Ext.create('FourJS.object.Object');
            this.child = Ext.create('FourJS.object.Object');

            // create a nested hierarchy
            this.grandParent.addChild(this.parent);
            this.parent.addChild(this.object);
            this.parent.addChild(this.sibling);
            this.object.addChild(this.child);
        });

        it("the children of the grandparent should include all children", function () {
            var children = this.grandParent.getAllChildren();
            expect(children).toContain(this.parent);
            expect(children).toContain(this.object);
            expect(children).toContain(this.sibling);
            expect(children).toContain(this.child);
            expect(children).not.toContain(this.grandParent);
        });

    });

});