/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('FourJS.buffer.Buffer', {
    config: {
        buffer: null
    },
	statics: {
		VERTEX_DIMENSION: 3,
		TEXTURE_DIMENSION: 2
	},
	constructor: function (config) {
        this.initConfig(config);
    }
});
