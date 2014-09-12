/**
 * @author Monica Olejniczak
 */
Ext.define('MW.loader.Loader', {
    alias: 'Loader',
    config: {
        loaded: false
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    isLoaded: function () {
        return this.getLoaded();
    }
});