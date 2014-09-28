/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.object.Mesh', {
    alias: 'Mesh',
	extend: 'FourJS.object.Object',
    requires: [
        'FourJS.geometry.Geometry'
    ],
    config: {
        geometry: null,
        material: null,
        boundingBox: null
    },
    constructor: function () {
        this.callParent(arguments);
		this.setRenderable(true);
    },
    hasMaterial: function () {
        return this.getMaterial() !== null;
    },
    getBoundingBox: function () {
        var boundingBox = this.getGeometry().getBoundingBox();
        // transforms and returns the bounding box in world space
        return {
            min: vec3.transformMat4(vec3.create(), boundingBox.min, this.getWorldPosition()),
            max: vec3.transformMat4(vec3.create(), boundingBox.max, this.getWorldPosition())
        };
    },
    /**
     * Calculates all the bounding box points using the bounding box method.
     */
    getBoundingPoints: function () {
        var points = [];
        var boundingBox = this.getBoundingBox();
        var min = boundingBox.min;
        var max = boundingBox.max;
        points.push(vec3.fromValues(min[0], min[1], min[2])); // bottom left front
        points.push(vec3.fromValues(min[0], min[1], max[2])); // bottom left back
        points.push(vec3.fromValues(min[0], max[1], min[2])); // top left front
        points.push(vec3.fromValues(min[0], max[1], max[2])); // top left back
        points.push(vec3.fromValues(max[0], min[1], min[2])); // bottom right front
        points.push(vec3.fromValues(max[0], min[1], max[2])); // bottom right back
        points.push(vec3.fromValues(max[0], max[1], min[2])); // top right front
        points.push(vec3.fromValues(max[0], max[1], max[2])); // top right back
        return points;
    }
});
