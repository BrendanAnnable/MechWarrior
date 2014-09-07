/**
 * @author Brendan Annable
 *
 * Patch to add various helpers methods to the gl-matrix library.
 */

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
