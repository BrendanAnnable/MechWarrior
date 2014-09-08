/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.Texture', {
    extend: 'MW.buffer.Buffer',
	constructor: function () {
		this.callParent(arguments);
	},
	/**
     * Loads a texture buffer for a model provided the model has a texture, otherwise no buffer is created.
     *
     * @param gl The WebGL context
     * @param mesh the mesh to apply the texture buffer to
     * @returns {*} the texture buffer being created for the mesh if it contains a texture
     */
    load: function (gl, mesh) {
        if (mesh.hasMaterial()) {
            var material = mesh.getMaterial();
            if (material.hasTexture()) {
                var textureBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
                var textureCoordinates = mesh.getGeometry().getFlattenedTextureCoordinates();
                gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
                textureBuffer.itemSize = this.superclass.self.TEXTURE_DIMENSION;
                textureBuffer.numItems = textureCoordinates.length / textureBuffer.itemSize;
                this.setBuffer(textureBuffer);
	            return textureBuffer;
            }
        }
	    return null;
    }
});
