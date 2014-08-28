/**
 * @author Brendan Annable
 */
Ext.define('MW.view.ViewportController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ViewportController',
	config: {
		gl: null, // The webGL context
		shaderProgram: null, // The shader program containing the vertex and fragment shader
		canvas: null, // The HTML canvas used for drawing on
		mvStack: null, // The model-view projection stack, used to keep a history of where you draw
		mvMatrix: null, // The current model-view project matrix (where to draw)
		pMatrix: null, // The perspective projection matrix
		models: null, // A map of models that have been loaded, keyed by their name
		lastTime: 0 // Used by the animate function, to keep track of the time between animation frames
	},
	/**
	 * Initialization function which runs on page load
	 */
	init: function () {
		// Initialize any needed arrays or objects
		this.setPMatrix(mat4.create());
		this.setMvMatrix(mat4.create());
		this.setMvStack([]);
		this.setModels({});
	},
	/**
	 * Callback that is run when the window is resized
	 *
	 * @param container The container object that was resized
	 * @param width The new width of the container
	 * @param height The new height of the container
	 */
	onResize: function (container, width, height) {
		// Resize the WebGL viewport based on the new size
		var canvas = this.getCanvas();
		var gl = this.getGl();
		canvas.width = width;
		canvas.height = height;
		gl.viewportWidth = width;
		gl.viewportHeight = height;
	},
	onMouseMove: function (e, container) {
		// TODO
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
		this.setMvMatrix(mvStack.pop());
	},
	/**
	 * Callback that is run after the DOM has been rendered
	 *
	 * @param container The container that has been rendered
	 */
	onAfterRender: function (container) {
		var canvas = container.getEl().dom;
		this.setCanvas(canvas);

		// Setup WebGL
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		this.setGl(gl);

		// Initialize the shaders
		this.initShaders(gl, function (shaderProgram) {
			this.setShaderProgram(shaderProgram);
			// Load the face model
			this.loadModel(gl, 'face.json', function () {
				// Set the background color
				gl.clearColor(0, 0, 0, 1);
				// Enable depth testing
				gl.enable(gl.DEPTH_TEST);

				// Start the animation loop
				this.tick();
			});
		});
	},
	/**
	 * Animation tick, uses requestAnimationFrame to run as fast as possible
	 */
	tick: function () {
		this.drawScene();
		requestAnimationFrame(Ext.bind(this.tick, this));
	},
	/**
	 * Draws the WebGL scene, must be called continuously to produce animations
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 */
	drawScene: function (gl, shaderProgram) {
		if (gl === undefined) {
			gl = this.getGl();
		}
		if (shaderProgram === undefined) {
			shaderProgram = this.getShaderProgram();
		}
		if (shaderProgram === null) {
			return;
		}

		var now = Date.now();
		var lastTime = this.getLastTime();
		if (lastTime != 0) {
			var elapsed = now - lastTime;

			// Set the viewport size
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

			// Clear the color buffer and depth buffer bits
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			var mvMatrix = this.getMvMatrix();
			var pMatrix = this.getPMatrix();

			// Create a perspective projection matrix
			mat4.perspective(pMatrix, 45 * Math.PI / 180 , gl.viewportWidth / gl.viewportHeight, 0.1, 500);

			// Save current position on the stack
			this.mvPush();

			// Translate away from the camera
			mat4.translate(mvMatrix, mvMatrix, [0, 0, -50]);

			// Get the models map
			var models = this.getModels();

			// Start drawing the face
			var face = models.face;

			// Save current position on the stack
			this.mvPush();

			// This animates the face such that is rotates around a point at the given radius,
			// and 'bobs' up and down at the given height with the given periods
			var radius = 20;
			var yawPeriod = 8000;
			var pitchPeriod = 1000;
			var height = 5;
			var yaw = (2 * Math.PI * now) / yawPeriod;
			var pitch = Math.asin(height * Math.sin((2 * Math.PI * now) / pitchPeriod) / radius);

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
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// Update the face normals
			var normalBuffer = face.normalBuffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// Update the face faces (ha)
			var faceBuffer = face.faceBuffer;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

			// Update the WebGL uniforms
			this.updateUniforms(gl, shaderProgram);

			// Draw the face to the scene
			gl.drawElements(gl.TRIANGLES, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);

			// Restore original positio
			this.mvPop();
			this.mvPop();
		}
		this.setLastTime(now);
	},
	/**
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 */
	updateUniforms: function (gl, shaderProgram) {
		var pMatrix = this.getPMatrix();
		var mvMatrix = this.getMvMatrix();
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

		// Send the model-view project normal matrix to WebGL
		var normalMatrix = new Float32Array(9);
		mat3.normalFromMat4(normalMatrix, mvMatrix);
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

		// Send the light position and color to WebGL
		var lightPosition = vec4.fromValues(0, 0, -100, 1);
		gl.uniform4fv(shaderProgram.uLightPos, lightPosition);
		gl.uniform3fv(shaderProgram.uLightColor, [0.6, 0, 0]);
	},
	/**
	 * Initializes the WebGL shader program
	 *
	 * @param gl The WebGL context
	 * @param callback Callback once the shaders have been loaded with
	 * the WebGL shader program as the first parameter
	 */
	initShaders: function (gl, callback) {
		// Initialize the shaders
		this.loadShaders(gl, function (vertexShader, fragmentShader) {
			// Create a WebGL shader program
			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, vertexShader);
			gl.attachShader(shaderProgram, fragmentShader);
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
				console.error("Could not initialise shaders");
			}

			gl.useProgram(shaderProgram);

			// Setup the attributes
			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

			shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
			gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

//			shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
//			gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

			// Setup the uniforms
			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
			shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

			shaderProgram.uLightPos = gl.getUniformLocation(shaderProgram, "uLightPos");
			shaderProgram.uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");
			callback.call(this, shaderProgram);
		});
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
					var geom = Ext.create('MW.util.Geometry');
					var vertices = [];
					// Loop through the flat vertices array and convert to proper Vector3 objects
					for (var i = 0; i < mesh.vertices.length; i += 3) {
						vertices.push(Vector.create([
							mesh.vertices[i + 0],
							mesh.vertices[i + 1],
							mesh.vertices[i + 2]
						]));
					}
					// Update the geometry vertices
					geom.setVertices(vertices);

					// Move the model's pivot point to the center of the model
					geom.center();

					// Create the WebGL buffers for the vertices, normals and faces
					var vertexBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
					var vertices = geom.getFlattenedVertices();
					gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
					vertexBuffer.itemSize = 3;
					vertexBuffer.numItems = vertices.length / 3;

					var normalBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
					var normals = new Float32Array(mesh.normals);
					gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
					normalBuffer.itemSize = 3;
					normalBuffer.numItems = normals.length / 3;

					var faceArray = [];
					Ext.each(mesh.faces, function (face) {
						Ext.each(face, function (index) {
							faceArray.push(index);
						});
					});
					var faceBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
					var faces = new Uint16Array(faceArray);
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

					callback.call(this, model);
				}, this);
			}
		});
	},
	/**
	 * Load the regular vertex and fragment shaders
	 * @param gl The WebGL context
	 * @param callback Callback that is called once the shaders have been loaded with
	 * the first parameter as the vertex shader and the second as the fragment shader
	 */
	loadShaders: function (gl, callback) {
		var shaderPath = Ext.Loader.getPath('MW') + '/shader/';

		// Load the vertex and fragment shader
		this.loadVertexShader(gl, shaderPath + 'vertex.c', function (vertexShader) {
			this.loadFragmentShader(gl, shaderPath + 'fragment.c', function (fragmentShader) {
				callback.call(this, vertexShader, fragmentShader);
			});
		});
	},
	/**
	 * Load the given vertex shader
	 *
	 * @param gl The WebGL context
	 * @param url The URL of the vertex shader file
	 * @param callback Callback that is called once the shader has loaded
	 */
	loadVertexShader: function (gl, url, callback) {
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				// Use the ajax response to create and compile the shader
				var shader = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(shader, response.responseText);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.error(gl.getShaderInfoLog(shader));
				}
				callback.call(this, shader);
			}
		});
	},
	/**
	 * Load the given fragment shader
	 *
	 * @param gl The WebGL context
	 * @param url The URL of the fragment shader file
	 * @param callback Callback that is called once the shader has loaded
	 */
	loadFragmentShader: function (gl, url, callback) {
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				// Use the ajax response to create and compile the shader
				var shader = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(shader, response.responseText);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.error(gl.getShaderInfoLog(shader));
				}
				callback.call(this, shader);
			}
		});
	}
});

