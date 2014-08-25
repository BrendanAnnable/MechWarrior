/**
 * @author Brendan Annable
 */
Ext.define('MW.view.ViewportController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ViewportController',
	config: {
		gl: null,
		shaderProgram: null,
		canvas: null,
		mvStack: null,
		mvMatrix: null,
		pMatrix: null,
		models: null,
		lastTime: 0,
		angle: 0
	},
	init: function () {
		this.setPMatrix(new Float32Array(16));
		this.setMvMatrix(new Float32Array(16));
		this.setMvStack([]);
		this.setModels({});
	},
	onResize: function (container, width, height) {
		var canvas = this.getCanvas();
		var gl = this.getGl();
		canvas.width = width;
		canvas.height = height;
		gl.viewportWidth = width;
		gl.viewportHeight = height;
	},
	mvPush: function () {
		this.getMvStack().push(mat4.clone(this.getMvMatrix()));
	},
	mvPop: function () {
		var mvStack = this.getMvStack();
		if (mvStack.length === 0) {
			throw "mvStack empty";
		}
		this.setMvMatrix(mvStack.pop());
	},
	onAfterRender: function (container) {
		var canvas = container.getEl().dom;
		this.setCanvas(canvas);

		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		this.setGl(gl);

		this.initShaders(gl, function (shaderProgram) {
			this.setShaderProgram(shaderProgram);
			this.loadModel(gl, 'face.json', function () {
				gl.clearColor(0, 0, 0, 1);
				gl.enable(gl.DEPTH_TEST);

				this.tick();
			});
		});
	},
	tick: function () {
		this.animate();
		this.drawScene();
		requestAnimationFrame(Ext.bind(this.tick, this));
	},
	animate: function () {
		var now = Date.now();
		var lastTime = this.getLastTime();
		if (lastTime != 0) {
			var angle = this.getAngle();
			var elapsed = now - lastTime;
			angle += (2 * Math.PI  * elapsed) / 4000;
			this.setAngle(angle);
		}
		this.setLastTime(now);
	},
	drawScene: function (gl, shaderProgram) {
		if (gl === undefined) {
			gl = this.getGl();
		}
		if (shaderProgram === undefined) {
			shaderProgram = this.getShaderProgram();
		}
		if (shaderProgram === null) {
			return;
		}
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var mvMatrix = this.getMvMatrix();
		var pMatrix = this.getPMatrix();

		mat4.perspective(pMatrix, 45 * Math.PI / 180 , gl.viewportWidth / gl.viewportHeight, 0.1, 100);

		mat4.identity(mvMatrix);

		mat4.translate(mvMatrix, mvMatrix, [0, 0, -30]);

		this.mvPush();
//		mat4.translate(mvMatrix, mvMatrix, [0, 1.5, 0]);
		mat4.rotateY(mvMatrix, mvMatrix, this.getAngle());
		mat4.rotateZ(mvMatrix, mvMatrix, this.getAngle());
		mat4.rotateX(mvMatrix, mvMatrix, this.getAngle());
//		var triangleBuffer = this.getTriangleBuffer();
//		gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
//		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleBuffer.itemSize, gl.FLOAT, false, 0, 0);

//		var triangleColorBuffer = this.getTriangleColorBuffer();
//		gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
//		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
//		this.setMatrixUniforms(gl, shaderProgram);

//		gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItems);

		var models = this.getModels();
		var face = models.face;

		var vertexBuffer = face.vertexBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

//		var normalBuffer = face.normalBuffer;
//		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
//		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		var faceBuffer = face.faceBuffer;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

		this.setMatrixUniforms(gl, shaderProgram);

		gl.drawElements(gl.TRIANGLES, faceBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		this.mvPop();
	},
	setMatrixUniforms: function (gl, shaderProgram) {
		var pMatrix = this.getPMatrix();
		var mvMatrix = this.getMvMatrix();
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	},
	initShaders: function (gl, callback) {
		this.loadShaders(gl, function (vertexShader, fragmentShader) {
			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, vertexShader);
			gl.attachShader(shaderProgram, fragmentShader);
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
				console.error("Could not initialise shaders");
			}

			gl.useProgram(shaderProgram);

			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

//			shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
//			gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

//			shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
//			gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
			callback.call(this, shaderProgram);
		});
	},
	loadModel: function (gl, modelName, callback) {
		var modelPath = Ext.Loader.getPath('MW') + '/scene/model/';
		var url = modelPath + modelName;

		var models = this.getModels();
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				var model = Ext.decode(response.responseText);
				var meshes = model.meshes;
				Ext.each(meshes, function (mesh) {
					var vertexBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
					var vertices = new Float32Array(mesh.vertices);
					gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
					vertexBuffer.itemSize = 3;
					vertexBuffer.numItems = vertices.length / 3;

					var normalBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
					var normals = new Float32Array(mesh.normals);
					gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
					normalBuffer.itemSize = 3;
					normalBuffer.numItems = normals.length / 3;

					var faceArray = [];
					Ext.each(mesh.faces, function (face) {
						Ext.each(face, function (index) {
							faceArray.push(index);
						});
					});
					var faceBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
					var faces = new Uint16Array(faceArray);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
					faceBuffer.itemSize = 3;
					faceBuffer.numItems = faces.length / 3;

					var model = {
						vertexBuffer: vertexBuffer,
						normalBuffer: normalBuffer,
						faceBuffer: faceBuffer
					};

					models[mesh.name] = model;

					callback.call(this, model);
				}, this);
			}
		});
	},
	loadShaders: function (gl, callback) {
		var shaderPath = Ext.Loader.getPath('MW') + '/shader/';

		this.loadVertexShader(gl, shaderPath + 'vertex.c', function (vertexShader) {
			this.loadFragmentShader(gl, shaderPath + 'fragment.c', function (fragmentShader) {
				callback.call(this, vertexShader, fragmentShader);
			});
		});
	},
	loadVertexShader: function (gl, url, callback) {
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				var shader = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(shader, response.responseText);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.error(gl.getShaderInfoLog(shader));
				}
				callback.call(this, shader);
			}
		});
	},
	loadFragmentShader: function (gl, url, callback) {
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				var shader = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(shader, response.responseText);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.error(gl.getShaderInfoLog(shader));
				}
				callback.call(this, shader);
			}
		});
	}
});

