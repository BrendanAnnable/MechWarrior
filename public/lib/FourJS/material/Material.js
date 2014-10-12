/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.material.Material', {
    alias: 'Material',
    requires: [
        'FourJS.util.Color'
    ],
    config: {
        color: null,
        opacity: 1,             // todo support
        transparent: false,      // todo support
        useLighting: true,
		reflectivity: 0,
		wireframe: false
    },
    constructor: function (config) {
        this.initConfig(config);
        if (this.getColor() === null) {
            this.setColor(Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1}));
        }
    },
    /**
     * Checks whether the material contains a texture.
     *
     * @returns {*|boolean}
     */
    hasTexture: function () {
        return this.hasConfig('texture') && this.getTexture() !== null;
    },
	/**
	 * Checks whether the material contains an environment map.
	 *
	 * @returns {*|boolean}
	 */
	hasEnvironmentMap: function () {
		return this.hasConfig('environmentMap') && this.getEnvironmentMap() !== null;
	},
	clone: function (object) {
		if (object === undefined) {
			object = Ext.create('FourJS.material.Material', {
				color: this.getColor(),
				opacity: this.getOpacity(),
				transparent: this.getTransparent(),
				useLighting: this.getUseLighting(),
				reflectivity: this.getReflectivity(),
				wireframe: this.getWireframe()
			});
		}

		return object;
	}
});
