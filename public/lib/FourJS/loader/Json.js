/**
 * @author Brendan Annable
 */
Ext.define('FourJS.loader.Json', {
	alias: 'JsonLoader',
	extend: 'FourJS.loader.Loader',
	requires: [
		'FourJS.object.Mesh',
		'FourJS.util.Color',
		'FourJS.geometry.Geometry',
		'FourJS.material.Phong',
		'FourJS.loader.Texture'
	],
	/**
	 * Loads a model synchronously
	 *
	 * @param json The JSON text to decode
	 */
	load: function (url, json) {
		var baseUrl = url.substr(0, url.lastIndexOf("/") + 1);
		var model = Ext.decode(json);
		// Get the model root
		var root = model.rootnode;
		// Get the materials array
		var materials = this.parseMaterials(baseUrl, model.materials);
		// Get the meshes array
		var meshes = this.parseMeshes(model.meshes, materials);
		// Loop meshes array
		var model = this.loadModel(root, meshes);
		return model;
	},
	parseMeshes: function (meshes, materials) {
		var meshArray = [];

		for (var i = 0; i < meshes.length; i++) {
			var mesh = meshes[i];
			var geometry = Ext.create('FourJS.geometry.Geometry');
			var vertices = [];
			// Loop through the flat vertices array and convert to proper Vector3 objects
			for (var j = 0; j < mesh.vertices.length; j += 3) {
				vertices.push(vec3.fromValues(
					mesh.vertices[j + 0],
					mesh.vertices[j + 1],
					mesh.vertices[j + 2]
				));
			}
			// Update the geometry vertices
			geometry.setVertices(vertices);

			// Loop through the flat normals array and convert to proper Vector3 objects
			var normals = [];
			for (j = 0; j < mesh.normals.length; j += 3) {
				normals.push(vec3.fromValues(
					mesh.normals[j + 0],
					mesh.normals[j + 1],
					mesh.normals[j + 2]
				));
			}
			// Update the geometry normals
			geometry.setVertices(vertices);
			geometry.setNormals(normals);
			geometry.setFaces(mesh.faces);
			if (mesh.texturecoords) {
				var textureCoords = [];
				for (j = 0; j < mesh.texturecoords[0].length; j += 2) {
					textureCoords.push(vec2.fromValues(
						mesh.texturecoords[0][j + 0],
						mesh.texturecoords[0][j + 1]
					));
				}
				geometry.setTextureCoords(textureCoords);
			}
			meshArray.push(Ext.create('FourJS.object.Mesh', {
				geometry: geometry,
				material: materials[mesh.materialindex] || Ext.create('FourJS.material.Phong', {
					color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1}),
					reflectivity: 1
				})
			}));
		}

		return meshArray;
	},
	parseMaterials: function (baseUrl, materials) {
		var materialArray = [];
		for (var i = 0; i < materials.length; i++) {
			var material = materials[i];
			var newMaterial = Ext.create('FourJS.material.Phong');
			for (var j = 0; j < material.properties.length; j++) {
				var property = material.properties[j];
				switch (property.key) {
					case '$tex.file':
						// prop.semantic gives the type of the texture
						// 1: diffuse
						// 2: specular mao
						// 5: height map (bumps)
						// 6: normal map
						// more values (i.e. emissive, environment) are known by assimp and may be relevant
						if (property.semantic === 1 && newMaterial.getTexture() === null) {
							newMaterial.setTexture(Ext.create('FourJS.loader.Texture', {
								url: baseUrl + property.value
							}));
						}
						break;
				}
			}
			materialArray.push(newMaterial);
		}
		return materialArray;
	},
	loadModel: function (node, meshes) {
		var object = Ext.create('FourJS.object.Object');
		object.setName(node.name);
		object.setPosition(new Float32Array(node.transformation));
		for (var i = 0; node.meshes && i < node.meshes.length; i++) {
			var mesh = meshes[node.meshes[i]];
			object.addChild(mesh);
		}
		for (i = 0; node.children && i < node.children.length; i++) {
			var child = node.children[i];
			object.addChild(this.loadModel(child, meshes));
		}
		return object;
	}
});

