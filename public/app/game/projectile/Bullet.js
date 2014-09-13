/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Bullet', {
    alias: 'Bullet',
    extend: 'MW.game.projectile.Projectile',
    requires: [
        'MW.material.Basic'
    ],
    constructor: function () {
        this.callParent(arguments);
        this.setDamage(50);
    }
});