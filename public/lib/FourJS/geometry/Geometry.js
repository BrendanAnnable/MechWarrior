/**
 * @author Brendan Annable
 */
Ext.define('FourJS.geometry.Geometry', {
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
		if (this.config.vertices === null) {
			this.setVertices([]);
		}
		if (this.config.colors === null) {
			this.setColors([]);
		}
		if (this.config.normals === null) {
			this.setNormals([]);
		}
		if (this.config.faces === null) {
			this.setFaces([]);
		}
	},
	center: function () {
		var boundingBox = this.getBoundingBox();
		var offset = vec3.add(vec3.create(), boundingBox.min, boundingBox.max);
		vec3.scale(offset, offset, -0.5);
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			var vertex = vertices[i];
			vec3.add(vertex, vertex, offset);
		}
	},
	getBoundingBox: function () {
        var boundingBox = this._boundingBox;
        if (boundingBox === null) {
            boundingBox = {
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
            this.setBoundingBox(boundingBox);
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
	translate: function (b) {
		var vertices = this.getVertices();
		for (var i = 0; i < vertices.length; i++) {
			vec3.add(vertices[i], vertices[i], b);
		}
	},
    rotateX: function (rad) {
        var vertices = this.getVertices();
        var normals = this.getNormals();
        var origin = vec3.create();
        for (var i = 0; i < vertices.length; i++) {
            vec3.rotateX(vertices[i], vertices[i], origin, rad);
			vec3.rotateX(normals[i], normals[i], origin, rad);
        }
    },
    rotateY: function (rad) {
        var vertices = this.getVertices();
        var normals = this.getNormals();
        var origin = vec3.create();
        for (var i = 0; i < vertices.length; i++) {
            vec3.rotateY(vertices[i], vertices[i], origin, rad);
			vec3.rotateY(normals[i], normals[i], origin, rad);
        }
    },
    rotateZ: function (rad) {
        var vertices = this.getVertices();
        var normals = this.getNormals();
        var origin = vec3.create();
        for (var i = 0; i < vertices.length; i++) {
            vec3.rotateZ(vertices[i], vertices[i], origin, rad);
			vec3.rotateZ(normals[i], normals[i], origin, rad);
        }
    },
    scale: function (scale) {
        var vertices = this.getVertices();
        for (var i = 0; i < vertices.length; i++) {
            vec3.multiply(vertices[i], vertices[i], scale);
        }
    },
	negateNormals: function () {
		var normals = this.getNormals();
		for (var i = 0; i < normals.length; i++) {
			vec3.negate(normals[i], normals[i]);
		}
	},
	statics: {
		getBoundingBox: function (object) {
			var points = [];
			var children = object.getAllChildren();
			children.push(object); // include self
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child.isMesh && child.getGeometry()) {
					points = points.concat(child.getGeometry().getVertices());
				}
			}
			return Ext.create('PhysJS.util.math.BoundingBox', {
				points: points
			});
		},
		/**
		 * Permanently scale the geometry of ALL objects hich uses this geometry.
		 *
		 * Also scales children geometries.
		 *
		 * Not to be used to scale a single object. Use Object.scale instead.
		 *
		 * @param object The object to scale
		 * @param scale
		 */
		scaleAll: function (object, scale) {
			var children = object.getAllChildren();
			children.push(object); // include self
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child.isMesh && child.getGeometry()) {
					var vertices = child.getGeometry().getVertices();
					for (var j = 0; j < vertices.length; j++) {
						vec3.multiply(vertices[j], vertices[j], scale);
					}
				}
			}
		}
	}
});