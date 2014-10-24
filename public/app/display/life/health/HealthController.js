/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.health.HealthController', {
    extend: 'FourJS.util.svg.SVGController',
    alias: 'controller.Health',
    points: null,
    control: {
        '*': {
            'afterrender': 'onAfterRender',
	        'update': 'onUpdate'
        }
    },
    init: function () {
        this.points = '0,0 2.5,2 97.5,2 100,0 92,0 8,0';    // determine the points for the shape of the health bar
	    this.maxWidth = 100;                                // update the max width of the health
	    this.maxHeight = 2;                                 // update the max height of the health
    },
    /**
     * Called when the health has been rendered.
     */
    onAfterRender: function () {
        var view = this.getView();
	    var dimensions = view.getDimensions();
        // create an svg element to draw on with a view box of 100 x 100
        this.draw = SVG('health').size(dimensions.width, dimensions.height).viewbox(0, 0, 100, 2.5);
        // create a clipping rectangle to change the bar width easily
        this.clip = this.draw.rect(100, 100).fill('none');
        // create the gradient for the fill effect
        var gradient = this.draw.gradient('linear', function (stop) {
            var amount = 20;
            stop.at({offset: 0, color: view.getFillColor().getDarker(amount).getHex()});
            stop.at({offset: 0.5, color: view.getFillColor().getHex()});
            stop.at({offset: 1, color: view.getFillColor().getLighter(amount).getHex()});
        });
        // create the fill polygon for the health with its specified colour and opacity
        this.fill = this.draw.polygon(this.points).fill({
            color: gradient,
            opacity: view.getFillColor().getOpacity()
        });
	    // create the outline of the health and its specified colour and width
	    this.draw.polygon(this.points).fill('none').stroke({
		    color: view.getStrokeColor(),
		    width: view.getStrokeWidth()
	    });
    },
	/**
	 * An event fired when the health is restored or damaged.
	 *
     * @param previousValue The health value before restoring it.
     * @param newValue The new health value.
     * @param maximumValue The maximum health value.
	 */
	onUpdate: function (previousValue, newValue, maximumValue) {
        this.updateFillDisplay(previousValue, newValue, maximumValue);
	}
});
