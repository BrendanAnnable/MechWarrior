/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.Life', {
    alias: 'widget.Life',
    extend: 'Ext.container.Container',
	shield: null,
	health: null,
    requires: [
        'MW.display.life.health.Health',
        'MW.display.life.shield.Shield',
	    'MW.display.life.LifeController'
    ],
	controller: 'Life',
    layout: 'absolute',
    cls: 'life',
	height: '100%',
    initComponent: function () {
        this.callParent(arguments);
	    // create the shield
	    this.shield = Ext.widget('Shield', {
		    shield: 250, // todo get from player
		    strokeColor: '#6ffaff',
		    strokeWidth: 0.2
	    });
	    // create the health bar
	    this.health = Ext.widget('Health', {
		    health: 1000, // todo get from player
		    strokeColor: '#fff',
		    strokeWidth: 0.2
	    });
	    // add both the shield and health bar as child items to life
        this.add(this.shield);
        this.add(this.health);
    },
	/**
	 * An accessor method that returns the shield component.
	 */
	getShield: function () {
		return this.shield;
	},
	/**
	 * An accessor method that returns the health component.
	 */
	getHealth: function () {
		return this.health;
	}
});