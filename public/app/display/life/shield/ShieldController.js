/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.shield.ShieldController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.Shield',
    fill: null,
    clip: null,
    points: null,
	currentShield: 0,
	maxWidth: 100,
	maxHeight: 5,
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
	 * This method updates the shield bar width to correctly display the shield.
	 *
	 * @param previousShield The previous shield amount.
	 * @param shield The total shield amount.
	 */
	updateShieldDisplay: function (previousShield, shield) {
		var from = previousShield / shield * 100;                               // calculate the starting x value
		var to = this.currentShield / shield * 100;                             // calculate the x value to move
		var x = from;                                                           // instantiate x to the starting value
		var steps = 1;                                                          // the steps to take per iteration
		var time = 2;                                                           // the maximum time to deplete
		function updateClock () {                                               // the method used upon each interval
			x = from >= to ? x - steps : x + steps;                             // update the x value
			if ((from >= to && x <= to) || (from <= to && x >=to)) {            // check if the shield has updated
				Ext.TaskManager.stop(task);                                     // stop running the task
			}
			this.clip.move(-(this.maxWidth - x), 0);                            // move the clipping to its new position
			this.fill.clipWith(this.clip);                                      // clip the fill with the clipping
		}
		var task = Ext.TaskManager.start({                                      // run the animation update
			run: updateClock,                                                   // the function used to animate
			interval: time * 1000 / (Math.abs((to - from)) * steps),            // how often the function is run
			scope: this                                                         // the scope parameter
		});
	},
	/**
	 * An event fired when the shield is depleted to match the damage taken.

	 * @param damage The amount of damage taken.
	 */
	onTakeDamage: function (damage) {
		var previousShield = this.currentShield;                                // store the previous shield value
		this.currentShield = Math.max(0, this.currentShield - damage);          // remove a certain amount of shield
		this.updateShieldDisplay(previousShield, this.getView().getShield());   // update the shield display
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
		debugger;
		this.updateShieldDisplay(previousShield, shield);                       // update the shield display
	}
});
