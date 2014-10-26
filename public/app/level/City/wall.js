/**
 * @author juliussky on 12/10/2014.
 */

Ext.define('MW.level.city.Wall', {
    alias: 'Wall',
    extend: 'FourJS.object.Object',
    // TODO: move wall creation from Genesis to here
    mixins: {
        physics: 'PhysJS.DynamicObject'
    },
    requires: [
        'FourJS.geometry.Geometry',
        'FourJS.loader.Model',
        'FourJS.material.Phong',
        'FourJS.util.Color'
    ],
    config: {
    },
    constructor: function (config) {
        this.callParent(arguments);
		this.setDynamic(false);
        this.mixins.physics.constructor.call(this, config);
    }
});