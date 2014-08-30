Ext.define('MW.util.PlaneGeometry', {
	extend: 'MW.util.Geometry',
	alias: 'PlaneGeometry',
	config: {
		width: 0,
		height: 0
	},
	constructor: function (config) {
		this.callParent(arguments);

		var width = this.getWidth();
		var height = this.getHeight();
		this.calcPoints(width, height);
	},
	calcPoints: function (width, height) {
		var halfWidth = width / 2;
		var halfHeight = height / 2;
		this.setVertices([
			Vector.create([-halfWidth, halfHeight, 0]),
			Vector.create([halfWidth, halfHeight, 0]),
			Vector.create([halfWidth, -halfHeight, 0]),
			Vector.create([-halfWidth, -halfHeight, 0])
		]);
		this.setNormals([
			Vector.create([0, 0, 1]),
			Vector.create([0, 0, 1]),
			Vector.create([0, 0, 1]),
			Vector.create([0, 0, 1])
		]);
		this.setFaces([
			Vector.create([0,1,2,3,0])
		]);
	}
});
