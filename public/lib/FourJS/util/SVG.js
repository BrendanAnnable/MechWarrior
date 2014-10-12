/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.SVG', {
	alias: 'SVG',
	extend: 'Ext.container.Container',
	config: {
		dimensions: null,
		fillColor: null,
		strokeColor: null,
		strokeWidth: 1
	},
	autoEl: {
		tag: 'svg',
		preserveAspectRatio: 'xMinYMin meet'
	},
	height: '100%' // enables scaling
});
