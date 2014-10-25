/**
 * @author Monica Olejniczak
 */
Ext.define('MW.manager.Weapon', {
    alias: 'WeaponManager',
    requires: [
        'MW.projectile.Bullet'
    ],
    config: {
        audioManager: null
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    createBullet: function (mouseControls, options) {
        var bulletAsset = options.assetManager.getAsset('bullet');
        var sound = options.assetManager.getAsset('bulletSound');
        var levelController = options.levelController;
        var origin = options.position;
        var position = mat4.create();
        mat4.copyTranslation(position, origin);
        mat4.translate(position, position, vec3.fromValues(0, 2, -2));
		var bullet = Ext.create('MW.projectile.Bullet', {
            initialVelocity: 40,
            mass: 0.5,
            position: position,
            pitch: mouseControls.getPitch() - Math.PI / 2,
            yaw: mouseControls.getYaw() - Math.PI / 2
        });
		bullet.addChild(bulletAsset);
        levelController.addProjectile(bullet);

        if (this.getAudioManager().getSound()) {
            sound.play();
        }
    }
});
