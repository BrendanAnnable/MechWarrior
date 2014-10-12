/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.health.HealthController', {
    extend: 'FourJS.util.svg.SVGController',
    alias: 'controller.Health',
    points: null,
	currentHealth: null,
    control: {
        '*': {
            'afterrender': 'onAfterRender',
	        'takedamage': 'onTakeDamage',
	        'restore': 'onRestore'
        }
    },
    init: function () {
        this.points = '0,0 2.5,2 97.5,2 100,0 92,0 8,0';    // determine the points for the shape of the health bar
	    this.currentHealth = this.getView().getHealth();    // update the current health to full
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
        var draw = SVG('health').size(dimensions.width, dimensions.height).viewbox(0, 0, 100, 2.5);
        // create the outline of the health and its specified colour and width
        draw.polygon(this.points).fill('none').stroke({
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
        // create the fill polygon for the health with its specified colour and opacity
        this.fill = draw.polygon(this.points).fill({
            color: gradient,
            opacity: view.getFillColor().getOpacity()
        });
    },
	/**
	 * An accessor method that returns the current health.
	 *
	 * @returns {number} The current health.
	 */
	getCurrentHealth: function () {
		return this.currentHealth;
	},
	/**
	 * An event fired when the health is depleted to match the damage taken.

	 * @param damage The amount of damage taken.
	 */
	onTakeDamage: function (damage) {
		var previousHealth = this.currentHealth;                                // store the previous health value
		this.currentHealth = Math.max(0, this.currentHealth - damage);          // remove a certain amount of health
		if (this.currentHealth === 0) {                                         // check if the health has been depleted
			// todo fire some event
		}
		// update the health fill display
		this.updateFillDisplay(previousHealth, this.currentHealth, this.getView().getHealth());
	},
	/**
	 * An event fired when the health is restored by a certain amount.
	 *
	 * @param amount The amount to restore.
	 */
	onRestore: function (amount) {
		var previousHealth = this.currentHealth;                                // store the previous health value
		var health = this.getView().getHealth();                                // get the maximum health
		this.currentHealth = Math.min(health, this.currentHealth + amount);     // restore a certain amount of health
		this.updateFillDisplay(previousHealth, this.currentHealth, health);     // update the health fill display
	}
});
