/**
 * @author Brendan Annable
 */
Ext.define('FourJS.shader.fragment.Fragment', {
	alias: 'FragmentShader',
	extend: 'FourJS.shader.Shader',
	constructor: function () {
		this.callParent();
		this.setPath(Ext.String.format('{0}/fragment/fragment.c', this.getPath()));
	},
    /**
     * Load the given fragment shader
     *
     * @param gl The WebGL context
     */
	load: function (gl) {
        var url = this.getPath();
        return new Promise(function (resolve) {
            Ext.Ajax.request({
                url: url,
                success: function (response) {
                    // Use the ajax response to create and compile the shaderProgram
                    var shaderProgram = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(shaderProgram, response.responseText);
                    gl.compileShader(shaderProgram);
                    if (!gl.getShaderParameter(shaderProgram, gl.COMPILE_STATUS)) {
                        console.error(gl.getShaderInfoLog(shaderProgram));
                    }
                    resolve(shaderProgram);
                }
            });
        });
	}
});
