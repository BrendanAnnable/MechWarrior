/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.Color', {
    alias: 'Color',
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
		this.setR(r);
		this.setG(g);
		this.setB(b);
		this.setA(a);
	}
});
