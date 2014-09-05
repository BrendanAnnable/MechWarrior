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
        this.callParent(config);
		this.setRenderable(true);
    }
});