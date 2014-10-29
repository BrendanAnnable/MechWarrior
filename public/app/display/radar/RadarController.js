/**
 * @author Monica Olejniczak
 */
Ext.define('MW.display.radar.RadarController', {
	extend: 'FourJS.util.svg.SVGController',
	alias: 'controller.Radar',
	radar: null,            // The radar drawing.
	centre: null,           // The centre of the radar.
	objects: null,          // The actual objects on the radar.
	control: {
		'*': {
			'afterrender': 'onAfterRender'
		}
	},
	constructor: function () {
		this.callParent(arguments);
		this.objects = {};
	},
	/**
	 * Called when the radar has been rendered.
	 */
	onAfterRender: function () {
		var view = this.getView();
		var dimensions = view.getDimensions();
		var radius = view.getRadius();
		var diameter = radius * 2;
		// create an svg element to draw on with a view box
		this.draw = SVG('radar').size(dimensions.width, dimensions.height).viewbox(0, 0, diameter, diameter);
		// render each component of the radar
		this.renderComponents(view, this.draw, radius, diameter);
	},
	/**
	 * Renders each component of the radar.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param radius The radius of the radar.
	 * @param diameter The diameter of the radar.
	 */
	renderComponents: function (view, draw, radius, diameter) {
		var space = view.getSpace();                                    // get the space between the edge and the circle
		var radarDiameter = diameter - space;                           // calculate the diameter of the radar
		var centreRadius = view.getCentreRadius();                      // get the radius of the centre dot
		var centre = radius - centreRadius;                             // calculate the actual centre of the radar
		this.centre = {x: centre, y: centre};                           // assign the centre to the member variable
		this.renderRadar(view, draw, diameter, radarDiameter, space);   // renders the radar
		this.renderOuterEdge(view, draw, radius, diameter);             // renders the outer edge of the radar
		this.renderUpFace(view, draw, centre, radarDiameter, space);    // renders the up bound part of the radar
		this.renderCentre(view, draw, centre, centreRadius * 2);        // renders the centre dot of the radar
		this.renderRing(view, draw, radarDiameter / 3);                 // renders the smaller ring of the radar
		this.renderRing(view, draw, radarDiameter / 1.5);               // renders the larger ring of the radar
		this.renderBottomEdge(view, draw, radius, diameter);            // renders the bottom edge of the radar
	},
	/**
	 * Renders the radar.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param diameter The diameter of the whole radar.
	 * @param radarDiameter The diameter of the radar.
	 * @param space The space between the outer edge and the radar.
	 */
	renderRadar: function (view, draw, diameter, radarDiameter, space) {
		var translate = space * 0.5;                                    // calculate the amount to translate the radar
		var fillColor = view.getFillColor();                            // get the fill colour of the radar
		var gradient = draw.gradient('linear', function (stop) {        // create the gradient
			stop.at(0, '#9fe6ea');
			stop.at(1, fillColor.getHex());
		}).from(0, 0).to(0, 1);
		this.radar = draw.circle(radarDiameter).fill({                  // draw the radar
			color: gradient,
			opacity: fillColor.getOpacity()
		}).stroke({
			color: view.getStrokeColor(),
			width: view.getStrokeWidth()
		}).move(translate, translate);
	},
	/**
	 * Renders the centre dot of the radar.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param centre The centre point to translate by.
	 * @param diameter The diameter of the centre dot.
	 */
	renderCentre: function (view, draw, centre, diameter) {
		draw.circle(diameter).fill({
			color: view.getCentreColor().getHex()
		}).move(centre, centre);
	},
	/**
	 * Renders a ring on the radar given a width.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param width The width of the ring.
	 */
	renderRing: function (view, draw, width) {
		var translate = this.getRingTranslation(width);
		draw.circle(width).fill('none').stroke({
			color: view.getFillColor().getHex(),
			width: view.getStrokeWidth() / 2
		}).move(translate, translate);
	},
	/**
	 * Renders the upward bound lighter component of the radar.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param centre The centre point to translate by.
	 * @param diameter The diameter of the face.
	 * @param space The space between the outer edge and the radar.
	 */
	renderUpFace: function (view, draw, centre, diameter, space) {
		var points = Ext.String.format('{0},{1} {2},{3} {4},{5}', centre + 1, centre + 2, 0, 0, diameter, 0);
		var clip = draw.polyline(points);
		var fillColor = view.getFillColor();
		var translate = space * 0.5;
		draw.circle(diameter).fill({
			color: fillColor.getHex(),
			opacity: fillColor.getOpacity()
		}).move(translate, translate).clipWith(clip);
	},
	/**
	 * Renders the outer edge of the radar.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param radius The radius of the radar.
	 * @param diameter The diameter of the radar.
	 */
	renderOuterEdge: function (view, draw, radius, diameter) {
		// create the clipping path for the edge
		var edgeClip = draw.rect(radius, (radius + diameter) / 1.8);
		// create the edge of the circle
		draw.circle(diameter).fill('none').stroke({
			color: view.getStrokeColor(),
			width: view.getStrokeWidth()
		}).clipWith(edgeClip).move(1, 1);
	},
	/**
	 * Renders the bottom edge of the radar.
	 *
	 * @param view The radar view.
	 * @param draw The SVG being drawn on.
	 * @param radius The radius of the radar.
	 * @param diameter The diameter of the radar.
	 */
	renderBottomEdge: function (view, draw, radius, diameter) {
		var translate = view.getSpace() * 0.5;
		var points = Ext.String.format('{0},{1} {2},{3}', radius, diameter - translate, diameter, diameter - translate);
		draw.polyline(points).fill('none').stroke({
			color: view.getStrokeColor(),
			width: view.getStrokeWidth()
		});
	},
	/**
	 * Calculates the translation for a ring given its width.
	 *
	 * @param width The width of the ring.
	 * @returns {number} The amount to translate by.
	 */
	getRingTranslation: function (width) {
		return this.getView().getSpace() * 0.5 + ((this.radar.width() - width) / 2);
	},
	moveCircle: function (key, position) {
		var circle = this.objects[key];
		if (!circle) {
			this.addCircle(key, position);
		} else {
			circle.move(this.centre.x + position[0], this.centre.y + position[2]).clipWith(this.radar.clone());
		}
	},
	/**
	 * Adds a circle to the radar at a certain position.
	 *
	 * @param key The name of the circle to refer by.
	 * @param [position] An optional position to set the circle in.
	 * @param [diameter] An optional diameter of the circle.
	 * @param [color] An optional colour to pass in.
	 */
	addCircle: function (key, position, diameter, color) {
		var view = this.getView();
		position = position || vec4.create();
		color = color === undefined ? view.getDefaultObjectColor().getHex() : color.getHex();
		diameter = diameter || view.getDefaultObjectRadius() * 2;
		// create and draw the circle object
		this.objects[key] = this.draw.circle(diameter).fill({
			color: color
		}).move(this.centre.x + position[0], this.centre.y + position[2]).clipWith(this.radar.clone());
	},
	/**
	 * Removes an object from the radar based off its key.
	 *
	 * @param key The name of the object to remove.
	 */
	removeObject: function (key) {
		this.objects[key].remove();     // removes the object from the SVG
		delete this.objects[key];       // removes the object from the array
	}
});
