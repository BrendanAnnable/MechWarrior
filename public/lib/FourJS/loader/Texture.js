/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.loader.Texture', {
    alias: 'Texture',
    extend: 'FourJS.loader.Loader',
    config: {
        url: null,
        image: null,
	    repeatable: false
    },
    constructor: function () {
        this.callParent(arguments);
        var image = new Image();
        image.src = this.getUrl();
        image.onload = Ext.bind(function () {
            this.setLoaded(true);
        }, this);
        this.setImage(image);
	},
	isRepeatable: function () {
		return this.getRepeatable();
	}
});