/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.Life', {
    alias: 'widget.Life',
    extend: 'Ext.container.Container',
    requires: [
        'MW.display.life.health.Health',
        'MW.display.life.shield.Shield'
    ],
    layout: 'absolute',
    cls: 'life',
    initComponent: function () {
        this.callParent(arguments);
        this.add(Ext.widget('Shield'));
        this.add(Ext.widget('Health'));
    }
});