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
    items: [{
        xtype: 'component',
        itemId: 'counter',
        tpl: '{current}/{maximum}',
        data: {
            current: 0,
            maximum: 0
        },
        style: {
            position: 'absolute',
            right: '1.2em',
            bottom: '0.6em'
        }
    }]
});