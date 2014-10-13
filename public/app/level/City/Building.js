/**
 * Created by juliusskye on 12/10/2014.
 */


Ext.define('MW.level.City.Building', {
    alias: 'Building',
    extend: 'FourJS.object.Mesh',
    requires: [
        'FourJS.geometry.CubeGeometry',
        'FourJS.material.Basic',
        'FourJS.loader.CubeMap'

    ],
    config: {

        xCoord: 0,
        zCoord: 0,
        width: 10,
        height: 100,
        depth: 10
    },
    constructor: function () {
        this.callParent(arguments);
        // todo load some mesh
        var geometry = Ext.create('FourJS.geometry.CubeGeometry', {
            width: this.getWidth(),
            height: this.getHeight(),
            depth: this.getDepth()
        });
        var cubeMap = this.getCubeMap();
        var material = Ext.create('FourJS.material.Phong', {
            environmentMap: Ext.create('FourJS.loader.CubeMap', {
                upUrl: cubeMap.upUrl,
                rightUrl: cubeMap.rightUrl,
                downUrl: cubeMap.downUrl,
                leftUrl: cubeMap.leftUrl,
                frontUrl: cubeMap.frontUrl,
                backUrl: cubeMap.backUrl
            }),
            useLighting: false
        });
        /*// create and load the texture from the specified source
         var material = Ext.create('FourJS.material.Phong', {
         texture: Ext.create('FourJS.loader.Texture', {
         url: "/resources/image/texture.png"
         }),
         useLighting: false
         });*/


        // create the mesh with the newly created geometry and material
        this.setGeometry(geometry);
        this.setMaterial(material);


        var material = Ext.create('FourJS.material.Basic');
        // create the mesh with the newly created geometry and material
        this.setGeometry(geometry);
        this.setMaterial(material);
    },

    addBoundingBox: function () {
        this.setBoundingBox(FourJS.geometry.Geometry.getBoundingBox(this));

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
                color: Ext.create('FourJS.util.Color', {
                    r: 1,
                    g: 1,
                    b: 1
                }),
                useLighting: false,
                wireframe: true
            })
        });
        var center = boundingBox.getCenter();
        box.translate(center[0], center[1], center[2]);
        this.box = box;
        //this.box.setRenderable(false);
        this.addChild(box);
    },
});