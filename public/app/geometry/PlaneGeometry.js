/**
 * @author Brendan Annable
 */
Ext.define('MW.geometry.PlaneGeometry', { //define: makes class, create: makes instance
	extend: 'MW.geometry.Geometry',
	alias: 'PlaneGeometry',
	config: {
		width: 0,
		height: 0
	},
	constructor: function (config) {
		this.callParent(arguments);  //like java super

		var width = this.getWidth();
		var height = this.getHeight();
		this.calculatePoints(width, height);
	},
	calculatePoints: function (width, height) {
		var halfWidth = width / 2;
		var halfHeight = height / 2;
		this.setVertices([
			vec3.fromValues(-halfWidth, -halfHeight, 0),
			vec3.fromValues(halfWidth, -halfHeight, 0),
			vec3.fromValues(halfWidth, halfHeight, 0),
			vec3.fromValues(-halfWidth, halfHeight, 0)
		]);
		this.setNormals([
			vec3.fromValues(0, 0, 1),
			vec3.fromValues(0, 0, 1),
			vec3.fromValues(0, 0, 1),
			vec3.fromValues(0, 0, 1)
		]);
		this.setFaces([
			vec3.fromValues(0, 1, 2),
			vec3.fromValues(0, 2, 3)
		]);
	},
	getFlattenedTextureCoordinates: function () {
		var scale = 5; // todo find better scale
		return new Float32Array([scale, scale, -scale, scale, -scale, -scale, scale, -scale]);
	}
});
