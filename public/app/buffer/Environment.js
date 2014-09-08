/**
 * @author Monica Olejniczak
 */
Ext.define('MW.buffer.Environment', {
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
				var vertices = mesh.getGeometry().getVertices();
				gl.bindBuffer(gl.ARRAY_BUFFER, environmentBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
				environmentBuffer.itemSize = this.superclass.self.VERTEX_DIMENSION;
				environmentBuffer.numItems = vertices.length / environmentBuffer.itemSize;
				this.setBuffer(environmentBuffer);
				return environmentBuffer;
			}
		}
		return null;
	}
});
