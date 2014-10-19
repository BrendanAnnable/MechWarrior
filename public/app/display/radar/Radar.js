/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.radar.Radar', {
    alias: 'widget.Radar',
    extend: 'FourJS.util.svg.SVG',
	requires: [
		'MW.display.radar.RadarController'
	],
	controller: 'Radar',
	config: {
		radius: 50,                 // The radius of the radar.
		space: 10,                  // The amount of space between the edge and circle.
		centreRadius: 1.5,          // The radius of the centre dot.
		centreColor: null,          // The colour of the centre dot.
		defaultObjectRadius: 2,     // The radius of the dots
		defaultObjectColor: null    // The colour of the dots
	},
	id: 'radar',
	init: function (config) {
		this.initConfig(config);
	},
	initComponent: function () {
		this.callParent(arguments);
		if (this.getDimensions() === null) {
			this.setDimensions({width: '10%', height: '10%'});
		}
		if (this.getFillColor() === null) {
			this.setFillColor(Ext.create('FourJS.util.Color', {r: 255, g: 255, b: 255, a: 0.6}));
		}
		if (this.getCentreColor() === null) {
			this.setCentreColor(Ext.create('FourJS.util.Color', {r: 0, g: 105, b: 150}));
		}
		if (this.getDefaultObjectColor() === null) {
			this.setDefaultObjectColor(Ext.create('FourJS.util.Color', {r: 0, g: 85, b: 150, a: 0.7}));
		}
	}
});
