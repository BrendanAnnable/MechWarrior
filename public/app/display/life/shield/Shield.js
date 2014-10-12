/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.shield.Shield', {
    alias: 'widget.Shield',
	extend: 'FourJS.util.SVG',
    requires: [
        'MW.display.life.shield.ShieldController'
    ],
    controller: 'Shield',
    layout: 'fit',
    cls: 'shield',
    id: 'shield',
    initComponent: function () {
        this.callParent(arguments);
	    if (this.getDimensions() === null) {
		    this.setDimensions({width: '60%', height: '100%'});
	    }
	    if (this.getFillColor() === null) {
		    this.setFillColor(Ext.create('FourJS.util.Color', {r: 0, g: 85, b: 150, a: 0.7}));
	    }
    }
});
