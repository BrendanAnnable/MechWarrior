/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.health.Health', {
    alias: 'widget.Health',
    extend: 'Ext.container.Container',
    requires: [
        'MW.display.health.HealthController'
    ],
    controller: 'Health',
    config: {
        fillColor: '#fff',
        fillOpacity: 0.8,
        strokeColor: '#fff',
        strokeWidth: 0.2
    },
    layout: 'fit',
    cls: 'health',
    id: 'health',
    autoEl: {
        tag: 'svg',
        preserveAspectRatio: 'xMinYMin meet'
    }
});
