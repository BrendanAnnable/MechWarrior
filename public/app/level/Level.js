/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.Level', {
    alias: 'Level',
    extend: 'FourJS.util.Scene',
    requires: [
        'MW.level.Floor',
        'MW.level.Skybox'
    ],
    config: {
        width: 0,
        height: 0,
        depth: 0,
        skybox: null,
        floor: null,
        players: null,
        obstacles: null,
        projectiles: null
    },
    constructor: function () {
        this.callParent(arguments);
        var width = this.getWidth();
        var height = this.getHeight();
        var depth = this.getDepth();
        var floor = Ext.create('MW.level.Floor', {
            name: 'floor',
            width: width,
            height: height
        });
		var scale = 2;
        var skybox = Ext.create('MW.level.Skybox', {
            name: 'skybox',
            width: width * scale,
            height: height * scale,
            depth: depth * scale
        });
        this.setSkybox(skybox);
        this.setFloor(floor);
        this.setPlayers([]);
        this.setObstacles([]);
        this.setProjectiles([]);
		this.addChild(floor);
		this.addChild(skybox);
    },
    /**
     * Adds a player to the level.
     *
     * @param player The player to add
     */
    addPlayer: function (player) {
        this.getPlayers().push(player);
        this.addChild(player);
    },
    /**
     * Removes a player from the level.
     *
     * @param player The player to remove
     */
    removePlayer: function (player) {
        Ext.Array.remove(this.getPlayers(), player);
        this.removeChild(player);
    },
    /**
     * Adds an obstacle to the level.
     *
     * @param obstacle The obstacle to add
     */
    addObstacle: function (obstacle) {
        this.getObstacles().push(obstacle);
        this.addChild(obstacle);
    },
    /**
     * Removes an obstacle from the level.
     *
     * @param obstacle The obstacle to remove
     */
    removeObstacle: function (obstacle) {
        Ext.Array.remove(this.getObstacles(), obstacle);
        this.removeChild(obstacle);
    },
	/**
	 * Adds a projectile to the level when the user clicks the left mouse button.
	 *
	 * @param projectile The projectile to be added to the level.
	 */
	addProjectile: function (projectile) {
		this.getProjectiles().push(projectile);
		this.addChild(projectile);
		projectile.on('collision', function () {
			this.removeProjectile(projectile);
		}, this);
	},
    /**
     * Removes a projectile from the level.
     *
     * @param projectile The projectile to remove
     */
    removeProjectile: function (projectile) {
        Ext.Array.remove(this.getProjectiles(), projectile);
        this.removeChild(projectile);
    }

});