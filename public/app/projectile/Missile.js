/**
 * @author Monica Olejniczak
 */
Ext.define('MW.projectile.Missile', {
    alias: 'Missile',
    extend: 'MW.projectile.Projectile',
	requires: [
		'FourJS.material.Basic'
	],
    config: {
        width: 0,
        height: 0,
        depth: 0
    },
    constructor: function () {
        this.callParent(arguments);
        this.setDamage(100);
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