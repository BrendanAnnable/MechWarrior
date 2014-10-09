/**
 * @author Monica Olejniczak
 */
Ext.define('MW.manager.Level', {
	alias: 'LevelManager',
	extend: 'FourJS.util.manager.Scene',
    requires: [
        'MW.level.LevelController',
        'MW.manager.Audio'
    ],
    weaponManager: null,
    levels: null,
    config: {
        controllers: null,
        mouseControls: null,
        keyboardControls: null,
        assetManager: null,
        audioManager: null
    },
	constructor: function (config) {
		this.callParent(arguments);
        this.levels = {
            'Genesis': 'MW.level.genesis.Genesis',
            'Omega': 'MW.level.omega.Omega'
        };
        this.weaponManager = Ext.create('MW.manager.Weapon', {
            audioManager: this.getAudioManager()
        });
        this.setControllers({});
	},
    /**
     * Adds a level to the manager.
     *
     * @param key The key to refer to the level by
     * @param level The level to add.
     */
    addScene: function (key, level) {
        this.addAsset(key, level);
        this.getControllers()[key] = Ext.create(level.getController(), {
            level: level,
            keyboardControls: this.getKeyboardControls(),
            mouseControls: this.getMouseControls(),
            assetManager: this.getAssetManager(),
            weaponManager: this.weaponManager
        });
    },
    /**
     * Retrieves a level controller specified by its name.
     *
     * @param key The key to retrieve the controller by.
     */
    getController: function (key) {
        return this.getControllers()[key];
    },
    /**
     * Checks if the level exists within the manager.
     *
     * @param key The name of the level.
     * @returns {boolean}
     */
    hasLevel: function (key) {
        var asset = this.getAsset(key);
        return asset !== undefined && asset !== null;
    },
    /**
     * Loads a level specified by the name.
     *
     * @param name The name of the level to load.
     */
    loadLevel: function (name) {
        // check if the level has not been loaded previously
        if (!this.hasLevel(name)) {
            var level = this.levels[name];
            // check if the level being loaded does not exist
            if (level === undefined) {
                console.error(Ext.String.format('The level {0} does not exist', name));
            } else {
                // load the level and add it to the manager
				Ext.syncRequire(level);
                this.addScene(name, Ext.create(level));
            }
        }
        this.setActiveScene(this.getAsset(name)); // set the active scene to the level
    }
});
