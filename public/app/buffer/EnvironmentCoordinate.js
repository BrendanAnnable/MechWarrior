/**
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.EnvironmentCoordinate', {
	extend: 'MW.buffer.Buffer',
	constructor: function () {
		this.callParent(arguments);
	},
	/**
	 * Loads an environment buffer for a model.
	 *
	 * @param gl The WebGL context
	 * @param mesh the mesh to apply the environment buffer to
	 * @returns {*} the face buffer being created for the geometry
	 */
	load: function (gl, mesh) {
		if (mesh.hasMaterial()) {
			var material = mesh.getMaterial();
			if (material.hasEnvironmentMap()) {
				var environmentBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, environmentBuffer);
				var textureCoordinates = mesh.getGeometry().getFlattenedTextureCoordinates();
				gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
				environmentBuffer.itemSize = this.superclass.self.TEXTURE_DIMENSION;
				environmentBuffer.numItems = textureCoordinates.length / environmentBuffer.itemSize;
				this.setBuffer(environmentBuffer);
				return environmentBuffer;
			}
		}
		return null;
	}
});
