/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.loader.Model', {
	alias: 'ModelLoader',
    extend: 'MW.loader.Loader',
    /**
     * Loads a model asynchronously
     *
     * @param url The path of the model file
     */
    load: function (url) {
	    var me = this;
	    return new Promise(function (resolve) {
		    Ext.Ajax.request({
			    url: url,
			    scope: this,
			    success: function (response) {
				    // Decode the JSON response
				    var model = Ext.decode(response.responseText);
				    // Get the meshes array
				    var meshes = model.meshes;
				    // Loop meshes array
				    Ext.each(meshes, function (jMesh) {
					    // Create a mesh and geometry object
					    var geometry = Ext.create('MW.geometry.Geometry');
					    var vertices = [];
					    // Loop through the flat vertices array and convert to proper Vector3 objects
					    for (var i = 0; i < jMesh.vertices.length; i += 3) {
						    vertices.push(vec3.fromValues(
							    jMesh.vertices[i + 0],
							    jMesh.vertices[i + 1],
							    jMesh.vertices[i + 2]
						    ));
					    }
					    // Update the geometry vertices
					    geometry.setVertices(vertices);

					    // Loop through the flat normals array and convert to proper Vector3 objects
					    var normals = [];
					    for (i = 0; i < jMesh.normals.length; i += 3) {
						    normals.push(vec3.fromValues(
							    jMesh.normals[i + 0],
							    jMesh.normals[i + 1],
							    jMesh.normals[i + 2]
						    ));
					    }
					    // Update the geometry normals
					    geometry.setVertices(vertices);
					    geometry.setNormals(normals);
					    geometry.setFaces(jMesh.faces);

					    // Move the model's pivot point to the center of the model
					    me.setLoaded(true);
					    resolve(geometry);
				    }, this);
			    }
		    });
	    });
    }
});