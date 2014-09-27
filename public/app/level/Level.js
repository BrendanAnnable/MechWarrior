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
        activeCamera: null,
        cameras: null,
        skybox: null,
        floor: null,
        obstacles: null
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
        this.setCameras([]);
        this.setObstacles([]);
		this.addChild(floor);
		this.addChild(skybox);
    },
    /**
     * Adds a camera to the level.
     *
     * @param camera The camera to add
     */
    addCamera: function (camera) {
        this.getCameras().push(camera);
        this.addChild(camera);
    },
    /**
     * Removes a camera from the level.
     *
     * @param camera The camera to remove
     */
    removeCamera: function (camera) {
        Ext.Array.remove(this.getCameras(), camera);
        this.removeChild(camera);
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
    }
});
