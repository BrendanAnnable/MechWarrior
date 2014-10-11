/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.Life', {
    alias: 'widget.Life',
    extend: 'Ext.container.Container',
    requires: [
        'MW.display.health.Health',
        'MW.display.shield.Shield'
    ],
    layout: 'absolute',
    cls: 'life',
    initComponent: function () {
        this.callParent(arguments);
        this.add(Ext.create('MW.display.shield.Shield'), {
            y: 0
        });
        this.add(Ext.create('MW.display.health.Health', {
            y: 0
        }));
    }
});