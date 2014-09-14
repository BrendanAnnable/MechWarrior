/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.level.Floor', {
	alias: 'Floor',
	extend: 'MW.object.Mesh',
    mixins: {
        physics: 'MW.game.physics.DynamicObject'
    },
    requires: [
        'MW.geometry.PlaneGeometry',
        'MW.util.Color',
        'MW.loader.Texture'
    ],
    config: {
        width: 0,
        height: 0,
        dynamic: false
    },
	/**
	 * Creates a plane mesh to represent the floor in the scene.
	 */
	constructor: function (config) {
		this.callParent(arguments);
        this.mixins.physics.constructor.call(this, config);
		// create the plane geometry and rotate it so that it is horizontal to the ground
		var geometry = Ext.create('MW.geometry.PlaneGeometry', {
			width: this.getWidth(),
			height: this.getHeight()
		});
		geometry.rotateX(Math.PI * 0.5);
		// create the mesh containing the geometry
        var material = Ext.create('MW.material.Phong', {
            texture: Ext.create('MW.loader.Texture', {
                url: "/resources/image/ground.png",
	            repeatable: true
            }),
            color: Ext.create('MW.util.Color', {
                r: 1,
                g: 1,
                b: 1
            })
        });
		this.setGeometry(geometry);
		this.setMaterial(material);
	}
});