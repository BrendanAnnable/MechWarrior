/**
 * @author Monica Olejniczak
 */
Ext.define('MW.geometry.CubeGeometry', {
    extend: 'MW.geometry.Geometry',
    alias: 'CubeGeometry',
    config: {
        width: 0,
        height: 0,
        depth: 0
    },
    constructor: function () {
        this.callParent(arguments);
        var width = this.getWidth();
        var height = this.getHeight();
        var depth = this.getDepth();
        this.calculatePoints(width, height, depth);
    },
	calculatePoints: function (width, height, depth) {
		var vertices = [
			// Front face
			vec3.fromValues(-1.0, -1.0,  1.0),
			vec3.fromValues(1.0, -1.0,  1.0),
			vec3.fromValues(1.0,  1.0,  1.0),
			vec3.fromValues(-1.0,  1.0,  1.0),

			// Back face
			vec3.fromValues(-1.0, -1.0, -1.0),
			vec3.fromValues(-1.0,  1.0, -1.0),
			vec3.fromValues(1.0,  1.0, -1.0),
			vec3.fromValues(1.0, -1.0, -1.0),

			// Top face
			vec3.fromValues(-1.0,  1.0, -1.0),
			vec3.fromValues(-1.0,  1.0,  1.0),
			vec3.fromValues(1.0,  1.0,  1.0),
			vec3.fromValues(1.0,  1.0, -1.0),

			// Bottom face
			vec3.fromValues(-1.0, -1.0, -1.0),
			vec3.fromValues(1.0, -1.0, -1.0),
			vec3.fromValues(1.0, -1.0,  1.0),
			vec3.fromValues(-1.0, -1.0,  1.0),

			// Right face
			vec3.fromValues(1.0, -1.0, -1.0),
			vec3.fromValues(1.0,  1.0, -1.0),
			vec3.fromValues(1.0,  1.0,  1.0),
			vec3.fromValues(1.0, -1.0,  1.0),

			// Left face
			vec3.fromValues(-1.0, -1.0, -1.0),
			vec3.fromValues(-1.0, -1.0,  1.0),
			vec3.fromValues(-1.0,  1.0,  1.0),
			vec3.fromValues(-1.0,  1.0, -1.0)
		];
		var normals = [];
		var scale = vec3.fromValues(width / 2, height / 2, depth / 2);
		var j = vertices.length;
		for (var i = 0; i < j; i++) {
			normals[i] = vec3.create();
			vec3.copy(normals[i], vertices[i]);
			vec3.multiply(vertices[i], vertices[i], scale); //multiply(a,b,c) => a = b * c
		}
		this.setVertices(vertices);
		this.setNormals(normals);
        this.setFaces([
			vec3.fromValues(0,  1,  2),    // front
			vec3.fromValues(0,  2,  3),    // front
			vec3.fromValues(4,  5,  6),    // back
			vec3.fromValues(4,  6,  7),    // back
			vec3.fromValues(8,  9,  10),   // top
			vec3.fromValues(8,  10, 11),   // top
			vec3.fromValues(12, 13, 14),   // bottom
			vec3.fromValues(12, 14, 15),   // bottom
			vec3.fromValues(16, 17, 18),   // right
			vec3.fromValues(16, 18, 19),   // right
			vec3.fromValues(20, 21, 22),   // left
			vec3.fromValues(20, 22, 23)    // left
        ]);
    },
	getFlattenedTextureCoordinates: function () {
		var tArray = [];
		var faces = this.getFaces();
		for (var i = 0; i < faces.length * 0.5; i++) {
			tArray.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
		}
		return new Float32Array(tArray);
	}
});