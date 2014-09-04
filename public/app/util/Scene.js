Ext.define('MW.util.Scene', {
	alias: 'Scene',
	config: {
		models: null,           // A map of models that have been loaded, keyed by their name
		mvStack: null,          // The model-view projection stack, used to keep a history of where you draw
		cursor: null,           // The current model-view project matrix (where to draw)
		pMatrix: null,          // The perspective projection matrix
		playerPosition: null,   // The players current position in the level
		lastTime: 0             // Used by the animate function, to keep track of the time between animation frames
	},
	constructor: function () {
		this.setModels({});
		this.setPMatrix(mat4.create());
		this.setCursor(mat4.create());
		this.setPlayerPosition(mat4.create());
		this.setMvStack([]);
	},
	/**
	 * Draws the WebGL scene, must be called continuously to produce animations
	 *
	 * @param gl The WebGL context
	 * @param shaders The WebGL shader program
	 */
	render: function (gl, shaders, controls, keyboardControls) {
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
			mat4.identity(cursor);

			// Translate away from the camera
			mat4.translate(cursor, cursor, [0, 0, -40]);
			// Apply pitch from camera
			mat4.multiply(cursor, cursor, controls.getPitchRotation());

			this.saveCursor();
			/*var axis = vec4.fromValues(0, 1, 0, 0);
			vec4.transformMat4(axis, axis, controls.getPitchRotation());
			mat4.rotate(cursor, cursor, Math.PI, vec4.vec3(axis));*/
//			mat4.rotateY(cursor, cursor, Math.PI);

			this.renderPlayer(gl, shaders, cursor, periodNominator);
			cursor = this.restoreCursor();

			// Apply yaw from camera
			mat4.multiply(cursor, cursor, controls.getYawRotation());




			// player position
			// Simulate player moving backwards and forwards
			var position = this.getPlayerPosition();
			var period = 20000;
			var x = 80 * Math.sin(2 * Math.PI * Date.now() / period);
			var translateVector = mat4.translateVector(position);
			translateVector[0] = x;
			mat4.multiply(cursor, cursor, position);

           // TODO: fix this. it was saying the keyboard controls are undefined, possibly because the element differs..
            // Translate player position from keyboard controls
//            var translateVector = mat4.translateVector(position);
//            var tX = keyboardControls.getTransX();
//            translateVector[0] = tX;
////            translateVector[1] = keyboardControls.getTransY();
////            translateVector[2] = keyboardControls.getTransZ();
//            mat4.multiply(cursor, cursor, position);

            this.renderWorld(gl, shaders, cursor, periodNominator);
		}
		this.setLastTime(now);
	},
    /**
     * Renders a specified model in the scene.
     *
     * @param gl The WebGL context
     * @param model The model to render
     * @param shaderProgram The WebGL shader program
     * @param cursor The current model-view project matrix
     */
    renderModel: function (gl, model, shaderProgram, cursor) {
        // Update the model position
        var vertexBuffer = model.vertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the model normals
        var normalBuffer = model.normalBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the model faces
        var faceBuffer = model.faceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

        var useTexture = model.textureBuffer !== null;
        gl.uniform1i(shaderProgram.useTextureUniform, useTexture);

	    if (useTexture) {
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		    // Update the model texture
		    var textureBuffer = model.textureBuffer;
		    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureBuffer.texture);
		    gl.uniform1i(shaderProgram.samplerUniform, 0);

			// TODO: fix mee!!
			gl.uniform1i(shaderProgram.useLightingUniform, 0);
	    } else {
            gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
			gl.uniform1i(shaderProgram.useLightingUniform, 1);
        }
	    // Update the WebGL uniforms and then draw the model on the screen
	    this.updateUniforms(gl, shaderProgram, this.getPMatrix(), cursor);
	    gl.drawElements(gl.TRIANGLES, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
    },
	/**
	 * Renders the world in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaders The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	renderWorld: function (gl, shaders, cursor, periodNominator) {
		this.saveCursor();
		this.renderSkybox(gl, shaders, cursor, periodNominator);
		cursor = this.restoreCursor();

		this.saveCursor();
		this.renderFloor(gl, shaders, cursor, periodNominator);
		cursor = this.restoreCursor();

        //render mybox
        this.saveCursor(); //make a snapshot of our origin frame before we start making an object (so we can restore it later)

        mat4.translate(cursor, cursor, vec3.fromValues(0, 0, 25));
        this.renderModel(gl, this.getModels().mybox, shaders, cursor);
        cursor  = this.restoreCursor();


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
		mat4.translate(cursor, cursor, vec3.fromValues(0, -20, 0));
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
//		mat4.translate(cursor, cursor, vec3.fromValues(-4, 2, -10));
	//	mat4.rotateY(cursor, cursor, periodNominator / 4000);
//		mat4.rotateX(cursor, cursor, periodNominator / 4000);
		var model = this.getModels().skybox;
		this.renderModel(gl, model, shaders, cursor);
	},
    /**
     * Renders the face model in the scene.
     *
     * @param gl The WebGL context
     * @param shaders The WebGL shader program
     * @param cursor The current model-view project matrix
     * @param periodNominator How often to update animation
     */
	renderPlayer: function (gl, shaders, cursor, periodNominator) {
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
		/*mat4.rotateY(cursor, cursor, yaw);
		mat4.rotateX(cursor, cursor, pitch);
		// Translate forward to outer radius
		mat4.translate(cursor, cursor, [0, 0, -radius]);
		// Rotate back so that the face always 'faces' the camera
		mat4.rotateX(cursor, cursor, -pitch);
		mat4.rotateY(cursor, cursor, -yaw);
//		mat4.rotateZ(cursor, cursor, -yaw);*/

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
		var lightPosition = vec4.fromValues(x, 0, 0, 1);
		gl.uniform4fv(shaderProgram.uLightPos, lightPosition);
		gl.uniform3fv(shaderProgram.uLightColor, [0.0, 0, 0.8]);
	},
    /**
     * Creates a model for the scene.
     *
     * @param gl The WebGL context
     * @param mesh the geometry and texture for the model being created
     * @param name the name of the object
     */
    createModel: function (gl, mesh, name) {
        // create the WebGL buffers for the vertices, normals, faces and textures
        var buffers = Ext.create('MW.buffer.Buffer');
        var geometry = mesh.getGeometry();
        var vertexBuffer = buffers.createVertexBuffer(gl, geometry);
        var normalBuffer = buffers.createNormalBuffer(gl, geometry);
        var faceBuffer = buffers.createFaceBuffer(gl, geometry);
	    var textureBuffer = buffers.createTextureBuffer(gl, mesh);
        // Store the model into the models map
        this.getModels()[name] = {
            vertexBuffer: vertexBuffer,
            normalBuffer: normalBuffer,
            faceBuffer: faceBuffer,
	        textureBuffer: textureBuffer
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
                    geometry.center();
                    var mesh = Ext.create('MW.object.Mesh', {
                        geometry: geometry
                    });
                    this.createModel(gl, mesh, jMesh.name);
					callback.call(model);
				}, this);
			}
		});
	},
	/**
	 * Creates the world for the scene.
	 *
	 * @param gl The WebGL context
	 * @param width the width of the world
	 * @param height the height of the world
	 * @param depth the depth of the world
	 */
	createWorld: function (gl, width, height, depth) {
		this.createFloor(gl, 'floor', width, height);           // creates space in the gpu for the floor model
		this.createSkybox(gl, 'skybox', width, height, depth);  // creates space in the gpu for the skybox model
        //create a box


        var myboxGeo = Ext.create('MW.geometry.CubeGeometry', { //this creates cube Geometry
            width: 20, height: 20, depth: 0});


        var myboxMesh = Ext.create('MW.object.Mesh', {geometry: myboxGeo}); //texture is not reeuqired


        this.createModel(gl, myboxMesh , "mybox"); //now we make the mesh = geometry + material

        //end createbox
    },
    /**
     * Creates a plane mesh to represent the floor in the scene.
     *
     * @param gl The WebGL context
     * @param name The name of the floor
     * @param width the width of the floor
     * @param height the height of the floor
     */
    createFloor: function (gl, name, width, height) {
        // create the plane geometry and rotate it so that it is horizontal to the ground
        var geometry = Ext.create('MW.geometry.PlaneGeometry', {
            width: width,
            height: height
        });
        geometry.rotateX(Math.PI * 0.5);
        // create the mesh containing the geometry
        var floortex = Ext.create('MW.loader.Texture', gl, "/resources/image/floor.png");
        var mesh = Ext.create('MW.object.Mesh', {
            geometry: geometry,
            texture: floortex
       });
       this.createModel(gl, mesh, name); // create the model using the plane and its name
    },
	/**
	 * Creates a cube mesh to represent the skybox in the scene.
	 *
	 * @param gl The WebGL context
	 * @param name The name of the skybox
	 * @param width the width of the skybox
	 * @param height the height of the skybox
	 * @param depth the depth of the skybox
	 */
	createSkybox: function (gl, name, width, height, depth) {
		// create the cube mesh and negate its normals so the texture can be applied to the interior of the cube
        var geometry = Ext.create('MW.geometry.CubeGeometry', {
            width: width,
            height: height,
            depth: depth
        });
        geometry.negateNormals();
        // create and load the texture from the specified source
        var texture = Ext.create('MW.loader.Texture', gl, "/resources/image/texture.png");
        // create the mesh with the newly created geometry and texture
        var mesh = Ext.create('MW.object.Mesh', {
            geometry: geometry,
            texture: texture
        });
		this.createModel(gl, mesh, name); // create the model using the skybox and its name
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
