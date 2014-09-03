/**
 * @author Monica Olejniczak
 */
Ext.define('MW.object.Mesh', {
    alias: 'Mesh',
	extend: 'MW.object.Object',
    config: {
        geometry: null,
        texture: null
    },
    constructor: function (config) {
	    this.initConfig(config);
    },
	renderMesh: function (gl, model, shaderProgram, cursor) {
		this.renderObject(gl, model, shaderProgram, cursor);
	}
});