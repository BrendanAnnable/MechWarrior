/**
 * Created by juliusskye on 12/10/2014.
 */


Ext.define('MW.level.City.Building', {
    alias: 'Building',
    requires: [
        'FourJS.material.Basic'
    ],
    config: {
        width: 100,
        height: 1000,
        depth: 100
    },
    constructor: function () {
        this.callParent(arguments);
        // todo load some mesh
        var geometry = Ext.create('FourJS.geometry.CubeGeometry', {
            width: this.getWidth(),
            height: this.getHeight(),
            depth: this.getDepth()
        });
        var material = Ext.create('FourJS.material.Basic');
        // create the mesh with the newly created geometry and material
        this.setGeometry(geometry);
        this.setMaterial(material);
    }
});