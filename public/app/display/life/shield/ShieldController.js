/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.shield.ShieldController', {
	extend: 'FourJS.util.svg.SVGController',
    alias: 'controller.Shield',
    points: null,
    control: {
        '*': {
            'afterrender': 'onAfterRender',
	        'update': 'onUpdate'
        }
    },
    init: function () {
        this.points = '0,0 5,5 95,5 100,0 92,0 89,2.5 11,2.5 8,0'; // determine the points for the shape of the shield
	    this.maxWidth = 100;                                       // update the max width of the shield
	    this.maxHeight = 5;                                        // updates the max height of the shield
    },
    /**
     * Called when the shield has been rendered.
     */
    onAfterRender: function () {
        var view = this.getView();
	    var dimensions = view.getDimensions();
        // create an svg element to draw on with a view box of 100 x 100
        this.draw = SVG('shield').size(dimensions.width, dimensions.height).viewbox(0, 0, 100, 5);
        // create a clipping rectangle to change the bar width easily
        this.clip = this.draw.rect(this.maxWidth, this.maxHeight).fill('none');
        // create the gradient for the fill effect
        var gradient = this.draw.gradient('linear', function (stop) {
            stop.at({offset: 0, color: view.getFillColor().getDarker(10).getHex()});
            stop.at({offset: 0.5, color: view.getFillColor().getHex()});
            stop.at({offset: 1, color: view.getFillColor().getLighter(20).getHex()});
        });
        // create the fill polygon for the shield with its specified colour and opacity
        this.fill = this.draw.polygon(this.points).fill({
            color: gradient,
            opacity: view.getFillColor().getOpacity()
        });
	    // create the outline of the shield and its specified colour and width
	    this.draw.polygon(this.points).fill('none').stroke({
		    color: view.getStrokeColor(),
		    width: view.getStrokeWidth(),
		    linejoin: 'round'
	    });
    },
	/**
	 * An event fired when the shield is restored or damaged.
	 *
     * @param previousValue The shield value before restoring it.
     * @param newValue The new shield value.
	 * @param maximumValue The maximum shield value.
	 */
	onUpdate: function (previousValue, newValue, maximumValue) {
        if (this.task != null && this.task.pending) {                   // check if a task exists and it is still running
            Ext.TaskManager.stop(this.task);                            // stop the task
            previousValue = this.currentValue;                          // update the previous value to what the task had
        }
		this.updateFillDisplay(previousValue, newValue, maximumValue);  // update the shield fill display
	}
});
