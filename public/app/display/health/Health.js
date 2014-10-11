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
        fillColor: null,
        strokeColor: '#fff',
        strokeWidth: 0.2
    },
    layout: 'fit',
    cls: 'health',
    id: 'health',
    autoEl: {
        tag: 'svg',
        preserveAspectRatio: 'xMinYMin meet'
    },
    initComponent: function () {
        this.callParent(arguments);
        this.setFillColor(Ext.create('FourJS.util.Color', {
            r: 255,
            g: 255,
            b: 255,
            a: 0.8
        }));
    }
});
