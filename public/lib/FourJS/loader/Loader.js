/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.loader.Loader', {
    alias: 'Loader',
	mixins: {
		observable: 'Ext.util.Observable'
	},
    config: {
        loaded: false
    },
    constructor: function (config) {
        this.initConfig(config);
		this.mixins.observable.constructor.call(this, config);
    },
    isLoaded: function () {
        return this.getLoaded();
    },
	updateLoaded: function (loaded) {
		if (loaded) {
			this.fireEvent('load');
		}
	}
});