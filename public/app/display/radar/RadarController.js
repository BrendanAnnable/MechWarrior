/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.radar.RadarController', {
	extend: 'FourJS.util.svg.SVGController',
	alias: 'controller.Radar',
	circle: null,
	config: {
		radius: 50,
		space: 10       // The amount of space between the edge and circle
	},
	control: {
		'*': {
			'afterrender': 'onAfterRender'
		}
	},
	constructor: function (config) {
		this.callParent(arguments);
		this.initConfig(config);
	},
	/**
	 * Called when the radar has been rendered.
	 */
	onAfterRender: function () {
		var view = this.getView();
		var dimensions = view.getDimensions();
		var radius = this.getRadius();
		var diameter = radius * 2;
		// create an svg element to draw on with a view box
		var draw = SVG('radar').size(dimensions.width, dimensions.height).viewbox(0, 0, diameter, diameter);
		// create the clipping path for the edge
		var edgeClip = draw.rect(radius, (radius + diameter) / 1.8);
		// create the edge of the circle
		draw.circle(diameter).fill('none').stroke({
			color: view.getStrokeColor(),
			width: view.getStrokeWidth()
		}).clipWith(edgeClip).move(1, 1);
		var fillColor = view.getFillColor();                    // get the fill colour of the radar
		var space = this.getSpace();                            // get the space between the edge and the circle
		var translate = space / 2;                              // calculate the amount to translate the circle
		// calculate the radar diameter and the centre point
		var radarDiameter = diameter - space;
		var centreWidth = radius / 15;
		var centre  = space * 0.5 + ((radarDiameter - centreWidth) / 2);
		// create the circle for the radar
		this.circle = draw.circle(radarDiameter).fill({
			color: fillColor.getHex(),
			opacity: fillColor.getOpacity()
		}).stroke({
			color: view.getStrokeColor(),
			width: view.getStrokeWidth()
		}).move(translate, translate);
		// draw the glowy bit
		var clip = Ext.String.format('{0},{1} {2},{3} {4},{5}', centre + 1, centre + 2, 0, 0, diameter, 0);
		var clipWith = draw.polyline(clip);
		//draw.path(clip).stroke({width: 2});
		draw.circle(radarDiameter).fill({
			color: fillColor.getHex(),
			opacity: fillColor.getOpacity()
		}).move(translate, translate).clipWith(clipWith);
		// create the bottom edge of the circle
		var points = Ext.String.format('{0},{1} {2},{3}', radius, diameter - translate, diameter, diameter - translate);
		draw.polyline(points).fill('none').stroke({
			color: view.getStrokeColor(),
			width: view.getStrokeWidth()
		});
		// create the centre dot of the circle
		draw.circle(centreWidth).fill({
			color: fillColor.getHex()
		}).move(centre, centre);
		// create the rings of the radar
		var ringWidth = radarDiameter / 3;
		translate = space * 0.5 + ((radarDiameter - ringWidth) / 2);
		draw.circle(ringWidth).fill('none').stroke({
			color: fillColor.getHex(),
			width: view.getStrokeWidth() / 2
		}).move(translate, translate);
		ringWidth = radarDiameter / 1.5;
		translate = space * 0.5 + ((radarDiameter - ringWidth) / 2);
		draw.circle(ringWidth).fill('none').stroke({
			color: fillColor.getHex(),
			width: view.getStrokeWidth() / 2
		}).move(translate, translate);
	}
});
