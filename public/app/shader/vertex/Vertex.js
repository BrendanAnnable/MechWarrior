Ext.define('MW.shader.vertex.Vertex', {
	alias: 'VertexShader',
	extend: 'MW.shader.Shader',
	constructor: function () {
		this.callParent();
		this.setPath(Ext.String.format('{0}/vertex/vertex.c', this.getPath()));
	},
    /**
     * Load the given vertex shader
     *
     * @param gl The WebGL context
     * @param callback Callback that is called once the shader has loaded
     * @param thisArg
     */
	load: function (gl, callback, thisArg) {
		var url = this.getPath();
		Ext.Ajax.request({
			url: url,
			scope: thisArg,
			success: function (response) {
				// Use the ajax response to create and compile the shader
				var shader = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(shader, response.responseText);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.error(gl.getShaderInfoLog(shader));
				}
				callback.call(this, shader);
			}
		});
	}
});
