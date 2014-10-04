/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.object.Mesh', {
    alias: 'Mesh',
	extend: 'FourJS.object.Object',
    requires: [
        'FourJS.geometry.Geometry'
    ],
    config: {
        geometry: null,
        material: null
    },
    constructor: function () {
        this.callParent(arguments);
		this.setRenderable(true);
    },
    hasMaterial: function () {
        return this.getMaterial() !== null;
    },
	setColor: function (r, g, b, a) {
		this.getMaterial().getColor().setColor(r, g, b, a);
	}
});
