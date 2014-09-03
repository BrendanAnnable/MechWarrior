/**
 * @author Monica Olejniczak
 */
Ext.define('MW.object.Object', {
	alias: 'Object',
	config: {
		name: null,
		children: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.setChildren([]);
	},
	/**
	 * Renders a specified model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param model The model to render
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 */
	render: function (gl, model, shaderProgram, cursor, sa) {
		// Update the model position
		debugger;
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
	}
});