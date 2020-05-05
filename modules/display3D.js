"use strict";

function display3DSetup() {
    const
    cubeContainer = document.querySelector("#cube-container"),
	canvas = document.createElement("canvas"),
	gl = canvas.getContext("webgl");

	canvas.width = cubeContainer.clientWidth;
	canvas.height = cubeContainer.clientHeight;

    cubeContainer.appendChild(canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	const mat4 = glMatrix.mat4
	
	const sensitivity = 2 * Math.PI / Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

	let
	rotation = {
		yaw: -Math.PI / 6,
		pitch: Math.PI / 6
	},
	dragging = false,
	prevPos = {
		x: 0,
		y: 0
	};

	canvas.onmousedown = e => {
		dragging = true;
		prevPos = {
			x: e.clientX,
			y: e.clientY
		};
	}
	canvas.onmouseup = e => {
		dragging = false;
	}
	canvas.onmouseenter = e => {
		dragging = false;
	}

	canvas.onmousemove = e => {
		if (dragging) {
			const
			deltaX = e.clientX - prevPos.x,
			deltaY = e.clientY - prevPos.y;

			rotation.yaw += deltaX * sensitivity;
			rotation.pitch += deltaY * sensitivity;

			rotation.pitch = clamp(rotation.pitch, -0.5*Math.PI, 0.5*Math.PI);

			prevPos = {
				x: e.clientX,
				y: e.clientY
			};
		}
	}

	const s = 1/3;

	const positions = [
		//U
		 s,  1,  s,
		 s,  1,  1,
		 1,  1,  1,
		 1,  1,  s,

		 -s,  1,  s,
		 -s,  1,  1,
		 1,  1,  1,
		 1,  1,  s,

		// Bottom face
		-1, -1, -1,
		 1, -1, -1,
		 1, -1,  1,
		-1, -1,  1,

		// Front face
		 0, -1,  1,
		 1, -1,  1,
		 1,  1,  1,
		 0,  1,  1,

		 0, -1,  1,
		-1, -1,  1,
		-1,  1,  1,
		 0,  1,  1,

		// Back face
		-1, -1, -1,
		-1,  1, -1,
		 1,  1, -1,
		 1, -1, -1,

		// Right face
		 1, -1, -1,
		 1,  1, -1,
		 1,  1,  1,
		 1, -1,  1,

		// Left face
		-1, -1, -1,
		-1, -1,  1,
		-1,  1,  1,
		-1,  1, -1,
	];



	main();
	function main() {
		//https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js

		if (!gl) {
			alert('Unable to initialize WebGL. Your browser or machine may not support it.');
			return;
		}

		const vsSource = `
			attribute vec4 aVertexPosition;
			attribute vec4 aVertexColor;

			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			varying lowp vec4 vColor;
			varying highp vec3 vVertexPosition;

			void main(void) {
			vColor = aVertexColor;
			vVertexPosition = aVertexPosition.xyz;
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			}
		`;

		const fsSource = `
			precision highp float;

			varying lowp vec4 vColor;
			varying highp vec3 vVertexPosition;

			void main(void) {
				vec2 TexCoord;
				TexCoord = vVertexPosition.xz;
				if (vVertexPosition.x == 1. || vVertexPosition.x == -1.) {
					TexCoord = vVertexPosition.yz;
				} else if (vVertexPosition.y == 1. || vVertexPosition.y == -1.) {
					TexCoord = vVertexPosition.xz;
				} else if (vVertexPosition.z == 1. || vVertexPosition.z == -1.) {
					TexCoord = vVertexPosition.xy;
				}

				float x = fract(TexCoord.x * 5.);
				float y = fract(TexCoord.y * 5.);

				if (x < 0.2 || y < 0.2) {
					gl_FragColor = vColor;
				} else {
					gl_FragColor = vec4(1, 1, 1, 1);
				}
			}
		`;

		// Initialize a shader program; this is where all the lighting
		// for the vertices and so forth is established.
		const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

		// Collect all the info needed to use the shader program.
		// Look up which attributes our shader program is using
		// for aVertexPosition, aVevrtexColor and also
		// look up uniform locations.
		const programInfo = {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
				vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			},
		};

		// Here's where we call the routine that builds all the
		// objects we'll be drawing.
		const buffers = initBuffers(gl);

		var then = 0;

		// Draw the scene repeatedly
		function render(now) {
			now *= 0.001;  // convert to seconds
			const deltaTime = now - then;
			then = now;

			drawScene(gl, programInfo, buffers, deltaTime);

			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);
	}

	//
	// initBuffers
	//
	// Initialize the buffers we'll need. For this demo, we just
	// have one object -- a simple three-dimensional cube.
	//
	function initBuffers(gl) {

		// Create a buffer for the cube's vertex positions.

		const positionBuffer = gl.createBuffer();

		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// Now create an array of positions for the cube.



		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.

		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);

		// Now set up the colors for the faces. We'll use solid colors
		// for each face.

		// const faceColors = [
		// 	[0,  1,  0,  1],    // Top face: green
		// 	[0,  1,  0,  1],    // Top face: green
			

		// 	[1,  0,  0,  1],    // Back face: red
		// 	[1,  1,  1,  1],    // Front face: white
		// 	[1,  1,  0.5,  1],
		// 	[0,  0,  1,  1],    // Bottom face: blue
		// 	[1,  1,  0,  1],    // Right face: yellow
		// 	[1,  0,  1,  1],    // Left face: purple
		// ];

		let faceColors = [];
		for (let i = 0; i < positions.length / 12; i++)
			faceColors.push([
				Math.random(),
				Math.random(),
				Math.random(),
				1
			]);

		// Convert the array of colors into a table for all the vertices.

		var colors = [];

		for (var j = 0; j < faceColors.length; ++j) {
		const c = faceColors[j];

		// Repeat each color four times for the four vertices of the face
		colors = colors.concat(c, c, c, c);
		}

		const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(colors),
			gl.STATIC_DRAW
		);

		// Build the element array buffer; this specifies the indices
		// into the vertex arrays for each face's vertices.

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.
		let indices = [];
		for (let i = 0; i < positions.length / 3; i += 4)
			indices.push(i, i + 1, i + 2, i, i + 2, i + 3);

		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(indices),
			gl.STATIC_DRAW
		);

		return {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer
		};
	}

	//
	// Draw the scene.
	//
	function drawScene(gl, programInfo, buffers, deltaTime) {
		gl.clearColor(0, 0, 0, 1);  // Clear to black, fully opaque
		gl.clearDepth(1);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = Math.PI / 4;   // in radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100;
		const projectionMatrix = mat4.create();

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		mat4.perspective(
			projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar
		);

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = mat4.create();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.

		mat4.translate(
			modelViewMatrix,
			modelViewMatrix,
			[0, 0, -6]
		);
		mat4.rotate(
			modelViewMatrix,
			modelViewMatrix,
			rotation.pitch,
			[1, 0, 0]
		);
		mat4.rotate(
			modelViewMatrix,
			modelViewMatrix,
			rotation.yaw,
			[0, 1, 0]
		);

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition
			);
		}

		// Tell WebGL how to pull out the colors from the color buffer
		// into the vertexColor attribute.
		{
			const numComponents = 4;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexColor,
				numComponents,
				type,
				normalize,
				stride,
				offset
			);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexColor
			);
		}

		// Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

		// Tell WebGL to use our program when drawing

		gl.useProgram(programInfo.program);

		// Set the shader uniforms

		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix
		);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix
		);

		{
			const vertexCount = positions.length / 2;
			const type = gl.UNSIGNED_SHORT;
			const offset = 0;
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		}
	}

	//
	// Initialize a shader program, so WebGL knows how to draw our data
	//
	function initShaderProgram(gl, vsSource, fsSource) {
		const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

		// Create the shader program

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		// If creating the shader program failed, alert

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		return shaderProgram;
	}

	function loadShader(gl, type, source) {
		const shader = gl.createShader(type);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}
}





function clamp(value, min, max) {
	if (value < min) return min;
	if (value > max) return max;
	return value;
}





function display3D() {
	
}

