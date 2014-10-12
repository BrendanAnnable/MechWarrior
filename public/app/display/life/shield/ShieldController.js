/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.shield.ShieldController', {
	extend: 'FourJS.util.svg.SVGController',
    alias: 'controller.Shield',
    points: null,
	currentShield: 0,
    control: {
        '*': {
            'afterrender': 'onAfterRender',
	        'takedamage': 'onTakeDamage',
	        'restore': 'onRestore'
        }
    },
    init: function () {
        this.points = '0,0 5,5 95,5 100,0 92,0 89,2.5 11,2.5 8,0'; // determine the points for the shape of the shield
	    this.currentShield = this.getView().getShield();           // update the current shield to full
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
        var draw = SVG('shield').size(dimensions.width, dimensions.height).viewbox(0, 0, 100, 5);
        // create the outline of the shield and its specified colour and width
        draw.polygon(this.points).fill('none').stroke({
            color: view.getStrokeColor(),
            width: view.getStrokeWidth(),
	        linejoin: 'round'
        });
        // create a clipping rectangle to change the bar width easily
        this.clip = draw.rect(this.maxWidth, this.maxHeight).fill('none');
        // create the gradient for the fill effect
        var gradient = draw.gradient('linear', function (stop) {
            stop.at({offset: 0, color: view.getFillColor().getDarker(10).getHex()});
            stop.at({offset: 0.5, color: view.getFillColor().getHex()});
            stop.at({offset: 1, color: view.getFillColor().getLighter(20).getHex()});
        });
        // create the fill polygon for the shield with its specified colour and opacity
        this.fill = draw.polygon(this.points).fill({
            color: gradient,
            opacity: view.getFillColor().getOpacity()
        });
    },
	/**
	 * An accessor method that returns the current shield.
	 *
	 * @returns {number} The current shield.
	 */
	getCurrentShield: function () {
		return this.currentShield;
	},
	/**
	 * An event fired when the shield is depleted to match the damage taken.

	 * @param damage The amount of damage taken.
	 */
	onTakeDamage: function (damage) {
		var previousShield = this.currentShield;                                // store the previous shield value
		this.currentShield = Math.max(0, this.currentShield - damage);          // remove a certain amount of shield
		// update the shield fill display
		this.updateFillDisplay(previousShield, this.currentShield, this.getView().getShield());
	},
	/**
	 * An event fired when the shield is restored by a certain amount.
	 *
	 * @param amount The amount to restore.
	 */
	onRestore: function (amount) {
		var previousShield = this.currentShield;                                // store the previous shield value
		var shield = this.getView().getShield();                                // get the maximum shield
		this.currentShield = Math.min(shield, this.currentShield + amount);     // restore a certain amount of shield
		this.updateFillDisplay(previousShield, this.currentShield, shield);     // update the shield fill display
	}
});
