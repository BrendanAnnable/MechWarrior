/**
 * @author Brendan Annable
 */
Ext.define('MW.renderer.webgl.ShaderProgram', {
	attributes: null,
	config: {
		gl: null,
		vertexShaderUrl: null,
		fragmentShaderUrl: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.attributes = [];
		var shaderProgram = this.getShaderProgram();
		// TODO: load shaders and create program, make loaded event
	},
	addAttribute: function (name) {
		var gl = this.getGl();
		var shaderProgram = this.getShaderProgram();
		this.attributes[name] = {
			location: gl.getAttribLocation(shaderProgram, name),
			name: name
		};
	},
	getAttribute: function (name) {
		return this.attributes[name];
	},
	enableAttribute: function (name) {
		var gl = this.getGl();
		var attribute = this.getAttribute(name);
		gl.enableVertexAttribArray(attribute.location);
	},
	disableAttribute: function (name) {
		var gl = this.getGl();
		var attribute = this.getAttribute(name);
		gl.disableVertexAttribArray(attribute.location);
	}
});
