/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.LifeController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.Life',
	takeDamage: function (damage) {
		var view = this.getView();
		var shield = view.getShield();
		var currentShield = shield.getController().getCurrentShield();
		var health = view.getShield();
		if (currentShield - damage > 0) {                       // check if only the shield will be damaged
			shield.fireEvent('takedamage', damage);             // damage the shield
		} else {                                                // the shield will not be damaged
			if (currentShield === 0) {                          // check if the shield is already depleted
				health.fireEvent('takeDamage', damage);         // damage the health
			} else {                                            // both the shield and health will be damaged (overflow)
				// the shield is depleted
				shield.fireEvent('takeDamage', currentShield);
				// the health takes the rest of the damage
				health.fireEvent('takeDamage', damage - currentShield);
			}
		}
	},
	/**
	 * Restores a certain amount to the shield.
	 *
	 * @param amount The amount to restore.
	 */
	restoreShield: function (amount) {
		this.getView().getShield().fireEvent('restore', amount);
	},
	/**
	 * Restores a certain amount to the health.
	 *
	 * @param amount The amount to restore.
	 */
	restoreHealth: function (amount) {
		this.getView().getHealth().fireEvent('restore', amount);
	},
	/**
	 * Restores both the shield and health to full.
	 */
	revive: function () {
		var view = this.getView();
		this.reviveShield(view.getShield());
		this.reviveHealth(view.getHealth());
	},
	/**
	 * Restores the shield to full.
	 *
	 * @param shield The shield view.
	 */
	reviveShield: function (shield) {
		// calculate the amount to restore and then revive the shield
		var amount = shield.getShield() - shield.getController().getCurrentShield();
		this.restoreShield(amount);
	},
	/**
	 * Restores the health to full.
	 *
	 * @param health The health view controller.
	 */
	reviveHealth: function (health) {
		// calculate the amount to restore and then revive the health
		var amount = health.getHealth() - health.getController().getCurrentHealth();
		this.restoreHealth(amount);
	}
});
