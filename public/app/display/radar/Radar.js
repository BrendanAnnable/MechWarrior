/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.radar.Radar', {
    alias: 'widget.Radar',
    extend: 'Ext.container.Container',
	requires: [
		'MW.display.radar.RadarController'
	],
	controller: 'Radar',
	config: {
		fillColor: null,
		strokeColor: '#fff',
		strokeWidth: 1.5
	},
	layout: 'fit',
	cls: 'radar',
	id: 'radar',
	autoEl: {
		tag: 'svg',
		preserveAspectRatio: 'xMinYMin meet'
	},
	initComponent: function () {
		this.callParent(arguments);
		this.setFillColor(Ext.create('FourJS.util.Color', {
			r: 255,
			g: 255,
			b: 255,
			a: 0.8
		}));
	}
});
