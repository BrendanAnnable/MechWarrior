/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.health.HealthController', {
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
        this.outline = draw.polygon(this.points).fill('none').stroke({
            color: view.getStrokeColor(),
            width: view.getStrokeWidth()
        });
        // create a clipping rectangle to change the bar width easily
        this.clip = draw.rect(100, 100).fill('none');
        // create the gradient for the fill effect
        var gradient = draw.gradient('linear', function (stop) {
            var amount = 20;
            stop.at({offset: 0, color: view.getFillColor().getDarker(amount).getHex()});
            stop.at({offset: 0.5, color: view.getFillColor().getHex()});
            stop.at({offset: 1, color: view.getFillColor().getLighter(amount).getHex()});
        });
        // create the fill polygon for the shield with its specified colour and opacity
        this.fill = draw.polygon(this.points).fill({
            color: gradient,
            opacity: view.getFillColor().getOpacity()
        });
    }
});
