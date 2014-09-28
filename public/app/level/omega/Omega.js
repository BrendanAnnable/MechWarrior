Ext.define('MW.level.omega.Omega', {
    extend: 'MW.level.Level',
    constructor: function (config) {
        this.callParent(arguments);
        this.setName('Omega');
        this.setWidth(200);
        this.setHeight(200);
        this.setDepth(200);
        // create a directional light to the level and move its position
        var directionalLight = Ext.create('FourJS.light.DirectionalLight', {
            color: Ext.create('FourJS.util.Color', {r: 0.2, g: 0, b: 0.6})
        });
        directionalLight.translate(0, 10, 0);

        // add all the lights to the level
        this.addChild(directionalLight);

        this.setController('MW.level.omega.OmegaController');
    }
});
