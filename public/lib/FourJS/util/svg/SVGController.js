/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.svg.SVGController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.SVG',
    task: null,
    currentValue: null,
	draw: null,
	fill: null,
	clip: null,
	maxWidth: 0,
	maxHeight: 0,
	steps: 1,
	time: 2,
	/**
	 * This method updates the fill display with the appropriate values.
	 *
	 * @param previousValue The previously stored value of the fill.
	 * @param newValue The new value of the fill.
	 * @param maxValue The max fill value.
	 */
	updateFillDisplay: function (previousValue, newValue, maxValue) {
		if (this.fill !== null) {                                           // check if the fill exists
            this.currentValue = previousValue;                              // update the current value of the fill
			var from = previousValue / maxValue * 100;                      // calculate the starting x value
			var to = newValue / maxValue * 100;                             // calculate the x value to move
			var x = from;                                                   // instantiate x to the starting value
            // create how often the task is updated
            var interval = this.getInterval(from, to);
            // the amount to update the current value by
            var updateValue = Math.abs(newValue - previousValue) / (this.getTime() / interval);
            // the method used upon each interval
			function updateClock () {
                // update the x value
				x = from >= to ? x - this.steps : x + this.steps;
                this.currentValue = from >= to ? this.currentValue - updateValue: this.currentValue + updateValue;
                // check if the shield has updated
				if ((from >= to && x <= to) || (from <= to && x >=to)) {
					Ext.TaskManager.stop(this.task);                        // stop running the task
				}
				this.clip.move(-(this.maxWidth - x), 0);                    // move the clipping to its new position
				this.fill.clipWith(this.clip);                              // clip the fill with the clipping
			}
			this.task = Ext.TaskManager.start({                             // run the animation update
				run: updateClock,                                           // the function used to animate
				interval: interval,                                         // how often the function is run
				scope: this                                                 // the scope parameter
			});
		}
	},
	/**
	 * Calculates and returns a time interval.
	 *
	 * @param from The starting value.
	 * @param to The ending value.
	 * @returns {number} The time interval in milliseconds.
	 */
	getInterval: function (from, to) {
		return this.time * 1000 / (Math.abs((to - from)) * this.steps);
	},
	/**
	 * An accessor method that returns the time it takes to executes a task.
	 *
	 * @returns {number} The time it takes to execute a task in milliseconds.
	 */
	getTime: function () {
		return this.time * 1000;
	}
});
