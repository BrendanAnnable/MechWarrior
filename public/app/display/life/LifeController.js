/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.life.LifeController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.Life',
    /**
     * Updates the shield display.
     *
     * @param previousValue The shield value before damaging or restoring it.
     * @param newValue The new shield value.
     * @param maximumValue The maximum shield value.
     */
    updateShield: function (previousValue, newValue, maximumValue) {
        this.getView().getShield().fireEvent('update', previousValue, newValue, maximumValue);
    },
    /**
     * Updates the health display.
     *
     * @param previousValue The health value before damaging or restoring it.
     * @param newValue The new health value.
     * @param maximumValue The maximum health value.
     */
    updateHealth: function (previousValue, newValue, maximumValue) {
        this.getView().getHealth().fireEvent('update', previousValue, newValue, maximumValue);
	}
});
