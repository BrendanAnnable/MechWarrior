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
    tpl: '{current}/{maximum}',
    data: {
        current: 0,
        maximum: 0
    }

});