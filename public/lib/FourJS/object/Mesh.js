/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 */
Ext.define('FourJS.object.Mesh', {
    alias: 'Mesh',
	extend: 'FourJS.object.Object',
    requires: [
        'FourJS.geometry.Geometry'
    ],
	isMesh: true,
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
	},
	clone: function (object) {
		if (object === undefined) {
			object = Ext.create('FourJS.object.Mesh', {
				geometry: this.getGeometry(),
				material: this.getMaterial()
			});
		}

		FourJS.object.Object.prototype.clone.call(this, object);

		return object;
		return this.callParent([object]);
	}
});
