Ext.define('FourJS.util.helpers.HermiteSplineHelper', {
	extend: 'FourJS.object.Object',
	config: {
		spline: null
	},
	pointBoxes: null,
	lerpBoxes: null,
	constructor: function (config) {
		this.pointBoxes = Ext.create('FourJS.object.Object');
		this.lerpBoxes = Ext.create('FourJS.object.Object');

		this.callParent(arguments);

		this.addChild(this.pointBoxes);
		this.addChild(this.lerpBoxes);
	},
	updateSpline: function (spline) {
		var points = spline.getPoints();

		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			var size = 0.3;
			var box = Ext.create('FourJS.object.Mesh', {
				geometry: Ext.create('FourJS.geometry.CubeGeometry', {
					width: size,
					height: size,
					depth: size
				}),
				material: Ext.create('FourJS.material.Phong', {
					color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1})
				})
			});
			box.translate(point[0], point[1], point[2]);
			this.pointBoxes.addChild(box);
		}
		var numLerpPoints = 200;
		for (var i = 0; i < numLerpPoints; i++) {
			var size = 0.1;
			var box = Ext.create('FourJS.object.Mesh', {
				geometry: Ext.create('FourJS.geometry.CubeGeometry', {
					width: size,
					height: size,
					depth: size
				}),
				material: Ext.create('FourJS.material.Phong', {
					color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1})
				})
			});
			var point = spline.getPoint(i / (numLerpPoints - 1));
			box.translate(point[0], point[1], point[2]);
			this.lerpBoxes.addChild(box);
		}
	}
});

