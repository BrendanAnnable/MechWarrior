/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.character.Player', {
	alias: 'Player',
	extend: 'FourJS.object.Object',
	box: null, // TODO: hack
	mixins: {
		physics: 'PhysJS.DynamicObject'
	},
    requires: [
		'FourJS.geometry.Geometry',
        'FourJS.loader.Model',
        'FourJS.material.Phong',
        'FourJS.util.Color'
    ],
    currentHealth: 0,
    currentShield: 0,
    config: {
        maximumHealth: 1000,
        maximumShield: 500,
		mass: 10
    },
	constructor: function (config) {
		this.callParent(arguments);
		this.mixins.physics.constructor.call(this, config);
        // set the current health and shield to full
        this.currentHealth = this.getMaximumHealth();
        this.currentShield = this.getMaximumShield();
	},
    /**
     * Adds a bounding box to the player.
     */
	/*addBoundingBox: function () {
		// attach a visual bounding box for debugging purposes
		// TODO: make this generic and put it somewhere
		var boundingBox = this.getBoundingBox();
		var radii = boundingBox.getRadii();
		var box = Ext.create('FourJS.object.Mesh', {
			geometry: Ext.create('FourJS.geometry.CubeGeometry', {
				width: radii[0] * 2,
				height: radii[1] * 2,
				depth: radii[2] * 2
			}),
			material: Ext.create('FourJS.material.Phong', {
				color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1}),
				useLighting: false,
				wireframe: true
			})
		});
		var center = boundingBox.getCenter();
		box.translate(center[0], center[1], center[2]);
		this.box = box;
		this.box.setRenderable(false);
		this.addChild(box);
	},*/
    /**
     * Adds events to the player.
     *
     * @param keyboardControls The keyboard controls for the player.
     */
    onLoadEvents: function (keyboardControls) {
        keyboardControls.on('jump', this.onJump, this);
        this.on('takeDamage', this.onTakeDamage, this);
        this.on('restoreShield', this.onRestoreShield, this);
        this.on('restoreHealth', this.onRestoreHealth, this);
        this.on('revive', this.onRevive, this);
        this.on('reviveShield', this.onReviveShield, this);
        this.on('reviveHealth', this.onReviveHealth, this);
        this.on('respawn', this.onRespawn, this);
        this.on('kill', this.onKill, this);
    },
    /**
     * Removes events from the player.
     *
     * @param keyboardControls The keyboard controls for the player.
     */
    unLoadEvents: function (keyboardControls) {
        keyboardControls.un('jump', this.onJump, this);
        this.un('takeDamage', this.onTakeDamage, this);
        this.un('restoreShield', this.onRestoreShield, this);
        this.un('restoreHealth', this.onRestoreHealth, this);
        this.un('revive', this.onRevive, this);
        this.un('reviveShield', this.onReviveShield, this);
        this.un('reviveHealth', this.onReviveHealth, this);
        this.un('respawn', this.onRespawn, this);
        this.un('kill', this.onKill, this);
    },
	/**
	 * An event called that adds velocity to the player when the user presses the space bar.
	 */
    onJump: function () {
		this.getVelocity()[1] = 30;
	},
    /**
     * An event called when the user takes damage.
     *
     * @param menu The menu that contains the life and death count counter.
     * @param object The object that damaged that player.
     */
    onTakeDamage: function (menu, object) {
        var damage = object.getDamage();                // get the damage from the object
        var life = menu.getLife().getController();      // get the life controller
        // get the previous and maximum shield values
        var previousShield = this.currentShield;
        var maximumShield = this.getMaximumShield();
        // check if only the shield will be damaged
        if (previousShield - damage >= 0) {
            // damage the shield and update the display
            this.currentShield = Math.max(0, this.currentShield - damage);
            life.updateShield(previousShield, this.currentShield, maximumShield);
        } else {
            // get the previous and maximum health values
            var previousHealth = this.currentHealth;
            var maximumHealth = this.getMaximumHealth();
            // check if the shield is already depleted
            if (previousShield === 0) {
                // damage the health and update the display
                this.currentHealth = Math.max(0, this.currentHealth - damage);
                life.updateHealth(previousHealth, this.currentHealth, maximumHealth);
            } else {
                // both the shield and health will be damaged (overflow)
                // damage the shield and update its display
                this.currentShield = 0;
                life.updateShield(previousShield, this.currentShield, maximumShield);
                // begin a delayed task
                var task = new Ext.util.DelayedTask(function () {
                    // damage the health and update the display
                    this.currentHealth = Math.max(0, this.currentHealth - damage - previousShield);
                    life.updateHealth(previousHealth, this.currentHealth, maximumHealth);
                }, this);
                // delay the health depletion by how long the shield will take
                task.delay(life.getView().getShield().getController().getTime());
            }
            if (this.currentHealth === 0) {                             // check if the player has died
                var owner = object.getOwner();                          // get the owner of the object
                if (owner !== this) {                                   // check the owner did not accidentally suicide
                    owner.fireEvent('kill', this, menu.getCounter());   // some player killed another
                } else {
                    // todo fire some suicide message event
                }
                // todo after ten seconds
                this.fireEvent('respawn', life);                        // respawn the player that died
            }
        }
    },
    /**
     * An event called when the player restores some of their shield.
     *
     * @param life The life controller that is a part of the HUD.
     * @param amount The amount to restore.
     */
    onRestoreShield: function (life, amount) {
        // get the previous and maximum shield values
        var previousShield = this.currentShield;
        var maximumShield = this.getMaximumShield();
        // restores the amount of shield to the player
        // update the shield visually
        this.currentShield = Math.min(maximumShield, this.currentShield + amount);
        life.updateShield(previousShield, this.currentShield, maximumShield);
    },
    /**
     * An event called when the player restores some of their health.
     *
     * @param life The life controller that is a part of the HUD.
     * @param amount The amount to restore.
     */
    onRestoreHealth: function (life, amount) {
        // get the previous and maximum health values
        var previousHealth = this.currentHealth;
        var maximumHealth = this.getMaximumHealth();
        // restores the amount of health to the player
        // update the health visually
        this.currentHealth = Math.min(maximumHealth, this.currentHealth + amount);
        life.updateHealth(previousHealth, this.currentHealth, maximumHealth);
    },
    /**
     * An event called when the player restores both their shield and health fully.
     *
     * @param life The life controller that is a part of the HUD.
     */
    onRevive: function (life) {
        this.onReviveShield(life);  // call the revive shield method
        this.onReviveHealth(life);  // call the revive health method
    },
    /**
     * An event called when the player restores their shield fully.
     *
     * @param life The life controller that is a part of the HUD.
     */
    onReviveShield: function (life) {
        // get the maximum and previous shield value
        var maximumShield = this.getMaximumShield();
        var previousShield = this.currentShield;
        // revive the shield to the player
        // update the shield visually
        this.currentShield += maximumShield - this.currentShield;
        life.updateShield(previousShield, this.currentShield, maximumShield);
    },
    /**
     * An event called when the player restores their health fully.
     *
     * @param life The life controller that is a part of the HUD.
     */
    onReviveHealth: function (life) {
        // get the maximum and previous health value
        var maximumHealth = this.getMaximumHealth();
        var previousHealth = this.currentHealth;
        // revive the health to the player
        // update the health visually
        this.currentHealth += maximumHealth - this.currentHealth;
        life.updateHealth(previousHealth, this.currentHealth, maximumHealth);
    },
    /**
     * An event fired when a player has been respawned.
     *
     * @param life The life controller.
     */
    onRespawn: function (life) {
        this.onRevive(life);                        // revive the player
        // todo spawn randomly
        // todo update message
    },
    /**
     * An event fired when a player has been killed.
     *
     * @param player The player that was killed.
     * @param counter The counter for displaying deathmatch kills.
     */
    onKill: function (player, counter) {
        counter.fireEvent('update');
        // todo update message kill names
    }
	/**
	 * Renders the player model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	/*render: function (gl, shaderProgram, cursor, periodNominator) {
		// This animates the face such that is rotates around a point at the given radius,
		// and 'bobs' up and down at the given height with the given periods
		var minRadius = 10;
		var maxRadius = 20;
		var radiusPeriod = 1000;
		var yawPeriod = 8000;
		var pitchPeriod = 2000;
		var height = 5;

		var radius = 0.5 * (maxRadius - minRadius) * (Math.sin(periodNominator / radiusPeriod) + 1) + minRadius;
		var yaw = periodNominator / yawPeriod;
		var pitch = Math.asin(height * Math.sin(periodNominator / pitchPeriod) / radius);

		// Rotate to the direction of where the face will be drawn
		mat4.rotateY(cursor, cursor, yaw);
		mat4.rotateX(cursor, cursor, pitch);
		// Translate forward to outer radius
		mat4.translate(cursor, cursor, [0, 0, -radius]);
		// Rotate back so that the face always 'faces' the camera
		mat4.rotateX(cursor, cursor, -pitch);
		mat4.rotateY(cursor, cursor, -yaw);
		//		mat4.rotateZ(cursor, cursor, -yaw);

		this.superclass.render(gl, shaderProgram, cursor);
	}*/
});