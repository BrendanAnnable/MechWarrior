/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Missile', {
    alias: 'Missile',
    extend: 'MW.game.projectile.Projectile',
	requires: [
		'MW.material.Basic'
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
        var geometry = Ext.create('MW.geometry.CubeGeometry', {
            width: this.getWidth(),
            height: this.getHeight(),
            depth: this.getDepth()
        });
        var material = Ext.create('MW.material.Basic');
        // create the mesh with the newly created geometry and material
        this.setGeometry(geometry);
        this.setMaterial(material);
    }
});