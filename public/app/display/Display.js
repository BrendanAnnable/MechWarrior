/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.Display', {
    alias: 'widget.Display',
    extend: 'Ext.container.Container',
	radar: null,
	life: null,
    requires: [
        'MW.display.radar.Radar',
        'MW.display.life.Life'
    ],
    layout: 'absolute',
    initComponent: function () {
        this.callParent(arguments);
	    // create the radar
	    this.radar = Ext.create('MW.display.radar.Radar', {
		    x: 20,
		    y: 30,
		    strokeColor: '#fff',
		    strokeWidth: 1.5,
		    defaultObjectColor: Ext.create('FourJS.util.Color', {r: 0, g: 85, b: 150, a: 0.7})
	    });
	    // create the life
	    this.life = Ext.create('MW.display.life.Life', {
		    y: 50
	    });
	    // add the radar and life as components of the display
        this.add(this.radar);
        this.add(this.life);
    },
	/**
	 * An accessor method that retrieves the radar.
	 */
	getRadar: function () {
		return this.radar;
	},
	/**
	 * An accessor method that retrieves the life
	 */
	getLife: function () {
		return this.life;
	}
});