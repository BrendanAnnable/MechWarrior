/**
 * @author Monica Olejniczak
 */
Ext.define('MW.loader.CubeMap', {
    alias: 'CubeMap',
    extend: 'MW.loader.Loader',
    config: {
        topUrl: null,
        rightUrl: null,
        bottomUrl: null,
	    leftUrl: null,
        frontUrl: null,
        backUrl: null
    },
    constructor: function () {
        this.callParent(arguments);
	    var paths = [this.getTopUrl(), this.getRightUrl(), this.getBottomUrl(), this.getFrontUrl(), this.getBackUrl()];
	    for (var i = 0; i < paths.length; i++) {
		    var image = new Image();
		    image.src = paths[i];
	    }
    }
});