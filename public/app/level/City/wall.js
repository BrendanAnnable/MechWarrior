
/**
 * @author Julius Sky
 * @author Monica Olejniczak
 */
Ext.define('MW.level.city.Wall', {
	alias: 'Wall',
	extend: 'FourJS.object.Mesh',
	// TODO: move wall creation from Genesis to here
	mixins: {
		physics: 'PhysJS.DynamicObject'
	},
	requires: [
		'FourJS.geometry.Geometry',
		'FourJS.loader.Model',
		'FourJS.material.Phong',
		'FourJS.util.Color'
	],
	config: {
		width: 100,
		height: 100,
		depth: 5,
		url: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.mixins.physics.constructor.call(this, config);
		var geometry = Ext.create('FourJS.geometry.CubeGeometry', {
			width: this.getWidth(),
			height: this.getHeight(),
			depth: this.getDepth()
		});
		// create the mesh containing the geometry
		var material = Ext.create('FourJS.material.Phong', {
			texture: Ext.create('FourJS.loader.Texture', {
				url: this.getUrl(),
				repeatable: true
			}),
			color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1})
		});
		geometry.scaleTextureCoords(5);
		this.setGeometry(geometry);
		this.setMaterial(material);
		this.setDynamic(false);
	}

});