/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.Normal', {
    extend: 'MW.buffer.Buffer',
	constructor: function () {
		this.callParent(arguments);
	},
	/**
     * Loads a normal buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the normal buffer to
     * @returns {*} the normal buffer being created for the geometry
     */
    load: function (gl, geometry) {
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var normals = geometry.getFlattenedNormals();
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        normalBuffer.itemSize = this.superclass.self.VERTEX_DIMENSION;
        normalBuffer.numItems = normals.length / normalBuffer.itemSize;
        this.setBuffer(normalBuffer);
        return normalBuffer;
    }
});
