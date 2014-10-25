/**
 * @author juliussky
 */
Ext.define('MW.level.City.Crate', {
    alias: 'Crate',
    extend: 'FourJS.object.Object',
//    box: null, // TODO: hack
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
        this.initConfig(config);
        this.callParent(arguments);
        this.mixins.physics.constructor.call(this, config);
    }

});
