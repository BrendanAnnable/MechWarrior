/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.Level', {
    alias: 'Level',
    extend: 'FourJS.util.Scene',
    requires: [
        'MW.level.Floor',
        'MW.level.Skybox',
        'FourJS.light.DirectionalLight'
    ],
    config: {
        controller: null,
        width: 0,
        height: 0,
        depth: 0,
        activeCamera: null,
        cameras: null,
        skybox: null,
        floor: null,
        obstacles: null,
        renderObstaclesBoundingBoxes: false
    },
    constructor: function () {
        this.callParent(arguments);
        this.setCameras([]);
        this.setObstacles([]);
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
     * Creates a skybox for the level.
     *
     * @param cubeMap The paths of the cube map images.
     * @param [width] The width of the skybox.
     * @param [height] The height of the skybox.
     * @param [depth] The depth of the skybox.
     */
    createSkybox: function (cubeMap, width, height, depth) {
        var scale = 2;
        if (width === undefined) {
            width = this.getWidth() * scale;
        }
        if (height === undefined) {
            height = this.getHeight() * scale;
        }
        if (depth === undefined) {
            depth = this.getDepth() * scale
        }
        var skybox = Ext.create('MW.level.Skybox', {
            name: 'skybox',
            width: width,
            height: height,
            depth: depth,
            cubeMap: cubeMap
        });
        this.setSkybox(skybox);
        this.addChild(skybox);
    },
    /**
     * Creates a floor for the level.
     *
     * @param url The path of the floor image.
     * @param [width] The width of the floor.
     * @param [height] The height of the floor.
     */
    createFloor: function (url, width, height) {
        if (width === undefined) {
            width = this.getWidth();
        }
        if (height === undefined) {
            height = this.getHeight();
        }
        var floor = Ext.create('MW.level.Floor', {
            name: 'floor',
            width: width,
            height: height,
            url: url
        });
        this.setFloor(floor);
        this.addChild(floor);
    },

    /**
     * Sets the width, height and depth of the level.
     *
     * @param width The width of the level.
     * @param height The height of the level.
     * @param depth The depth of the level.
     */
    setDimensions: function (width, height, depth) {
        this.setWidth(width);
        this.setHeight(height);
        this.setDepth(depth);
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

    toggleObstaclesBoundingBoxesRenderable: function(){

        if (this.renderObstaclesBoundingBoxes) {
            console.log('render is true, removing bounding boxes');

//            console.log('num of obst: ' + this.getObstacles().length);
            for (var i =0; i < this.getObstacles().length; i++) {
                this.getObstacles()[i].removeBoundingBox();
            }

            this.renderObstaclesBoundingBoxes = false;
        }
        else{
//            console.log('render is false, adding bounding boxes');
            console.log('num of obst: ' + this.getObstacles().length);

            for (var i =0; i < this.getObstacles().length; i++) {
                this.getObstacles()[i].addBoundingBox();
            }
            this.renderObstaclesBoundingBoxes = true;
        }
    }


});
