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
		defaultObjectRadius: 2,     // The radius of the dots
		defaultObjectColor: null    // The colour of the dots
	},
	layout: 'fit',
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
	}
});
