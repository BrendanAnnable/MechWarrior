Ext.define('MW.renderer.WebGLRenderer', {
	cursor: null,
	config: {
		gl: null,
		width: 320,
		height: 240
	},
	constructor: function (config) {
		this.initConfig(config);
		this.cursor = mat4.create();
	},
	render: function (scene, camera, shaderProgram) {
		var gl = this.getGl();

		// Set the viewport size
		gl.viewport(0, 0, this.getWidth(), this.getHeight());

		var cursor = this.cursor;

		// Clear the color buffer and depth buffer bits
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.identity(cursor);
		// Transform from camera space to world space
		mat4.multiply(cursor, cursor, camera.getPositionInverse());

		this.renderObject(gl, scene, shaderProgram, cursor, camera);
	},
	renderObject: function (gl, object, shaderProgram, cursor, camera) {
		var cursorCopy = mat4.clone(cursor);
		mat4.multiply(cursorCopy, cursorCopy, object.getPosition());

		if (object.getRenderable()) {
			this.checkBuffer(gl, object);

			// Update the object position
			var vertexBuffer = object.vertexBuffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// Update the object normals
			var normalBuffer = object.normalBuffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// Update the object faces
			var faceBuffer = object.faceBuffer;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

			var useTexture = object.textureBuffer !== null;
			gl.uniform1i(shaderProgram.useTextureUniform, useTexture);

			if (useTexture) {
				gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
				// Update the object texture
				var textureBuffer = object.textureBuffer;
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
			// Update the WebGL uniforms and then draw the object on the screen
			this.updateUniforms(gl, shaderProgram, cursorCopy, camera);
			gl.drawElements(gl.TRIANGLES, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
		}

		var children = object.getChildren();
		for (var i = 0; i < children.length; i++) {
			this.renderObject(gl, children[i],shaderProgram, cursor, camera);
		}
	},
	checkBuffer: function (gl, object) {
		if (object.vertexBuffer === undefined) {
			// attach the buffers to the current child object
			var geometry = object.getGeometry();
			object.vertexBuffer = Ext.create('MW.buffer.Vertex', gl, geometry).getBuffer();
			object.normalBuffer = Ext.create('MW.buffer.Normal', gl, geometry).getBuffer();
			object.faceBuffer = Ext.create('MW.buffer.Face', gl, geometry).getBuffer();
			object.textureBuffer = Ext.create('MW.buffer.Texture', gl, object).getBuffer();
		}
	},
	/**
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param camera
	 */
	updateUniforms: function (gl, shaderProgram, cursor, camera) {
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camera.getPerspective());
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
	}
});