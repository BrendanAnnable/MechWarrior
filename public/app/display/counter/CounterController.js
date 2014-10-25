/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.counter.CounterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.Counter',
    current: 0,
    control: {
        '#': {
            update: 'onUpdate',
            reset: 'onReset'
        }
    },
    init: function () {
        var view = this.getView();                  // retrieve the view
        var maximum = view.getMaximum();            // get the maximum amount to win the game
        view.down('#counter').update({              // update the template
            current: 0,
            maximum: maximum
        });
    },
    /**
     * An event triggered when a player kills another player.
     */
    onUpdate: function () {
        var maximum = this.getView().getMaximum();  // get the maximum count
        this.current++;                             // increment the counter
        this.getView().down('#counter').update({    // update the template
            current: this.current,
            maximum: maximum
        });
        if (this.current === maximum) {
            // todo someone won the game
        }
    },
    /**
     * An event triggered when the deathmatch is restarted.
     */
    onReset: function () {
        var maximum = this.getView().getMaximum();  // get the maximum count
        this.current = 0;                           // reset the counter
        this.getView().down('#counter').update({    // update the template
            current: this.current,
            maximum: maximum
        });
    }
});
