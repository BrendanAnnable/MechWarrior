/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.counter.CounterController', {
    extend: 'FourJS.util.svg.SVGController',
    alias: 'controller.Counter',
    text: null,
    current: 0,
    init: function () {
        var view = this.getView();          // retrieve the view
        var maximum = view.getMaximum();    // get the maximum amount to win the game
        view.down('#counter').update({                       // update the template
            current: 0,
            maximum: maximum
        });
    }
});
