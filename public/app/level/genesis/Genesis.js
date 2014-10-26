/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 */
Ext.define('MW.level.genesis.Genesis', {
	extend: 'MW.level.Level',
    requires: [
        'MW.level.genesis.GenesisController',
		'FourJS.util.Color',
		'FourJS.light.AmbientLight',
		'FourJS.light.DirectionalLight',
		'FourJS.environment.Fog'
    ],
	constructor: function () {
		this.callParent(arguments);
        this.setName('Genesis');
        var width = 300;
        var height = 300;
        var depth = 300;
        this.setDimensions(width, height, depth);
        this.createSkybox({
            upUrl: "/resources/image/skybox/urban/up.png",
            rightUrl: "/resources/image/skybox/urban/right.png",
            downUrl: "/resources/image/skybox/urban/down.png",
            leftUrl: "/resources/image/skybox/urban/left.png",
            frontUrl: "/resources/image/skybox/urban/front.png",
            backUrl: "/resources/image/skybox/urban/back.png"
        });
        var floor = this.createFloor("/resources/image/ground_low.jpg");
		floor.translate(0, -0.01, 0);
        // create an ambient light to the level at the origin
        var ambientLight = Ext.create('FourJS.light.AmbientLight', {
            color: Ext.create('FourJS.util.Color', {r: 0.2, g: 0, b: 0.2})
        });
        // create a directional light to the level and move its position
        var directionalLight = Ext.create('FourJS.light.DirectionalLight', {
            color: Ext.create('FourJS.util.Color', {r: 0.3, g: 0.0, b: 1.0})
        });
        directionalLight.translate(0, 10, 0);
        // create a second directional light to the level and move its position
        var directionalLight2 = Ext.create('FourJS.light.DirectionalLight', {
            color: Ext.create('FourJS.util.Color', {r: 0.5, g: 0, b: 0.0})
        });
        directionalLight2.translate(25, 10, 0);

		var fog = Ext.create('FourJS.environment.Fog', {
			color: Ext.create('FourJS.util.Color', {r: 0.2, g: 0.0, b: 0.3}),
			density: 0.1,
			easing: 0.7,
			height: -2
		});

		// Add some GUI sliders
		var f = GUI.addFolder('Lights');
		var acolor = ambientLight.getColor();
		var af = f.addFolder('AmbientLight');
		af.add(acolor, '_r', 0, 1).step(0.01);
		af.add(acolor, '_g', 0, 1).step(0.01);
		af.add(acolor, '_b', 0, 1).step(0.01);
		var color = directionalLight.getColor();
		var df = f.addFolder('DirectionalLight1');
		df.add(color, '_r', 0, 1).step(0.01);
		df.add(color, '_g', 0, 1).step(0.01);
		df.add(color, '_b', 0, 1).step(0.01);
		var color2 = directionalLight2.getColor();
		var df2 = f.addFolder('DirectionalLight2');
		df2.add(color2, '_r', 0, 1).step(0.01);
		df2.add(color2, '_g', 0, 1).step(0.01);
		df2.add(color2, '_b', 0, 1).step(0.01);
		var fcolor = fog.getColor();
		var ff = GUI.addFolder('Fog');
		ff.add(fcolor, '_r', 0, 1).step(0.01);
		ff.add(fcolor, '_g', 0, 1).step(0.01);
		ff.add(fcolor, '_b', 0, 1).step(0.01);
		ff.add(fog, '_density', 0, 1).step(0.01);
		ff.add(fog, '_easing', 0, 1).step(0.01);
		ff.add(fog, '_height', -10, 0).step(0.5);

        // add all the lights to the level
        this.addChild(ambientLight);
        this.addChild(directionalLight);
        this.addChild(directionalLight2);
		this.addChild(fog);
        this.setController('MW.level.genesis.GenesisController');
	}
});
