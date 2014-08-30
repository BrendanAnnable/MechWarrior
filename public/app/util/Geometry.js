Ext.define('MW.util.Geometry', {
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

		var offset = boundingBox.min.add(boundingBox.max);
		offset = offset.multiply(-0.5);

		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			vertices[i] = vertex.add(offset);
		}

	},
	computeBoundingBox: function () {
		var boundingBox = {
			min: Vector.create([Infinity, Infinity, Infinity]),
			max: Vector.create([-Infinity, -Infinity, -Infinity])
		};
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			var x = vertex.e(1);
			var y = vertex.e(2);
			var z = vertex.e(3);
			if (x < boundingBox.min.e(1)) {
				boundingBox.min.elements[0] = x;
			}
			if (x > boundingBox.max.e(1)) {
				boundingBox.max.elements[0] = x;
			}
			if (y < boundingBox.min.e(2)) {
				boundingBox.min.elements[1] = y;
			}
			if (y > boundingBox.max.e(2)) {
				boundingBox.max.elements[1] = y;
			}
			if (z < boundingBox.min.e(3)) {
				boundingBox.min.elements[2] = z;
			}
			if (z > boundingBox.max.e(3)) {
				boundingBox.max.elements[2] = z;
			}
		}

		return boundingBox;
	},
	getFlattenedVertices: function () {
		var vArray = [];
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			vArray.push(vertex.e(1));
			vArray.push(vertex.e(2));
			vArray.push(vertex.e(3));
		}
		return new Float32Array(vArray);
	},
	getFlattenedNormals: function () {
		var nArray= [];
		var vertices = this.getNormals();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			nArray.push(vertex.e(1));
			nArray.push(vertex.e(2));
			nArray.push(vertex.e(3));
		}
		return new Float32Array(nArray);
	},
	getFlattenedFaces: function () {
		var fArray = [];
		var faces = this.getFaces();
		for (var i = 0; i < faces.length; i++) {
			var face = faces[i];
			for (var j = 0; j < face.elements.length; j++) {
				var index = face.elements[j];
				fArray.push(index);
			}
		}
		return new Uint16Array(fArray);
	}
});