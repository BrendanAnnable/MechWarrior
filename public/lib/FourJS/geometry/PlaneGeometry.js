/**
 * @author Brendan Annable
 */
Ext.define('FourJS.geometry.PlaneGeometry', { //define: makes class, create: makes instance
	extend: 'FourJS.geometry.Geometry',
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

		var scale = 30;
		var textureCoords = [];
		textureCoords.push(
			vec2.fromValues(scale, scale),
			vec2.fromValues(-scale, scale),
			vec2.fromValues(-scale, -scale),
			vec2.fromValues(scale, -scale)
		);
		this.setTextureCoords(textureCoords);
	}
});
