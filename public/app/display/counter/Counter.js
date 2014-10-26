/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.counter.Counter', {
    extend: 'Ext.container.Container',
    alias: 'widget.Counter',
    requires: [
        'MW.display.counter.CounterController'
    ],
    controller: 'Counter',
    config: {
        maximum: 10
    },
	cls: 'counter',
	layout: 'absolute',
	items: [{
		xtype: 'container',
		cls: 'counter-image',
		items: [{
			xtype: 'component',
			itemId: 'counter',
			tpl: '{current}/{maximum}',
			data: {
				current: 0,
				maximum: 0
			},
			cls: 'unselectable',
			style: {
				position: 'absolute',
				right: '1em',
				bottom: '0.5em'
			}
		}]
	}]
});