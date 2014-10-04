/**
 * @author Brendan Annable
 *
 * Patch to add various helpers methods to the gl-matrix library.
 */

var GLMAT_EPSILON = 0.000001;

/**
 * Return a vec4 reference to the given column vector of a mat4
 *
 * Editing the returned vector will edit the original matrix in place
 *
 * @param a The mat4 to get the column of
 * @param col The index of the column (0-indexed)
 * @returns A vec4 reference to the column vector
 */
mat4.col = function (a, col, rows) {
	if (rows === undefined) {
		rows = 4;
	}
	var start = 4 * col;
	return a.subarray(start, start + rows);
};

/**
 * Return the vec4 translation vector of a mat4
 *
 * Editing the returned vector will edit the original translation vector in place
 *
 * @param a The mat4 to get the translation vector of
 * @returns A vec4 reference to the translation vector
 */
mat4.translateVector = function (a) {
	return mat4.col(a, 3);
};

mat4.createRotate = function (rad, axis) {
	var rot = mat4.create();
	mat4.rotate(rot, rot, rad, axis);
	return rot;
};

mat4.createRotateX = function (rad) {
	var rotX = mat4.create();
	mat4.rotateX(rotX, rotX, rad);
	return rotX;
};

mat4.createRotateY = function (rad) {
	var rotY = mat4.create();
	mat4.rotateY(rotY, rotY, rad);
	return rotY;
};

mat4.createRotateZ = function (rad) {
	var rotZ = mat4.create();
	mat4.rotateZ(rotZ, rotZ, rad);
	return rotZ;
};

mat2d.zeros = function () {
	return new Float32Array(6);
};

mat2.zeros = function () {
	return new Float32Array(4);
};

mat3.zeros = function () {
	return new Float32Array(9);
};

mat4.zeros = function () {
	return new Float32Array(16);
};

vec4.vec3 = function (a) {
	return a.subarray(0, 3);
};

vec4.createPoint = function () {
	return vec4.fromValues(0, 0, 0, 1);
};

vec4.rotate = function (out, a, rad, axis) {
	var rot = mat4.createRotate(rad, axis);
	vec4.transformMat4(out, a, rot);
	return out;
};

vec4.rotateX = function (out, a, rad) {
	var rotX = mat4.createRotateX(rad);
	vec4.transformMat4(out, a, rotX);
	return out;
};

vec4.rotateY = function (out, a, rad) {
	var rotY = mat4.createRotateX(rad);
	vec4.transformMat4(out, a, rotY);
	return out;
};

vec4.rotateZ = function (out, a, rad) {
	var rotZ = mat4.createRotateX(rad);
	vec4.transformMat4(out, a, rotZ);
	return out;
};

vec3.findNormal = function (out, a) {
	// TODO: account for floating point badness
	if (a[0] > 0) {
		out[0] = -a[1];
		out[1] = a[0];
		out[2] = 0;
	}
	else {
		out[0] = 0;
		out[1] = -a[2];
		out[2] = a[1];
	}
    return out;
};

vec3.directionCosineX = function (a) {
	return a[0] / vec3.length(a);
};

vec3.directionCosineY = function (a) {
	return a[1] / vec3.length(a);
};

vec3.directionCosineZ = function (a) {
	return a[2] / vec3.length(a);
};

mat4.othoNormalInvert = function(out, a){
	var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
		a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
		a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
		a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	out[0] = a00;
	out[1] = a10;
	out[2] = a20;
	out[3] = a03;

	out[4] = a01;
	out[5] = a11;
	out[6] = a21;
	out[7] = a13;

	out[8]  = a02;
	out[9]  = a12;
	out[10] = a22;
	out[11] = a23;

	var rot = mat3.create();
	mat4.getRotationSubMatrix(rot, out);
	var tInv = vec3.fromValues(a30, a31, a32);
	vec3.transformMat3(tInv, tInv, rot);

	out[12] = -tInv[0];
	out[13] = -tInv[1];
	out[14] = -tInv[2];
	out[15] = a33;

	return out;
};

mat4.getRotationSubMatrix = function (out, a) {
	var a00 = a[0], a01 = a[1], a02 = a[2],
		a10 = a[4], a11 = a[5], a12 = a[6],
		a20 = a[8], a21 = a[9], a22 = a[10];

	out[0] = a00;
	out[1] = a01;
	out[2] = a02;

	out[3] = a10;
	out[4] = a11;
	out[5] = a12;

	out[6] = a20;
	out[7] = a21;
	out[8] = a22;

	return out;
};

mat4.getTranslationSubMatrix = function (out, a) {
	out[0] = a[12];
	out[1] = a[13];
	out[2] = a[14];
	return out;
};

mat4.copyTranslation = function (out, a) {
	out[12] = a[12];
	out[13] = a[13];
	out[14] = a[14];
	return out;
};

mat4.copyRotation = function (out, a) {
	out[0] = a[0];
	out[1] = a[1];
	out[2] = a[2];

	out[4] = a[4];
	out[5] = a[5];
	out[6] = a[6];

	out[8] = a[8];
	out[9] = a[9];
	out[10] = a[10];
	return out;
};

mat2.round = function (out, a, dp) {
	if (dp === undefined) {
		dp = 0;
	}
	out[0] = a[0].toFixed(dp);
	out[1] = a[1].toFixed(dp);
	out[2] = a[2].toFixed(dp);
	out[3] = a[3].toFixed(dp);
	return out;
};

mat4.transposeRotation = function (out, a) {

	var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
		a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
		a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
		a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	out[0] = a00;
	out[1] = a10;
	out[2] = a20;
	out[3] = a03;

	out[4] = a01;
	out[5] = a11;
	out[6] = a21;
	out[7] = a13;

	out[8]  = a02;
	out[9]  = a12;
	out[10] = a22;
	out[11] = a23;

	out[12] = a30;
	out[13] = a31;
	out[14] = a32;
	out[15] = a33;
};

vec4.fromMat4 = function (a) {
	var point = vec4.createPoint();
	vec4.transformMat4(point, point, a);
	return point;
};

mat4.fromVec4Cols = function (out, v1, v2, v3, v4) {
	out[0] = v1[0];
	out[1] = v1[1];
	out[2] = v1[2];
	out[3] = v1[3];

	out[4] = v2[0];
	out[5] = v2[1];
	out[6] = v2[2];
	out[7] = v2[3];

	out[8] = v3[0];
	out[9] = v3[1];
	out[10] = v3[2];
	out[11] = v3[3];

	out[12] = v4[0];
	out[13] = v4[1];
	out[14] = v4[2];
	out[15] = v4[3];

	return out;
};

glMatrix.getMat = function (n) {
	var mat = window["mat" + n];
	if (mat === undefined) {
		throw new Error("Matrix of size " + n + " not supported");
	}
	return mat;
};

glMatrix.getVec = function (n) {
	var vec = window["vec" + n];
	if (vec === undefined) {
		throw new Error("Vector of size " + n + " not supported");
	}
	return vec;
};

mat4.print = function (a, n) {
	if (n === undefined) {
		n = 4;
	}
	var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
		a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
		a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
		a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	console.log(
		  a00.toFixed(n) + ", " + a10.toFixed(n) + ", " + a20.toFixed(n) + ", " + a30.toFixed(n) + "\n"
		+ a01.toFixed(n) + ", " + a11.toFixed(n) + ", " + a21.toFixed(n) + ", " + a31.toFixed(n) + "\n"
		+ a02.toFixed(n) + ", " + a12.toFixed(n) + ", " + a22.toFixed(n) + ", " + a32.toFixed(n) + "\n"
		+ a03.toFixed(n) + ", " + a13.toFixed(n) + ", " + a23.toFixed(n) + ", " + a33.toFixed(n)
	);
};

vec3.equal = function (a, b) {
	return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
};

vec3.close = function (a, b) {
	return Math.abs(a[0] - b[0]) < GLMAT_EPSILON
		&& Math.abs(a[1] - b[1]) < GLMAT_EPSILON
		&& Math.abs(a[2] - b[2]) < GLMAT_EPSILON;
};

vec4.close = function (a, b) {
	return Math.abs(a[0] - b[0]) < GLMAT_EPSILON
		&& Math.abs(a[1] - b[1]) < GLMAT_EPSILON
		&& Math.abs(a[2] - b[2]) < GLMAT_EPSILON
		&& Math.abs(a[3] - b[3]) < GLMAT_EPSILON;
};

mat4.fromValues = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
	return new Float32Array([
		a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
	]);
};

/**
 * Computes the cross product of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.cross = function(out, a, b) {
	var ax = a[0], ay = a[1], az = a[2],
		bx = b[0], by = b[1], bz = b[2];

	out[0] = ay * bz - az * by;
	out[1] = az * bx - ax * bz;
	out[2] = ax * by - ay * bx;
	return out;
};


/**
 * Interpolates position of two inversely proportional points according to some factor.
 * // TODO: explain this better
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.blend = function (out, a, b, factor) {
	var c = vec4.scale(vec4.create(), a, 1 - factor);
	var d = vec4.scale(vec4.create(), b, factor);
	return vec4.add(out, c, d);
};
