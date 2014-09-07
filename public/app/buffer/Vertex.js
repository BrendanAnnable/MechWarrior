/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.Vertex', {
    extend: 'MW.buffer.Buffer',
    /**
     * Creates a vertex buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the vertex buffer to
     * @returns {*} the vertex buffer being created for the geometry
     */
    constructor: function (gl, geometry) {
        var vertexBuffer = gl.createBuffer();                  // makes a buffer on gpu
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);          // creates an array buffer
        var vertices = geometry.getFlattenedVertices();
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numItems = vertices.length / vertexBuffer.itemSize;
        this.setBuffer(vertexBuffer);
    }
});
