/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('FourJS.buffer.Vertex', {
    extend: 'FourJS.buffer.Buffer',
	constructor: function () {
		this.callParent(arguments);
	},
	/**
	 * Loads a vertex buffer for a model.
	 *
	 * @param gl The WebGL context
	 * @param geometry the geometry to apply the vertex buffer to
	 * @returns {*} the vertex buffer being created for the geometry
	 */
	load: function (gl, geometry) {
		var vertexBuffer = gl.createBuffer();                  // makes a buffer on gpu
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);          // creates an array buffer
		var vertices = geometry.getFlattenedVertices();
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		vertexBuffer.itemSize = this.superclass.self.VERTEX_DIMENSION;
		vertexBuffer.numItems = vertices.length / vertexBuffer.itemSize;
		this.setBuffer(vertexBuffer);
		return vertexBuffer;
	}
});
