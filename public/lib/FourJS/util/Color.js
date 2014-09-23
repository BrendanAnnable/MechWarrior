/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.Color', {
    alias: 'Color',
    config: {
        r: 0,    // Red
        g: 0,    // Green
        b: 0,    // Blue
        a: 1     // Alpha
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    getArray: function () {
        return [this.getR(), this.getG(), this.getB(), this.getA()];
    }
});