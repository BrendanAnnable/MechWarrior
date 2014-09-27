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
    config: {
        controllers: null,
        mouseControls: null,
        keyboardControls: null,
        assetManager: null,
        audioManager: null
    },
	constructor: function (config) {
		this.callParent(arguments);
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
    }
});
