/**
 * @author Monica Olejniczak
 */
Ext.define('MW.material.Material', {
    alias: 'Material',
    requires: [
        'MW.util.Color'
    ],
    config: {
        color: null,
        opacity: 1,             // todo support
        transparent: false,      // todo support
        useLighting: true
    },
    constructor: function (config) {
        this.initConfig(config);
        if (this.getColor() === null) {
            this.setColor(Ext.create('MW.util.Color', {
                r: 1,
                g: 1,
                b: 1
            }));
        }
    }
});