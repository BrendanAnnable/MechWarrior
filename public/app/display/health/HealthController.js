/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.health.HealthController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.Health',
    outline: null,
    fill: null,
    clip: null,
    points: null,
    control: {
        '*': {
            'afterrender': 'onAfterRender'
        }
    },
    init: function () {
        this.points = '0,0 2.5,2 97.5,2 100,0 92,0 8,0';
    },
    /**
     * Called when the shield has been rendered.
     */
    onAfterRender: function () {
        var view = this.getView();
        // create an svg element to draw on with a view box of 100 x 100
        var draw = SVG('health').viewbox(0, 0, 100, 2.5);
        // create the outline of the shield and its specified colour and width
        this.outline = draw.polygon(this.points).fill('transparent').stroke({
            color: view.getStrokeColor(),
            width: view.getStrokeWidth()
        });
        // create a clipping rectangle to change the bar width easily
        this.clip = draw.rect(100, 100).fill('transparent');
        // create the fill polygon for the shield with its specified colour and opacity
        this.fill = draw.polygon(this.points).fill({
            color: view.getFillColor(),
            opacity: view.getFillOpacity()
        });
    }
});
