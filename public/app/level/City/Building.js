/**
<<<<<<< HEAD
 * @author juliussky
=======
 * Created by juliusskye on 12/10/2014.
 * Refactored by Monica Olejniczak on 26/10/2014
>>>>>>> Refactored the genesis controller.
 */
Ext.define('MW.level.city.Building', {
    alias: 'Building',
    extend: 'FourJS.object.Mesh',
    // TODO: move building creation from Genesis to here
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
	    var scale = 50;
	    var coordinates = geometry.getTextureCoords();
	    var textureCoords = [];
	    for (var i = 0; i < coordinates.length; i++) {
		    var coordinate = coordinates[i];
		    textureCoords.push(new Float32Array([coordinate[0] * scale, coordinate[1] * scale]));
	    }
	    geometry.setTextureCoords(textureCoords);
	    this.setGeometry(geometry);
	    this.setMaterial(material);
    }
});