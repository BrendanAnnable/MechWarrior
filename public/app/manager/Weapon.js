/**
 * @author Monica Olejniczak
 */
Ext.define('MW.manager.Weapon', {
    alias: 'WeaponManager',
    createBullet: function (mouseControls, options) {
        var bullet = options.assetManager.getAsset('bullet');
        var sound = options.assetManager.getAsset('bulletSound');
        var level = options.level;
        var origin = options.position;
        var position = mat4.create();
        mat4.copyTranslation(position, origin);
        mat4.translate(position, position, vec3.fromValues(0, 2, 0));
        level.addProjectile(Ext.create('MW.projectile.Bullet', {
            name: bullet.name,
            geometry: bullet.geometry,
            material: bullet.material,
            initialVelocity: 40,
            mass: 0.5,
            position: position,
            pitch: mouseControls.getPitch() - Math.PI / 2,
            yaw: mouseControls.getYaw() - Math.PI / 2
        }));
        if (this.getSound()) {
            sound.play();
        }
    }
});
