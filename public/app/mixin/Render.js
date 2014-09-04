/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.mixin.Render', {
    constructor: function (config) {
        this.initConfig(config);
    },
    /**
     * Renders a specified object in the scene.
     *
     * @param gl The WebGL context
     * @param object The object to render
     * @param shaderProgram The WebGL shader program
     * @param cursor The current object-view project matrix
     */
    render: function (gl, object, shaderProgram, cursor) {
        if (object.vertexBuffer !== undefined) { // TODO FIX bad things
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
            this.updateUniforms(gl, shaderProgram, cursor);
            gl.drawElements(gl.TRIANGLES, faceBuffer.numItems * faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
        }
    },
    /**
     * Updates the uniform constants given to WebGL
     *
     * @param gl The WebGL context
     * @param shaderProgram The WebGL shader program
     * @param cursor The current model-view project matrix
     */
    updateUniforms: function (gl, shaderProgram, cursor) {
        var pMatrix = mat4.create();
        // Create a perspective projection matrix
        mat4.perspective(pMatrix, 45 * Math.PI / 180 , gl.viewportWidth / gl.viewportHeight, 0.1, 2000);
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
    }
});