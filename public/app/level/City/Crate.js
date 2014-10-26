/**
 * @author juliussky
 */
Ext.define('MW.level.city.Crate', {
    alias: 'Crate',
    extend: 'FourJS.object.Object',
    // TODO: move crate creation from Genesis to here
    mixins: {
        physics: 'PhysJS.DynamicObject'
    },
    requires: [
        'FourJS.geometry.Geometry',
        'FourJS.loader.Model',
        'FourJS.material.Phong',
        'FourJS.util.Color'
    ],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        this.mixins.physics.constructor.call(this, config);
    }
});
