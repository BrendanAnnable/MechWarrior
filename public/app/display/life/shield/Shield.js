/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.shield.Shield', {
    alias: 'widget.Shield',
    extend: 'Ext.container.Container',
    requires: [
        'MW.display.life.shield.ShieldController'
    ],
    controller: 'Shield',
    config: {
        fillColor: null,
        strokeColor: '#6ffaff',
        strokeWidth: 0.3
    },
    layout: 'fit',
    cls: 'shield',
    id: 'shield',
    autoEl: {
        tag: 'svg',
        preserveAspectRatio: 'xMinYMin meet'
    },
    initComponent: function () {
        this.callParent(arguments);
        this.setFillColor(Ext.create('FourJS.util.Color', {
            r: 0,
            g: 85,
            b: 150,
            a: 0.7
        }));
    }
});
