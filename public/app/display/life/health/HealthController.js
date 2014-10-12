/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.health.HealthController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.Health',
    fill: null,
    clip: null,
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
        this.points = '0,0 2.5,2 97.5,2 100,0 92,0 8,0'; // determine the points for the shape of the health bar
	    this.currentHealth = this.getView().getHealth(); // update the current health to full
    },
    /**
     * Called when the health has been rendered.
     */
    onAfterRender: function () {
        var view = this.getView();
	    var dimensions = view.getDimensions();
        // create an svg element to draw on with a view box of 100 x 100
        var draw = SVG('health').size(dimensions.width, dimensions.height).viewbox(0, 0, 100, 2.5);
        // create the outline of the shield and its specified colour and width
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
        // create the fill polygon for the shield with its specified colour and opacity
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
	 * This method updates the health bar width to correctly display the health.
	 */
	updateHealthDisplay: function () {
		// todo
	},
	/**
	 * An event fired when the health is depleted to match the damage taken.

	 * @param damage The amount of damage taken.
	 */
	onTakeDamage: function (damage) {
		this.currentHealth = Math.max(0, this.currentHealth - damage);      // remove a certain amount of health
		if (this.currentHealth === 0) {                                     // check if the health has fully depleted
			// todo fire some event
		}
		this.updateHealthDisplay();                                         // update the health display
	},
	/**
	 * An event fired when the health is restored by a certain amount.
	 *
	 * @param amount The amount to restore.
	 */
	onRestore: function (amount) {
		var health = this.getView().getHealth();                            // get the maximum health
		this.currentHealth = Math.min(health, this.currentHealth + amount); // restore a certain amount of health
		this.updateHealthDisplay();                                         // update the health display
	}
});
