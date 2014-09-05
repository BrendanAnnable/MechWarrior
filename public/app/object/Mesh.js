/**
 * @author Monica Olejniczak
 */
Ext.define('MW.object.Mesh', {
    alias: 'Mesh',
	extend: 'MW.object.Object',
    requires: [
        'MW.geometry.Geometry'
    ],
    config: {
        geometry: null,
        material: null
    },
    constructor: function () {
        this.callParent(arguments);
		this.setRenderable(true);
    }
});