/**
 * @author juliussky
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
        this.callParent(arguments);
		this.setDynamic(false);
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
		    color: Ext.create('FourJS.util.Color', {
			    r: 1,
			    g: 1,
			    b: 1
		    })
	    });
	    var scale = 5;
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