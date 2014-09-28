/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('FourJS.buffer.Face', {
    extend: 'FourJS.buffer.Buffer',
	constructor: function () {
		this.callParent(arguments);
	},
	/**
     * Loads a face buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the face buffer to
     * @returns {*} the face buffer being created for the geometry
     */
    load: function (gl, geometry) {
        var faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        var faces = geometry.getFlattenedFaces();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
        faceBuffer.itemSize = this.superclass.self.VERTEX_DIMENSION;
        faceBuffer.numItems = faces.length;
        this.setBuffer(faceBuffer);
		return faceBuffer;
    }
});
