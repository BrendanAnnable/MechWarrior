/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.Color', {
    alias: 'Color',
    min: 0,
    max: 255,
    config: {
        r: 1,    // Red
        g: 1,    // Green
        b: 1,    // Blue
        a: 1     // Alpha
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    getArray: function () {
        return [this.getR(), this.getG(), this.getB(), this.getA()];
    },
	setColor: function (r, g, b, a) {
		this.setR(Math.min(this.max, Math.max(this.min, r)));
		this.setG(Math.min(this.max, Math.max(this.min, g)));
		this.setB(Math.min(this.max, Math.max(this.min, b)));
		this.setA(Math.min(1, Math.max(0, a)));
	},
    /**
     * Retrieves the opacity of the colour through the alpha configuration.
     *
     * @returns {*} The opacity of the colour.
     */
    getOpacity: function () {
        return this.getA();
    },
    /**
     * Returns the hex colour code of an RGB colour.
     *
     * @returns {*} The hex code for the colour.
     */
    getHex: function () {
        function toHex (component) {
            var hex = component.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return Ext.String.format("#{0}{1}{2}", toHex(this.getR()), toHex(this.getG()), toHex(this.getB()));
    },
    /**
     * Calculates and returns a darker colour based on the value specified.
     *
     * @param amount The amount to make darker by, specified as a percentage.
     * @returns {FourJS.util.Color} A darker colour.
     */
    getDarker: function (amount) {
        var percentage = amount / 100 * this.max;
        var r = Math.round(Math.min(this.max, Math.max(this.min, this.getR() - percentage)));
        var g = Math.round(Math.min(this.max, Math.max(this.min, this.getG() - percentage)));
        var b = Math.round(Math.min(this.max, Math.max(this.min, this.getB() - percentage)));
        return Ext.create('FourJS.util.Color', {r: r, g: g, b: b, a: this.getA()});
    },
    /**
     * Calculates and returns a lighter colour based on the value specified.
     *
     * @param amount The amount to make lighter by, specified as a percentage.
     * @returns {FourJS.util.Color} A lighter colour.
     */
    getLighter: function (amount) {
        var percentage = amount / 100 * this.max;
        var r = Math.round(Math.min(this.max, Math.max(this.min, this.getR() + percentage)));
        var g = Math.round(Math.min(this.max, Math.max(this.min, this.getG() + percentage)));
        var b = Math.round(Math.min(this.max, Math.max(this.min, this.getB() + percentage)));
        return Ext.create('FourJS.util.Color', {r: r, g: g, b: b, a: this.getA()});
    }
});
