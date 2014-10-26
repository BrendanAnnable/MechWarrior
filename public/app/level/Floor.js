/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.Floor', {
	alias: 'Floor',
	extend: 'FourJS.object.Mesh',
    mixins: {
        physics: 'PhysJS.DynamicObject'
    },
    requires: [
        'FourJS.geometry.CubeGeometry',
        'FourJS.util.Color',
        'FourJS.loader.Texture'
    ],
    config: {
        width: 150,
        height: 150,
        url: null
    },
	/**
	 * Creates a plane mesh to represent the floor in the scene.
	 */
	constructor: function (config) {
		this.callParent(arguments);
        this.mixins.physics.constructor.call(this, config);
		this.setGravity(false);
		this.setDynamic(false);
		// create the plane geometry and rotate it so that it is horizontal to the ground
		var geometry = Ext.create('FourJS.geometry.CubeGeometry', {
			width: this.getWidth(),
			height: this.getHeight(),
			depth: 100
		});
		geometry.rotateX(-Math.PI * 0.5);
		geometry.translate(vec3.fromValues(0, -geometry.getDepth() / 2, 0));
		// create the mesh containing the geometry
        var material = Ext.create('FourJS.material.Phong', {
            texture: Ext.create('FourJS.loader.Texture', {
                url: this.getUrl(),
	            repeatable: true
            }),
            color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1})
        });
		this.setGeometry(geometry);
		this.setMaterial(material);
        this.setDynamic(false);
	}
});