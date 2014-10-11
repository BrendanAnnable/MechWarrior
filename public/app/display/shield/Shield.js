/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.shield.Shield', {
    alias: 'widget.Shield',
    extend: 'Ext.container.Container',
    requires: [
        'MW.display.shield.ShieldController'
    ],
    controller: 'Shield',
    config: {
        fillColor: '#044e6d',
        fillOpacity: 0.7,
        strokeColor: '#6ffaff',
        strokeWidth: 0.3
    },
    layout: 'fit',
    cls: 'shield',
    id: 'shield',
    autoEl: {
        tag: 'svg',
        preserveAspectRatio: 'xMinYMin meet'
    }
});
