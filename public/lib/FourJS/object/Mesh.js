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
    constructor: function (config) {
        this.callParent(arguments);
		this.setRenderable(true);
		if (this.config.material === null) {
			this.setMaterial(Ext.create('FourJS.material.Phong', {
				color: Ext.create('FourJS.util.Color', {
					r: Math.random(),
					g: Math.random(),
					b: Math.random()
				})
			}));
		}
    },
    hasMaterial: function () {
        return this.getMaterial() !== null;
    },
	setColor: function (r, g, b, a) {
		this.getMaterial().getColor().setColor(r, g, b, a);
	}
});
