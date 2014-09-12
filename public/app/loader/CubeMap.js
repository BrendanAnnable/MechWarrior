/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.loader.CubeMap', {
    alias: 'CubeMap',
    extend: 'MW.loader.Loader',
    config: {
        upUrl: null,
        rightUrl: null,
        downUrl: null,
	    leftUrl: null,
        frontUrl: null,
        backUrl: null,

		upImage: null,
		rightImage: null,
		downImage: null,
		leftImage: null,
		frontImage: null,
		backImage: null
    },
    constructor: function () {
        this.callParent(arguments);
	    var paths = [
			{url: this.getUpUrl(), setter: this.setUpImage},
			{url: this.getRightUrl(), setter: this.setRightImage},
			{url: this.getDownUrl(), setter: this.setDownImage},
			{url: this.getLeftUrl(), setter: this.setLeftImage},
			{url: this.getFrontUrl(), setter: this.setFrontImage},
			{url: this.getBackUrl(), setter: this.setBackImage}
		];
		var loaded = 0;
	    for (var i = 0; i < paths.length; i++) {
		    var image = new Image();
		    image.src = paths[i].url;
			paths[i].setter.call(this, image);
			image.onload = Ext.bind(function () {
				loaded++;
				if (loaded === paths.length) {
					this.setLoaded(true);
				}
			}, this);
	    }
    }
});