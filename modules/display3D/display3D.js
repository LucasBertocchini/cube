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



    const
    canvas2 = document.createElement("canvas"),
	gl2 = canvas2.getContext("webgl");

	canvas2.width = cubeContainer.clientWidth;
	canvas2.height = cubeContainer.clientHeight;

    cubeContainer.appendChild(canvas2);





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

	let sArray = [];
	for (let i = -cubeSize; i <= cubeSize; i += 2)
		sArray.push(i / cubeSize);

	let positions = []

	for (const side of sides.all) {
		const sign = cube2.layers[side] ? -1 : 1;
		const index = [1, 2, 0][cube2.index[side]];

		for (let i = 0; i < cubeSize; i++) {
			const
			i0 = sArray[i],
			i1 = sArray[i + 1];
			for (let j = 0; j < cubeSize; j++) {
				const
				j0 = sArray[j],
				j1 = sArray[j + 1];

				const jiArray = ["U", "F", "R"].includes(side) ?
					[
						[j0, i0],
						[j0, i1],
						[j1, i1],
						[j1, i0]
					] : [
						[j0, i1],
						[j1, i1],
						[j1, i0],
						[j0, i0]
					];

				jiArray.forEach(array => array.splice(index, 0, sign));
				const columnated = jiArray.flat();
				
				positions.push(...columnated);
			}
		}
	}

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

		const halfSizePlusOffset = cubeSize % 2 === 1 ?
			`${cubeSize / 2} + .5` :
			`${cubeSize / 2}.`;

		const fsSource = `
			precision highp float;

			varying lowp vec4 vColor;
			varying highp vec3 vVertexPosition;

			bool AbsNearUnity(float x) {
				const float tolerance = 1.e-4;

				if (
					x == 1. || x == -1. ||
					(1. - tolerance < x && x < 1. + tolerance) ||
					(-1. - tolerance < x && x < -1. + tolerance)
				)
					return true;

				return false;
			}

			void main(void) {
				const float width = 0.45;
				const float halfWidth = 0.5*width;
				const float power = 6.;

				vec2 TexCoord;
				if (AbsNearUnity(vVertexPosition.x))
					TexCoord = vVertexPosition.yz;
				else if (AbsNearUnity(vVertexPosition.y))
					TexCoord = vVertexPosition.xz;
				else if (AbsNearUnity(vVertexPosition.z))
					TexCoord = vVertexPosition.xy;

				float x = fract(TexCoord.x * ${halfSizePlusOffset}) - .5;
				float y = fract(TexCoord.y * ${halfSizePlusOffset}) - .5;
				bool CaseX = !(TexCoord.x < halfWidth - 1.) && !(TexCoord.x > -halfWidth + 1.);
				bool CaseY = !(TexCoord.y < halfWidth - 1.) && !(TexCoord.y > -halfWidth + 1.);

				if (pow(x, power) + pow(y, power) > pow(width, power))
					gl_FragColor = vec4(0, 0, 0, 1);
				else
					gl_FragColor = vColor;
			}
		`;

		const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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

		const buffers = initBuffers(gl);

		var then = 0;
	

		function render(now) {
			now *= 0.001;
			const deltaTime = now - then;
			then = now;

			let faceColors = {
				U: [],
				D: [],
				B: [],
				F: [],
				L: [],
				R: []
			};

			for (let i = 0; i < cubeSize; i++) {
				const plane = mainCube.pieces[i];
				for (let j = 0; j < cubeSize; j++) {
					const line = plane[j];
					for (let k = 0; k < cubeSize; k++) {
						const
						indices = [i, j, k],
						piece = line[k],
						sideList = sides.indices(indices);

						for (const side of sideList) {
							const
							color = sides.findColor(indices, piece, side),
							RGB = colors.RGB[color];

							faceColors[side].push([...RGB, 1]);
						}
					}
				}
			}

			function transpose(flatArray) {
				const s = cubeSize;
				let result = [];

				for(var i = 0; i < s; i++)
					for(var j = 0; j < s; j++)
						result.push(flatArray[j*s + i]);

				return result;
			}

			function reverseRows(flatArray) {
				const s = cubeSize;
				let result = [];

				for(let i = 0; i < s; i++)
					for(let j = s - 1; j >= 0; j--)
						result.push(flatArray[i*s + j]);

				return result;
			}

			function reverseRowsColumns(flatArray) {
				const s = cubeSize;
				let result = [];

				for(let i = s - 1; i >= 0; i--)
					for(let j = s - 1; j >= 0; j--)
						result.push(flatArray[i*s + j]);

				return result;
			}

			const transformFB = flatArray => reverseRows(reverseRowsColumns(flatArray));
			const transformRL = flatArray => reverseRows(transpose(flatArray));

			const faceColorsList = [
				...faceColors.U,
				...faceColors.D,
				...transformFB(faceColors.F),
				...transformFB(faceColors.B),
				...transformRL(faceColors.R),
				...transformRL(faceColors.L),
			];

			var colorsList = [];

			for (var j = 0; j < faceColorsList.length; ++j) {
				const c = faceColorsList[j];

				colorsList = colorsList.concat(c, c, c, c);
			}

			const colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(colorsList),
				gl.STATIC_DRAW
			);

			buffers.color = colorBuffer;

			

			drawScene(gl, programInfo, buffers, deltaTime);

			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);






	    function addBreak() {
	        const br = document.createElement("br");
	        document.body.appendChild(br);
	    }

		const scrambleAndSolveButton = document.createElement("button");
	    scrambleAndSolveButton.innerHTML = "scramble and solve";
	    scrambleAndSolveButton.onclick = e => {
	        console.log("\n");

	        mainCube.scramble();
	        mainCube.beginnerSolve3();
	    }
	    document.body.appendChild(scrambleAndSolveButton);

	    addBreak();
	    
	    for (const face of faces.all.concat(["y", "z", "x"])) {
	        const turnButton = document.createElement("button");
	        turnButton.innerHTML = face;
	        turnButton.onclick = e => {
	            const turn = {face, amount: 1};
	            console.log(turn);
	            mainCube.turn(turn);
	        }
	        turnButton.oncontextmenu = e => {
	            const turn = {face, amount: -1};
	            console.log(turn);
	            mainCube.turn(turn);
	            return false;
	        }
	        document.body.appendChild(turnButton);
	    }
	    
	    addBreak();
	    
	    for (const i of [3, 4, 5, 10, 100]) {
	        const randomizeCubeButton = document.createElement("button");
	        randomizeCubeButton.innerHTML = "scramble " + i;
	        randomizeCubeButton.onclick = e => {
	            mainCube.scramble(i, true);
	        }
	        document.body.appendChild(randomizeCubeButton);
	    }
	    
	    addBreak();
	    
	    for (let i = 1; i <= 4; i++) {
	        const bruteForceSolveButton = document.createElement("button");
	        bruteForceSolveButton.innerHTML = "brute force " + i;
	        bruteForceSolveButton.onclick = e => {
	            const solve = mainCube.bruteForce(i);
	            console.log(solve);
	        }
	        document.body.appendChild(bruteForceSolveButton);
	    }
	    
	    addBreak();
	    
	    const beginnerSolve3Button = document.createElement("button");
	    beginnerSolve3Button.innerHTML = "beginner solve 3";
	    beginnerSolve3Button.onclick = e => mainCube.beginnerSolve3();
	    document.body.appendChild(beginnerSolve3Button);

	    const copyPiecesButton = document.createElement("button");
	    copyPiecesButton.innerHTML = "copy pieces";
	    copyPiecesButton.onclick = e => {
	        const text = JSON.stringify(mainCube.pieces);
	        console.log(text);
	    }
	    document.body.appendChild(copyPiecesButton);
	    
	    addBreak();
	    
	    const resetButton = document.createElement("button");
	    resetButton.innerHTML = "reset";
	    resetButton.onclick = e => {
	        mainCube.reset();
	    }
	    document.body.appendChild(resetButton);
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
		gl.clearColor(1, 1, 1, 1);  // Clear to black, fully opaque
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

