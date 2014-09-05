/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Projectile', {
    alias: 'Projectile',
    extend: 'MW.object.Mesh',
    config: {
        damage: 0,
        acceleration: null,
        initialVelocity: 0,
        timeSpawned: 0
    },
    constructor: function () {
        this.callParent(arguments);
        this.setAcceleration(vec3.fromValues(0, -9.8, 0));
        this.setTimeSpawned(Date.now());
    }/*,
    getPosition: function () {
        var timeSpawned = this.getTimeSpawned();
        var currentTime = Date.now();
        // todo do things
    }*/
});
