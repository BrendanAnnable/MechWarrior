/**
 * @author Monica Olejniczak
 */
Ext.define('MW.object.Mesh', {
    alias: 'Mesh',
	extend: 'Object',
    config: {
        geometry: null,
        texture: null
    },
    constructor: function (config) {
        this.initConfig(config);
    }
});