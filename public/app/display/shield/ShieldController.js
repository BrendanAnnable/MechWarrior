/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.shield.ShieldController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.Shield',
    outline: null,
    fill: null,
    clip: null,
    gradient: null,
    points: null,
    control: {
        '*': {
            'afterrender': 'onAfterRender'
        }
    },
    init: function () {
        this.points = '0,0 5,5 95,5 100,0 92,0 89,2.5 11,2.5 8,0';
    },
    /**
     * Called when the shield has been rendered.
     */
    onAfterRender: function () {
        var view = this.getView();
        // create an svg element to draw on with a view box of 100 x 100
        var draw = SVG('shield').viewbox(0, 0, 100, 5);
        // create the outline of the shield and its specified colour and width
        this.outline = draw.polygon(this.points).fill('transparent').stroke({
            color: view.getStrokeColor(),
            width: view.getStrokeWidth()
        });
        // create a clipping rectangle to change the bar width easily
        this.clip = draw.rect(100, 100).fill('transparent');
        // create the gradient for the fill effect
        var gradient = draw.gradient('linear', function (stop) {
            stop.at({offset: 0, color: view.getFillColor().getDarker(20).getHex()});
            stop.at({offset: 0.5, color: view.getFillColor().getHex()});
            stop.at({offset: 1, color: view.getFillColor().getLighter(30).getHex()});
        });
        // create the fill polygon for the shield with its specified colour and opacity
        this.fill = draw.polygon(this.points).fill({
            color: gradient,
            opacity: view.getFillColor().getOpacity()
        });
    }
});
