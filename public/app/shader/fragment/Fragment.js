Ext.define('MW.shader.fragment.Fragment', {
	alias: 'FragmentShader',
	extend: 'MW.shader.Shader',
	constructor: function () {
		this.callParent();
		this.setPath(Ext.String.format('{0}/fragment/fragment.c', this.getPath()));
	},
	/**
	 * Load the given fragment shader
	 *
	 * @param gl The WebGL context
	 * @param callback Callback that is called once the shader has loaded
	 */
	load: function (gl, callback) {
		var url = this.getPath();
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				// Use the ajax response to create and compile the shader
				var shader = gl.createShader(gl.FRAGMENT_SHADER);
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
