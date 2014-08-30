Ext.define('MW.util.Scene', {
	alias: 'Geometry',
	config: {
		models: null,           // A map of models that have been loaded, keyed by their name
		mvStack: null,          // The model-view projection stack, used to keep a history of where you draw
		mvMatrix: null,         // The current model-view project matrix (where to draw)
		pMatrix: null,          // The perspective projection matrix
		lastTime: 0             // Used by the animate function, to keep track of the time between animation frames
	},
	constructor: function () {
		this.setModels({});
		this.setPMatrix(mat4.create());
		this.setMvMatrix(mat4.create());
		this.setMvStack([]);
	},
	/**
	 * Draws the WebGL scene, must be called continuously to produce animations
	 *
	 * @param gl The WebGL context
	 * @param shaders The WebGL shader program
	 * @param uniforms the callback to update the uniforms
	 */
	render: function (gl, shaders, uniforms) {
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

			var mvMatrix = this.getMvMatrix();
			var pMatrix = this.getPMatrix();

			// Create a perspective projection matrix
			mat4.perspective(pMatrix, 45 * Math.PI / 180 , gl.viewportWidth / gl.viewportHeight, 0.1, 500);
			this.mvPush();

//			this.mvPush();
//			this.renderFloor(gl, shaders, mvMatrix, periodNominator);
//			this.mvPop();

			// Translate away from the camera
			mat4.translate(mvMatrix, mvMatrix, [0, 0, -100]);

			// Move camera around character
			//var controls = this.getControls();
			//mat4.multiply(mvMatrix, mvMatrix, controls.getRotation());

			this.mvPush();
			this.renderFace(gl, shaders, uniforms, mvMatrix, periodNominator);
			this.mvPop();

			this.mvPop();
		}
		this.setLastTime(now);
	},
	renderFloor: function (gl, shaders, uniforms, mvMatrix, periodNominator) {
		// Draw the floor
		/*this.mvPush();
		 mat4.translate(mvMatrix, mvMatrix, [0, 0, 0]);
		 // Get the models map
		 var models = this.getModels();
		 var floor = models.floor;
		 // Update the floor position
		 var vertexBuffer = floor.vertexBuffer;
		 gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		 gl.vertexAttribPointer(shaders.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		 // Update the floor normals
		 var normalBuffer = floor.normalBuffer;
		 gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		 gl.vertexAttribPointer(shaders.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		 // Update the floor faces
		 var faceBuffer = floor.faceBuffer;
		 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

		 // Update the WebGL uniforms
		 this.updateUniforms(gl, shaders);

		 // Draw the face to the scene
		 //			gl.drawElements(gl.TRIANGLE_STRIP, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
		 gl.drawArrays(gl.LINE_LOOP, 0, vertexBuffer.numItems);
		 mvMatrix = this.mvPop();*/
	},
	renderFace: function (gl, shaders, uniforms, mvMatrix, periodNominator) {
		// Get the models map
		var models = this.getModels();
		// Start drawing the face
		var face = models.face;

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
		mat4.rotateY(mvMatrix, mvMatrix, yaw);
		mat4.rotateX(mvMatrix, mvMatrix, pitch);
		// Translate forward to outer radius
		mat4.translate(mvMatrix, mvMatrix, [0, 0, -radius]);
		// Rotate back so that the face always 'faces' the camera
		mat4.rotateX(mvMatrix, mvMatrix, -pitch);
		mat4.rotateY(mvMatrix, mvMatrix, -yaw);

		// Update the face position
		var vertexBuffer = face.vertexBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(shaders.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// Update the face normals
		var normalBuffer = face.normalBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.vertexAttribPointer(shaders.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// Update the face faces (ha)
		var faceBuffer = face.faceBuffer;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

		// Update the WebGL uniforms
		this.updateUniforms(gl, shaders, this.getPMatrix(), mvMatrix);

		// Draw the face to the scene
		gl.drawElements(gl.TRIANGLES, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
	},
	/**
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param pMatrix the perspective projection matrix
	 * @param mvMatrix the current model-view project matrix
	 */
	updateUniforms: function (gl, shaderProgram, pMatrix, mvMatrix) {
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

		// Send the model-view projection normal matrix to WebGL
		var normalMatrix = mat3.normalFromMat4(mat3.zeros(), mvMatrix);
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

		// Send the light position and color to WebGL
		// TODO: make these less hardcoded and into variables
		var lightPosition = vec4.fromValues(0, -1000, 0, 1);
		gl.uniform4fv(shaderProgram.uLightPos, lightPosition);
		gl.uniform3fv(shaderProgram.uLightColor, [0.6, 0, 0]);
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
					var geom = Ext.create('MW.geometry.Geometry');
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
					geom.setVertices(vertices);

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
					geom.setVertices(vertices);
					geom.setNormals(normals);
					geom.setFaces(mesh.faces);

					// Move the model's pivot point to the center of the model
					geom.center();

					// Create the WebGL buffers for the vertices, normals and faces
					var vertexBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
					vertices = geom.getFlattenedVertices();
					gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
					vertexBuffer.itemSize = 3;
					vertexBuffer.numItems = vertices.length / 3;

					var normalBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
					var normals = geom.getFlattenedNormals();
					gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
					normalBuffer.itemSize = 3;
					normalBuffer.numItems = normals.length / 3;

					var faceBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
					var faces = geom.getFlattenedFaces();
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
					faceBuffer.itemSize = 3;
					faceBuffer.numItems = faces.length / 3;

					var model = {
						vertexBuffer: vertexBuffer,
						normalBuffer: normalBuffer,
						faceBuffer: faceBuffer
					};

					// Store into the models map
					models[mesh.name] = model;
					callback.call(model);
				}, this);
			}
		});
	},
	createFloor: function (gl, name) {
		// TODO: refactor this stuff!
		var models = this.getModels();
		var plane = Ext.create('MW.geometry.PlaneGeometry', {
			width: 100,
			height: 50
		});

		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		var vertices = plane.getFlattenedVertices();
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		vertexBuffer.itemSize = 3;
		vertexBuffer.numItems = vertices.length / 3;

		var normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		var normals = plane.getFlattenedNormals();
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
		normalBuffer.itemSize = 3;
		normalBuffer.numItems = normals.length / 3;

		var faceBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
		var faces = plane.getFlattenedFaces();
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
		faceBuffer.itemSize = 3;
		faceBuffer.numItems = faces.length / 3;

		var model = {
			vertexBuffer: vertexBuffer,
			normalBuffer: normalBuffer,
			faceBuffer: faceBuffer
		};

		// Store into the models map
		models[name] = model;
	},
	/**
	 * Push a copy of the current model-view projection matrix on the stack
	 */
	mvPush: function () {
		this.getMvStack().push(mat4.clone(this.getMvMatrix()));
	},
	/**
	 * Pop the latest model-view projection matrix off the stack
	 */
	mvPop: function () {
		var mvStack = this.getMvStack();
		if (mvStack.length === 0) {
			throw "mvStack empty";
		}
		var mvMatrix = mvStack.pop();
		this.setMvMatrix(mvMatrix);
		return mvMatrix;
	}
});
