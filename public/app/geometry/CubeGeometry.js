Ext.define('MW.geometry.CubeGeometry', {
    extend: 'MW.geometry.Geometry',
    alias: 'CubeGeometry',
    config: {
        width: 0,
        height: 0,
        depth: 0
    },
    init: function () {
        this.callParent(arguments);
        var width = this.getWidth();
        var height = this.getHeight();
        var depth = this.getHeight();
        //this.calcPoints(width, height, depth);
    },
    calcPoints: function (width, height, depth) {
        this.setVertices([
            // front
            vec3.fromValues(0, 1, 0),
            vec3.fromValues(-1, -1, 1),
            vec3.fromValues(1, -1, 1),
            // right
            vec3.fromValues(0, 1, 0),
            vec3.fromValues(1, -1, 1),
            vec3.fromValues(1, -1, -1),
            // back
            vec3.fromValues(0, 1, 0),
            vec3.fromValues(1, -1, -1),
            vec3.fromValues(-1, -1, -1),
            // left
            vec3.fromValues(0, 1, 0),
            vec3.fromValues(-1, -1, -1),
            vec3.fromValues(-1, -1, 1)
        ]);
        this.setNormals([
            vec3.fromValues(0, 0, 1),
            vec3.fromValues(0, 0, 1),
            vec3.fromValues(0, 0, 1),
            vec3.fromValues(0, 0, 1)
        ]);
        this.setFaces([
            vec3.fromValues(0, 1, 2),
            vec3.fromValues(0, 2, 3)
        ]);
    }
});