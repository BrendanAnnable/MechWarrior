/**
 * @author Monica Olejniczak
 */
Ext.define('MW.util.Color', {
    alias: 'Color',
    config: {
        r: 0,    // Red
        g: 0,    // Green
        b: 0,    // Blue
        a: 1     // Alpha
    },
    constructor: function (config) {
        this.initConfig(config);
    }
});
