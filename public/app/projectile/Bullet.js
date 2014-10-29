/**
 * @author Monica Olejniczak
 */
Ext.define('MW.projectile.Bullet', {
    alias: 'Bullet',
    extend: 'MW.projectile.Projectile',
    constructor: function () {
        this.callParent(arguments);
        this.setDamage(200);
    }
});