Ext.define('MW.util.Scene', {
	alias: 'Geometry',
	config: {
		models: null,           // A map of models that have been loaded, keyed by their name
		mvStack: null,          // The model-view projection stack, used to keep a history of where you draw
		cursor: null,         // The current model-view project matrix (where to draw)
		pMatrix: null,          // The perspective projection matrix
		lastTime: 0             // Used by the animate function, to keep track of the time between animation frames
	},
	constructor: function () {
		this.setModels({});
		this.setPMatrix(mat4.create());
		this.setCursor(mat4.create());
		this.setMvStack([]);
	},
	/**
	 * Draws the WebGL scene, must be called continuously to produce animations
	 *
	 * @param gl The WebGL context
	 * @param shaders The WebGL shader program
	 */
	render: function (gl, shaders, controls) {
		/*if (gl === undefined) {
			gl = this.getGl();
		}
		if (shaders === undefined) {
			shaders = this.getShaderProgram();
		}
		if (shaders === null) {
			return;
		} */

		var now = Date.now();
		var lastTime = this.getLastTime();

		if (lastTime != 0) {
			var elapsed = now - lastTime;
			var periodNominator = 2 * Math.PI * now;

			// Set the viewport size
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

			// Clear the color buffer and depth buffer bits
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			var cursor = this.getCursor();
			var pMatrix = this.getPMatrix();

			// Create a perspective projection matrix
			mat4.perspective(pMatrix, 45 * Math.PI / 180 , gl.viewportWidth / gl.viewportHeight, 0.1, 2000);
			this.saveCursor();

			this.saveCursor();
			this.renderFloor(gl, shaders, cursor, periodNominator);
            cursor = this.restoreCursor();

			this.saveCursor();
			this.renderSkybox(gl, shaders, cursor, periodNominator);
			cursor = this.restoreCursor();

			// Translate away from the camera
			mat4.translate(cursor, cursor, [0, 0, -70]);

			/*var period = 5000;
			var angle = 2 * Math.PI * Date.now() / period;
			mat4.rotateY(cursor, cursor, angle);*/

			// Move camera around character
			//mat4.multiply(cursor, cursor, controls.getRotation());

			this.saveCursor();
			this.renderFace(gl, shaders, cursor, periodNominator);
            cursor = this.restoreCursor();

			this.restoreCursor();
		}
		this.setLastTime(now);
	},
    /**
     * Renders a specified model in the scene.
     *
     * @param gl The WebGL context
     * @param model The model to render
     * @param shaders The WebGL shader program
     * @param cursor The current model-view project matrix
     */
    renderModel: function (gl, model, shaders, cursor) {
        // Update the model position
        var vertexBuffer = model.vertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaders.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the model normals
        var normalBuffer = model.normalBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaders.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the model faces
        var faceBuffer = model.faceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

        // Update the WebGL uniforms
        this.updateUniforms(gl, shaders, this.getPMatrix(), cursor);

        gl.drawElements(gl.TRIANGLES, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
    },
    /**
     * Renders the floor model in the scene.
     *
     * @param gl The WebGL context
     * @param shaders The WebGL shader program
     * @param cursor The current model-view project matrix
     * @param periodNominator How often to update animation
     */
	renderFloor: function (gl, shaders, cursor, periodNominator) {
		mat4.translate(cursor, cursor, [0, -10, 0]);
		this.renderModel(gl, this.getModels().floor, shaders, cursor);
	},
	/**
	 * Renders the skybox model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaders The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	renderSkybox: function (gl, shaders, cursor, periodNominator) {
		mat4.translate(cursor, cursor, [-4, 2, -10]);
	//	mat4.rotateY(cursor, cursor, periodNominator / 4000);
//		mat4.rotateX(cursor, cursor, periodNominator / 4000);
		this.renderModel(gl, this.getModels().skybox, shaders, cursor);
	},
    /**
     * Renders the face model in the scene.
     *
     * @param gl The WebGL context
     * @param shaders The WebGL shader program
     * @param cursor The current model-view project matrix
     * @param periodNominator How often to update animation
     */
	renderFace: function (gl, shaders, cursor, periodNominator) {
		// This animates the face such that is rotates around a point at the given radius,
		// and 'bobs' up and down at the given height with the given periods
		var minRadius = 10;
		var maxRadius = 20;
		var radiusPeriod = 1000;
		var yawPeriod = 8000;
		var pitchPeriod = 2000;
		var height = 5;

		var radius = 0.5 * (maxRadius - minRadius) * (Math.sin(periodNominator / radiusPeriod) + 1) + minRadius;
		var yaw = periodNominator / yawPeriod;
		var pitch = Math.asin(height * Math.sin(periodNominator / pitchPeriod) / radius);

		// Rotate to the direction of where the face will be drawn
		mat4.rotateY(cursor, cursor, yaw);
		mat4.rotateX(cursor, cursor, pitch);
		// Translate forward to outer radius
		mat4.translate(cursor, cursor, [0, 0, -radius]);
		// Rotate back so that the face always 'faces' the camera
		mat4.rotateX(cursor, cursor, -pitch);
		mat4.rotateY(cursor, cursor, -yaw);
//		mat4.rotateZ(cursor, cursor, -yaw);

        this.renderModel(gl, this.getModels().face, shaders, cursor);
	},
	/**
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param pMatrix The perspective projection matrix
	 * @param cursor The current model-view project matrix
	 */
	updateUniforms: function (gl, shaderProgram, pMatrix, cursor) {
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, cursor);

		// Send the model-view projection normal matrix to WebGL
		var normalMatrix = mat3.normalFromMat4(mat3.zeros(), cursor);
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

		// Send the light position and color to WebGL
		// TODO: make these less hardcoded and into variables
		var x = 0;//100 * Math.sin(2 * Math.PI * Date.now() / 1000);
		var lightPosition = vec4.fromValues(x, -100, 0, 1);
		gl.uniform4fv(shaderProgram.uLightPos, lightPosition);
		gl.uniform3fv(shaderProgram.uLightColor, [0.0, 0, 0.8]);
	},
    /**
     * Creates a model for the scene.
     *
     * @param gl The WebGL context
     * @param geometry the geometry for the model being created
     * @param name the name of the object
     */
    createModel: function (gl, geometry, name) {
        // create the WebGL buffers for the vertices, normals and faces
        var buffers = Ext.create('MW.buffer.Buffer');
        var vertexBuffer = buffers.createVertexBuffer(gl, geometry);
        var normalBuffer = buffers.createNormalBuffer(gl, geometry);
        var faceBuffer = buffers.createFaceBuffer(gl, geometry);
        // Store the model into the models map
        this.getModels()[name] = {
            vertexBuffer: vertexBuffer,
            normalBuffer: normalBuffer,
            faceBuffer: faceBuffer
        };
    },
	/**
	 * Loads a model asynchronously
	 *
	 * @param gl The WebGL context
	 * @param modelName The name of the model file
	 * @param callback Callback that is called once the model has been loaded with
	 * the first parameter as the model
	 */
	loadModel: function (gl, modelName, callback) {
		var modelPath = Ext.Loader.getPath('MW') + '/scene/model/';
		var url = modelPath + modelName;
		var models = this.getModels();

		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				// Decode the JSON response
				var model = Ext.decode(response.responseText);
				// Get the meshes array
				var meshes = model.meshes;
				// Loop meshes array
				Ext.each(meshes, function (mesh) {
					// Create a geometry object
					var geometry = Ext.create('MW.geometry.Geometry');
					var vertices = [];
					// Loop through the flat vertices array and convert to proper Vector3 objects
					for (var i = 0; i < mesh.vertices.length; i += 3) {
						vertices.push(vec3.fromValues(
							mesh.vertices[i + 0],
							mesh.vertices[i + 1],
							mesh.vertices[i + 2]
						));
					}
					// Update the geometry vertices
                    geometry.setVertices(vertices);

					// Loop through the flat normals array and convert to proper Vector3 objects
					var normals = [];
					for (var i = 0; i < mesh.normals.length; i += 3) {
						normals.push(vec3.fromValues(
							mesh.normals[i + 0],
							mesh.normals[i + 1],
							mesh.normals[i + 2]
						));
					}
					// Update the geometry normals
                    geometry.setVertices(vertices);
                    geometry.setNormals(normals);
                    geometry.setFaces(mesh.faces);

					// Move the model's pivot point to the center of the model
                    geometry.center();
                    this.createModel(gl, geometry, mesh.name);
					callback.call(model);
				}, this);
			}
		});
	},
    /**
     * Creates a plane geometry to represent the floor in the scene.
     *
     * @param gl The WebGL context
     * @param name The name of the floor
     */
    createFloor: function (gl, name) {
        var plane = Ext.create('MW.geometry.PlaneGeometry', {
            width: 500,
            height: 200
        });
        plane.rotateX(Math.PI * 0.5);       // rotate the plane so it is horizontal to the ground
        this.createModel(gl, plane, name);  // create the model using the plane and its name
    },
	/**
	 * Creates a cube geometry to represent the skybox in the scene.
	 *
	 * @param gl The WebGL context
	 * @param name The name of the skybox
	 */
	createSkybox: function (gl, name) {
		var skybox = Ext.create('MW.geometry.CubeGeometry', {
			width: 500,
			height: 200,
			depth: 200
		});
		this.createModel(gl, skybox, name);  // create the model using the skybox and its name
	},
	/**
	 * Push a copy of the current model-view projection matrix on the stack
	 */
	saveCursor: function () {
		this.getMvStack().push(mat4.clone(this.getCursor()));
	},
	/**
	 * Pop the latest model-view projection matrix off the stack
	 */
	restoreCursor: function () {
		var mvStack = this.getMvStack();
		if (mvStack.length === 0) {
			throw "mvStack empty";
		}
		var cursor = mvStack.pop();
		this.setCursor(cursor);
		return cursor;
	}
});
