/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.genesis.Genesis', {
	extend: 'MW.level.Level',
    requires: [
        'MW.level.genesis.GenesisController'
    ],
	constructor: function () {
		this.callParent(arguments);
        this.setName('Genesis');
        var width = 200;
        var height = 200;
        var depth = 200;
        this.setDimensions(width, height, depth);
        this.createSkybox({
            upUrl: "/resources/image/skybox/urban/up.png",
            rightUrl: "/resources/image/skybox/urban/right.png",
            downUrl: "/resources/image/skybox/urban/down.png",
            leftUrl: "/resources/image/skybox/urban/left.png",
            frontUrl: "/resources/image/skybox/urban/front.png",
            backUrl: "/resources/image/skybox/urban/back.png"
        });
        this.createFloor("/resources/image/ground_low.jpg");
        // create an ambient light to the level at the origin
        var ambientLight = Ext.create('FourJS.light.AmbientLight', {
            color: Ext.create('FourJS.util.Color', {r: 0, g: 0, b: 0.2})
        });
        // create a directional light to the level and move its position
        var directionalLight = Ext.create('FourJS.light.DirectionalLight', {
            color: Ext.create('FourJS.util.Color', {r: 0.2, g: 0, b: 0.6})
        });
        directionalLight.translate(-25, 10, 0);
        // create a second directional light to the level and move its position
        var directionalLight2 = Ext.create('FourJS.light.DirectionalLight', {
            color: Ext.create('FourJS.util.Color', {r: 0.2, g: 0, b: 0.6})
        });
        directionalLight2.translate(25, 10, 0);
        // add all the lights to the level
        this.addChild(ambientLight);
        this.addChild(directionalLight);
        this.addChild(directionalLight2);
        this.setController('MW.level.genesis.GenesisController');
	}
});
