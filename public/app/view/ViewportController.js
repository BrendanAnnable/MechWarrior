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
		triangleBuffer: null,
		triangleColorBuffer: null,
		mvMatrix: null,
		pMatrix: null,
		angle: 0,
		lastTime: 0
	},
	init: function () {
		this.setPMatrix(new Float32Array(16));
		this.setMvMatrix(new Float32Array(16));
	},
	onResize: function (container, width, height) {
		var canvas = this.getCanvas();
		var gl = this.getGl();
		canvas.width = width;
		canvas.height = height;
		gl.viewportWidth = width;
		gl.viewportHeight = height;
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
			this.initBuffers(gl);

			gl.clearColor(0, 0, 0, 1);
			gl.enable(gl.DEPTH_TEST);

			this.tick();
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
			angle += (Math.PI / 2 * elapsed) / 1000;
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

		mat4.translate(mvMatrix, mvMatrix, [0, 0, -8]);
		mat4.rotateY(mvMatrix, mvMatrix, this.getAngle());
		var triangleBuffer = this.getTriangleBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleBuffer.itemSize, gl.FLOAT, false, 0, 0);

		var triangleColorBuffer = this.getTriangleColorBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		this.setMatrixUniforms(gl, shaderProgram);

		gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItems);
	},
	setMatrixUniforms: function (gl, shaderProgram) {
		var pMatrix = this.getPMatrix();
		var mvMatrix = this.getMvMatrix();
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	},
	initBuffers: function (gl) {
		var triangleBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
		var vertices = [
			0,   1,   0,
			-1, -1,   0,
			1,  -1,   0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		triangleBuffer.itemSize = 3;
		triangleBuffer.numItems = 3;

		this.setTriangleBuffer(triangleBuffer);

		var triangleColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
		var colors = [
			1, 0, 0, 1,
			0, 1, 0, 1,
			0, 0, 1, 1
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		triangleColorBuffer.itemSize = 4;
		triangleColorBuffer.numItems = 3;

		this.setTriangleColorBuffer(triangleColorBuffer);
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

			shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
			gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
			callback.call(this, shaderProgram);
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
		var shader = null;
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				shader = gl.createShader(gl.VERTEX_SHADER);
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
		var shader = null;
		Ext.Ajax.request({
			url: url,
			scope: this,
			success: function (response) {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
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

