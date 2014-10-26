/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.Display', {
    alias: 'widget.Display',
    extend: 'Ext.container.Container',
	radar: null,
	life: null,
    counter: null,
	messenger: null,
    requires: [
        'MW.display.radar.Radar',
        'MW.display.life.Life',
	    'MW.display.counter.Counter',
	    'MW.display.messenger.Messenger'
    ],
    layout: 'absolute',
    initComponent: function () {
        this.callParent(arguments);
	    // create the radar
	    this.radar = Ext.create('MW.display.radar.Radar', {
		    x: 20,
		    y: 30,
		    strokeColor: '#fff',
		    strokeWidth: 1.5
	    });
	    // create the life
	    this.life = Ext.create('MW.display.life.Life', {
		    y: 50
	    });
        // create the counter
        this.counter = Ext.create('MW.display.counter.Counter');
	    // create the messenger
	    this.messenger = Ext.create('MW.display.messenger.Messenger');
	    // add the components of the display
        this.add(this.radar);
        this.add(this.life);
        this.add(this.counter);
	    this.add(this.messenger);
    },
	/**
	 * An accessor method that retrieves the radar.
	 */
	getRadar: function () {
		return this.radar;
	},
	/**
	 * An accessor method that retrieves the life.
	 */
	getLife: function () {
		return this.life;
	},
    /**
     * An accessor method that retrieves the deathmatch counter.
     */
    getCounter: function () {
        return this.counter;
    },
	/**
	 * An accessor method that retrieves the messenger display.
	 */
	getMessenger: function () {
		return this.messenger;
	},
	/**
	 * Adds keyboard events to the display.
	 *
	 * @param keyboardControls The keyboard controls for the game.
	 */
	addKeyboardEvents: function (keyboardControls) {
		var messenger = this.getMessenger();
		keyboardControls.on({
			messenger: function () {
				messenger.fireEvent('update', keyboardControls.hasMenuContext())
			},
			removeMenuContext: function () {
				messenger.fireEvent('update', keyboardControls.hasMenuContext())
			},
			scope: this
		});
	}
});