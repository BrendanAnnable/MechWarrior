/**
 * @author Brendan Annable
 */
Ext.define('MW.geometry.Geometry', {
	alias: 'Geometry',
	config: {
		vertices: null,
		normals: null,
		colors: null,
		faces: null,
		boundingBox: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.setVertices([]);
		this.setColors([]);
		this.setNormals([]);
		this.setFaces([]);
	},
	center: function () {
		var boundingBox = this.getBoundingBox();
		if (boundingBox === null) {
			boundingBox = this.computeBoundingBox();
		}
		var offset = vec3.add(vec3.create(), boundingBox.min, boundingBox.max);
		vec3.scale(offset, offset, -0.5);
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			vec3.add(vertex, vertex, offset);
		}
	},
	computeBoundingBox: function () {
		var boundingBox = {
			min: vec3.fromValues(Infinity, Infinity, Infinity),
			max: vec3.fromValues(-Infinity, -Infinity, -Infinity)
		};
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			var x = vertex[0];
			var y = vertex[1];
			var z = vertex[2];
			if (x < boundingBox.min[0]) {
				boundingBox.min[0] = x;
			}
			if (x > boundingBox.max[0]) {
				boundingBox.max[0] = x;
			}
			if (y < boundingBox.min[1]) {
				boundingBox.min[1] = y;
			}
			if (y > boundingBox.max[1]) {
				boundingBox.max[1] = y;
			}
			if (z < boundingBox.min[2]) {
				boundingBox.min[2] = z;
			}
			if (z > boundingBox.max[2]) {
				boundingBox.max[2] = z;
			}
		}
		return boundingBox;
	},
	getFlattenedVertices: function () {
		var vArray = [];
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			vArray.push(vertex[0]);
			vArray.push(vertex[1]);
			vArray.push(vertex[2]);
		}
		return new Float32Array(vArray);
	},
	getFlattenedNormals: function () {
		var nArray= [];
		var vertices = this.getNormals();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			nArray.push(vertex[0]);
			nArray.push(vertex[1]);
			nArray.push(vertex[2]);
		}
		return new Float32Array(nArray);
	},
	getFlattenedFaces: function () {
		var fArray = [];
		var faces = this.getFaces();
		for (var i = 0; i < faces.length; i++) {
			var face = faces[i];
			for (var j = 0; j < face.length; j++) {
				var index = face[j];
				fArray.push(index);
			}
		}
		return new Uint16Array(fArray);
	},
	getFlattenedTextureCoordinates: function () {
		var tArray = [];
		var faces = this.getFaces();
		for (var i = 0; i < faces.length * 0.5; i++) {
			tArray.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
		}
		return new Float32Array(tArray);
	},
    rotateX: function (rad) {
        var vertices = this.getVertices();
        var normals = this.getNormals();
        var origin = vec3.create();
        for (var i = 0; i < vertices.length; i++) {
            vec3.rotateX(vertices[i], vertices[i], origin, rad);
            vec3.findNormal(normals[i], normals[i]);
        }
    },
    rotateY: function (rad) {
        var vertices = this.getVertices();
        var normals = this.getNormals();
        var origin = vec3.create();
        for (var i = 0; i < vertices.length; i++) {
            vec3.rotateY(vertices[i], vertices[i], origin, rad);
            vec3.findNormal(normals[i], normals[i]);
        }
    },
    rotateZ: function (rad) {
        var vertices = this.getVertices();
        var normals = this.getNormals();
        var origin = vec3.create();
        for (var i = 0; i < vertices.length; i++) {
            vec3.rotateZ(vertices[i], vertices[i], origin, rad);
            vec3.findNormal(normals[i], normals[i]);
        }
    },
	negateNormals: function () {
		var normals = this.getNormals();
		for (var i = 0; i < normals.length; i++) {
			vec3.negate(normals[i], normals[i]);
		}
	}
});