/**
 * @author Julius Sky
 */
Ext.define('MW.level.city.City', {
    alias: 'City',
    extend: 'FourJS.object.Object',
// TODO: move city objects created in GenesisController to here and just create the city in Genesis.

    requires: [
    ],
    config: {
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);

    }
});