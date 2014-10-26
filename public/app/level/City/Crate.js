/**
 * @author juliussky
 */
Ext.define('MW.level.city.Crate', {
    alias: 'Crate',
    extend: 'FourJS.object.Mesh',
    // TODO: move crate creation from Genesis to here
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
		height: 300,
		depth: 100,
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
			    url: this.getUrl()
		    }),
		    color: Ext.create('FourJS.util.Color', {
			    r: 1,
			    g: 1,
			    b: 1
		    })
	    });
	    this.setGeometry(geometry);
	    this.setMaterial(material);
    }
});
