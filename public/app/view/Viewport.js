/**
 * @author Brendan Annable
 */
Ext.define('MW.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.Fit',
		'MW.view.ViewportController'
	],
	controller: 'ViewportController',
	layout: 'border',
	items: [{
		xtype: 'container',
		layout: 'fit',
		reference: 'menu',
		cls: 'menu',
		items: [{
			xtype: 'component',
			cls: 'radar'
		}]
	},  {
		xtype: 'container',
		layout: 'fit',
		region: 'center',
		autoEl: 'canvas',
		reference: 'canvas',
		listeners: {
			resize: 'onResize',
			afterrender: 'onAfterRender'
		}
	}]
});
