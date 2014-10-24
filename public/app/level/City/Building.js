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
    }
});