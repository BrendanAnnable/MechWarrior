/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.Texture', {
    extend: 'MW.buffer.Buffer',
    /**
     * Creates a texture buffer for a model provided the model has a texture, otherwise no buffer is created.
     *
     * @param gl The WebGL context
     * @param mesh the mesh to apply the texture buffer to
     * @returns {*} the texture buffer being created for the mesh if it contains a texture
     */
    constructor: function (gl, mesh) {
        if (mesh.hasMaterial()) {
            var material = mesh.getMaterial();
            if (material.hasTexture() || material.hasEnvironmentMap()) {
                var textureBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
                var textureCoordinates = mesh.getGeometry().getFlattenedTextureCoordinates();
                gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
                textureBuffer.itemSize = 2;
                textureBuffer.numItems = textureCoordinates.length / textureBuffer.itemSize;
                this.setBuffer(textureBuffer);
            }
        }
    }
});
