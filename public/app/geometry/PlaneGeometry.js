Ext.define('MW.geometry.PlaneGeometry', {
	extend: 'MW.geometry.Geometry',
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
			vec3.fromValues(-halfWidth, halfHeight, 0),
			vec3.fromValues(halfWidth, halfHeight, 0),
			vec3.fromValues(halfWidth, -halfHeight, 0),
			vec3.fromValues(-halfWidth, -halfHeight, 0)
		]);
		this.setNormals([
			vec3.fromValues(0, 0, 1),
			vec3.fromValues(0, 0, 1),
			vec3.fromValues(0, 0, 1),
			vec3.fromValues(0, 0, 1)
		]);
		this.setFaces([
			vec3.fromValues(0,1,2,3,0)
		]);
	}
});
