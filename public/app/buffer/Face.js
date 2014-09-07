/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.Face', {
    extend: 'MW.buffer.Buffer',
    /**
     * Creates a face buffer for a model.
     *
     * @param gl The WebGL context
     * @param geometry the geometry to apply the face buffer to
     * @returns {*} the face buffer being created for the geometry
     */
    constructor: function (gl, geometry) {
        var faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        var faces = geometry.getFlattenedFaces();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
        faceBuffer.itemSize = 3;
        faceBuffer.numItems = faces.length / faceBuffer.itemSize;
        this.setBuffer(faceBuffer);
    }
});
