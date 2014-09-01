Ext.define('MW.buffer.Buffer', {
    /**
     * Creates a vertex buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the vertex buffer to
     * @returns {*} the vertex buffer being created
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
     * @returns {*} the vertex buffer being created
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
     * @returns {*} the vertex buffer being created
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
	 * Creates a texture buffer for a model.
	 *
	 * @param gl The WebGL context
	 * @param geometry the geometry to apply the face buffer to
	 * @returns {*} the vertex buffer being created
	 */
	createTextureBuffer: function (gl, geometry) {
		var textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		var textureCoordinates = geometry.getFlattenedTextureCoordinates();
		gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
		textureBuffer.itemSize = 3;
		textureBuffer.numItems = textureCoordinates.length / 3;
		textureBuffer.textures = geometry.getTextures();
		return textureBuffer;
	}
});
