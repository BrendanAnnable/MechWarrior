Ext.define('MW.buffer.Buffer', {
    /**
     * Creates a vertex buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the vertex buffer to
     * @returns {*} the vertex buffer being created for the geometry
     */
    createVertexBuffer: function (gl, geometry) {
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var vertices = geometry.getFlattenedVertices();
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numItems = vertices.length / 3;
        return vertexBuffer;
    },
    /**
     * Creates a normal buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the normal buffer to
     * @returns {*} the normal buffer being created for the geometry
     */
    createNormalBuffer: function (gl, geometry) {
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var normals = geometry.getFlattenedNormals();
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        normalBuffer.itemSize = 3;
        normalBuffer.numItems = normals.length / 3;
        return normalBuffer;
    },
    /**
     * Creates a face buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the face buffer to
     * @returns {*} the face buffer being created for the geometry
     */
    createFaceBuffer: function (gl, geometry) {
        var faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        var faces = geometry.getFlattenedFaces();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
        faceBuffer.itemSize = 3;
        faceBuffer.numItems = faces.length / 3;
        return faceBuffer;
    },
	/**
	 * Creates a texture buffer for a model provided the model has a texture, otherwise no buffer is created.
	 *
	 * @param gl The WebGL context
	 * @param mesh the mesh to apply the texture buffer to
	 * @returns {*} the texture buffer being created for the mesh if it contains a texture
	 */
	createTextureBuffer: function (gl, mesh) {
        var texture = mesh.getTexture();
        if (texture == null) {
            return null;
        } else {
            var textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            var textureCoordinates = mesh.getGeometry().getFlattenedTextureCoordinates();
            gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
            textureBuffer.itemSize = 2;
            textureBuffer.numItems = textureCoordinates.length / textureBuffer.itemSize;
            textureBuffer.texture = texture;
            return textureBuffer;
        }
	}
});
