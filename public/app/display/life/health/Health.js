/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.health.Health', {
    alias: 'widget.Health',
	extend: 'FourJS.util.svg.SVG',
    requires: [
        'MW.display.life.health.HealthController'
    ],
    controller: 'Health',
    cls: 'health',
    id: 'health',
    initComponent: function () {
        this.callParent(arguments);
	    if (this.getDimensions() === null) {
		    this.setDimensions({width: '49%', height: '100%'});
	    }
        if (this.getFillColor() === null) {
	        this.setFillColor(Ext.create('FourJS.util.Color', {r: 255, g: 255, b: 255, a: 0.8}));
        }
    }
});
