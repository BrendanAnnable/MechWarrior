/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.Display', {
    alias: 'widget.Display',
    extend: 'Ext.container.Container',
    requires: [
        'MW.display.radar.Radar',
        'MW.display.life.Life'
    ],
    layout: 'absolute',
    initComponent: function () {
        this.callParent(arguments);
        this.add(Ext.create('MW.display.radar.Radar'));
        this.add(Ext.create('MW.display.life.Life', {
            y: 80
        }));
    }
});