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
mat4.col = function (a, col) {
	var start = 4 * col;
	return a.subarray(start, start + 4);
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
