"use strict";

let sArray = [];
for (let i = -cubeSize; i <= cubeSize; i += 2)
	sArray.push(i / cubeSize);

let positions = [];

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


const mat4 = glMatrix.mat4;

Math.HALF_PI = Math.PI / 2;
Math.QUARTER_PI = Math.PI / 4;

let
rotation = {
	yaw: -Math.PI / 6,
	pitch: Math.PI / 6
},
dragging = false,
prevPos = {
	x: 0,
	y: 0
},
menuOpen = false;


function display3DSetup() {
    const
    cubeContainer = document.querySelector("#cube-container"),
	canvas = cubeContainer.querySelector("#main-cube"),
	gl = canvas.getContext("webgl");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const
    miniCubeContainer = cubeContainer.querySelector("#mini-cube-container"),
    canvas2 = miniCubeContainer.querySelector("#mini-cube"),
	gl2 = canvas2.getContext("webgl");

    gl2.viewport(0, 0, gl2.canvas.width, gl2.canvas.height);

    const buttonContainer = document.querySelector("#button-container");

    for (const axis of [
    	["U", "E", "D", "y"],
    	["F", "S", "B", "z"],
    	["R", "M", "L", "x"]
    ]) {
    	const rowcol = document.createElement("div");
    	rowcol.classList.add("rowcol");
    	for (const face of axis) {

	        const turnButton = document.createElement("button");
	        turnButton.innerHTML = face;
	        turnButton.onclick = e => {
	            const turn = {face, amount: e.shiftKey ? 2 : 1};
	            mainCube.turn(turn);
	        }

	        turnButton.oncontextmenu = e => {
	            const turn = {face, amount: e.shiftKey ? 2 : -1};
	            mainCube.turn(turn);
	            return false;
	        }
	        rowcol.appendChild(turnButton);
	    }
        buttonContainer.appendChild(rowcol);
    }

    let sensitivity;




	document.body.onmouseenter = e => {
		if (e.which === 1)
			prevPos = {
				x: e.clientX,
				y: e.clientY
			};
		else
			dragging = false;
	}
	document.body.onmouseup = e => {
		dragging = false;
	}

	canvas.onmousedown = e => {
		dragging = "mainCube";
		prevPos = {
			x: e.clientX,
			y: e.clientY
		};
	}
	canvas2.onmousedown = e => {
		dragging = "miniCube";
		prevPos = {
			x: e.clientX,
			y: e.clientY
		};
	}

	document.body.onmousemove = e => {
		if (!dragging) return;

		const
		deltaX = e.clientX - prevPos.x,
		deltaY = e.clientY - prevPos.y;

		if (dragging === "mainCube") {
			rotation.yaw += deltaX * sensitivity.main;
			rotation.pitch += deltaY * sensitivity.main;
		} else if (dragging === "miniCube") {
			rotation.yaw += deltaX * sensitivity.mini;
			rotation.pitch -= deltaY * sensitivity.mini;
		}

		if (rotation.yaw > Math.QUARTER_PI) {
			mainCube.turns("y'");
			rotation.yaw = -Math.QUARTER_PI;
		} else if (rotation.yaw < -Math.QUARTER_PI) {
			mainCube.turns("y");
			rotation.yaw = Math.QUARTER_PI;
		}

		rotation.pitch = clamp(rotation.pitch, -Math.HALF_PI, Math.HALF_PI);

		prevPos = {
			x: e.clientX,
			y: e.clientY
		};
	}





	document.body.onresize = e => resize(e);

	window.onkeydown = e => {
		const face = e.key.toUpperCase();

		if (faces.all.includes(face))
			if (e.shiftKey)
				mainCube.turns(`${face}2`);
			else if (e.ctrlKey)
				mainCube.turns(`${face}'`);
			else
				mainCube.turns(`${face}`);
	}


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




	const shaderProgram2 = initShaderProgram(gl2, vsSource, fsSource);

	const programInfo2 = {
		program: shaderProgram2,
		attribLocations: {
			vertexPosition: gl2.getAttribLocation(shaderProgram2, 'aVertexPosition'),
			vertexColor: gl2.getAttribLocation(shaderProgram2, 'aVertexColor'),
		},
		uniformLocations: {
			projectionMatrix: gl2.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
			modelViewMatrix: gl2.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
		},
	};

	const buffers2 = initBuffers(gl2);






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

		const colorBuffer2 = gl2.createBuffer();
		gl2.bindBuffer(gl2.ARRAY_BUFFER, colorBuffer2);
		gl2.bufferData(
			gl2.ARRAY_BUFFER,
			new Float32Array(colorsList),
			gl2.STATIC_DRAW
		);

		buffers2.color = colorBuffer2;

		

		drawScene(gl, programInfo, buffers, deltaTime);
		drawScene(gl2, programInfo2, buffers2, deltaTime, true);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

	const
	collapsible = document.querySelector("#collapsible"),
	buttonArea = collapsible.querySelector("#button-area");
	buttonHandler(buttonArea, collapsible);

	resize();
	function resize(e) {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		canvas2.width = canvas2.offsetWidth;
		canvas2.height = canvas2.offsetHeight;

	    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	    gl2.viewport(0, 0, gl2.canvas.width, gl2.canvas.height);

	    sensitivity = {
			main: Math.SQRT2 * Math.PI / Math.sqrt(canvas.width ** 2 + canvas.height ** 2),
			mini: Math.SQRT2 * Math.PI / Math.sqrt(canvas2.width ** 2 + canvas2.height ** 2)
		}

		const
		w = document.body.offsetWidth,
		h = document.body.offsetHeight,
		bottom = w > h ? w < 1.618 * h : w < .618 * h;

		if (!menuOpen) {
			collapsible.style.transitionDuration = "0s";

			if (bottom) {
				collapsible.style.width = "100vw";
				collapsible.style.paddingRight = "2%";
				collapsible.style.paddingLeft = "2%";

				collapsible.style.height = "0";
				collapsible.style.paddingTop = "0";
				collapsible.style.paddingBottom = "0";
			} else {
				collapsible.style.height = "100vh";
				collapsible.style.paddingTop = "2%";
				collapsible.style.paddingBottom = "2%";

				collapsible.style.width = "0";
				collapsible.style.paddingRight = "0";
				collapsible.style.paddingLeft = "0";
			}

			//delay the transition so it doesn't happen
			setTimeout(() => collapsible.style.transitionDuration = ".5s", 1);
		} else {
			if (bottom) {
				collapsible.style.width = "100vw";
				collapsible.style.paddingRight = "2%";
				collapsible.style.paddingLeft = "2%";

				collapsible.style.height = "61.8vh";
				collapsible.style.paddingTop = "7%";
				collapsible.style.paddingBottom = "7%";
			} else {
				collapsible.style.height = "100vh";
				collapsible.style.paddingTop = "2%";
				collapsible.style.paddingBottom = "2%";

				collapsible.style.width = "61.8vw";
				collapsible.style.paddingRight = "7%";
				collapsible.style.paddingLeft = "7%";
			}
		}
	}
}

function buttonHandler(buttonArea, collapsible) {
	function addToRowcol(...elements) {
		const rowcol = document.createElement("div");
    	rowcol.classList.add("button-area");

    	for (const element of elements)
    		rowcol.appendChild(element);

    	buttonArea.appendChild(rowcol);
	}

    let randomizeCubeButtons = [];
    for (const i of [3, 5, 100]) {
        const randomizeCubeButton = document.createElement("button");
        randomizeCubeButton.innerHTML = "scramble " + i;
        randomizeCubeButton.onclick = e => {
            mainCube.scramble(i, true);
        }
        randomizeCubeButtons.push(randomizeCubeButton);
    }
    addToRowcol(...randomizeCubeButtons);

    let bruteForceSolveButtons = [];
    for (let i = 1; i <= 3; i++) {
        const bruteForceSolveButton = document.createElement("button");
        bruteForceSolveButton.innerHTML = "brute force " + i;
        bruteForceSolveButton.onclick = e => {
            const solve = mainCube.bruteForce(i);
            if (!solve) {
            	display("brute force failed");
            	display("");
            	return;
            }
            const bruteForce = Turns.turnToTurns(...solve);
            display("brute force: ");
            display(bruteForce);
            display("");
        }
        bruteForceSolveButtons.push(bruteForceSolveButton);
    }
    addToRowcol(...bruteForceSolveButtons);
    
    const beginnerSolve3Button = document.createElement("button");
    beginnerSolve3Button.innerHTML = "beginner solve";
    beginnerSolve3Button.onclick = e => {
    	const solve = mainCube.beginnerSolve3();
    	display("beginner solve:");
    	display(solve.string);
    	display("");
    }
    
    const resetButton = document.createElement("button");
    resetButton.innerHTML = "reset";
    resetButton.onclick = e => {
        mainCube.reset();
        clearDisplay();
    }
    addToRowcol(beginnerSolve3Button, resetButton);

    const enterAlgorithmButton = document.createElement("button");
    enterAlgorithmButton.innerHTML = "enter algorithm";
    enterAlgorithmButton.onclick = e => {
        clearDisplay();
        display("algorithm (press enter): ");
    	const textarea = document.querySelector("textarea");
    	textarea.focus();
    	textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
    addToRowcol(beginnerSolve3Button, enterAlgorithmButton);

    const textarea = document.createElement("textarea");
    collapsible.appendChild(textarea);


    const
    chevrons = document.querySelectorAll(".chevron"),
    bottomOrRightChevron = document.querySelector("#bottom-or-right-chevron"),
    collapsibleChevron = document.querySelector("#collapsible-chevron");

	for (const chevron of chevrons)
		chevron.onclick = toggleMenu;

	function toggleMenu() {
		const
		w = document.body.offsetWidth,
		h = document.body.offsetHeight,
		bottom = w > h ? w < 1.618 * h : w < .618 * h;

		if (menuOpen) {
			for (const chevron of chevrons)
				chevron.style.setProperty("--angle", "15deg");

			bottomOrRightChevron.style.display = "block";

			if (bottom) {
				collapsible.style.height = "0";
				collapsible.style.paddingTop = "0";
				collapsible.style.paddingBottom = "0";
			} else {
				collapsible.style.width = "0";
				collapsible.style.paddingRight = "0";
				collapsible.style.paddingLeft = "0";
			}

			menuOpen = false;
		} else {
			for (const chevron of chevrons)
				chevron.style.setProperty("--angle", "-15deg");

			bottomOrRightChevron.style.display = "none";

			if (bottom) {
				collapsible.style.height = "61.8vh";
				collapsible.style.paddingTop = "7%";
				collapsible.style.paddingBottom = "7%";
			} else {
				collapsible.style.width = "61.8vw";
				collapsible.style.paddingRight = "7%";
				collapsible.style.paddingLeft = "7%";
			}

			menuOpen = true;
		}
	}
}

function initBuffers(gl) {
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(positions),
		gl.STATIC_DRAW
	);

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

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
		indices: indexBuffer
	};
}

function drawScene(gl, programInfo, buffers, deltaTime, inverted = false) {
	gl.clearColor(0, 0, 0, 0);
	gl.clearDepth(1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);


	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const fieldOfView = Math.QUARTER_PI;
	const aspect = 1;
	const zNear = 0.1;
	const zFar = 100;
	const projectionMatrix = mat4.create();

	mat4.perspective(
		projectionMatrix,
		fieldOfView,
		aspect,
		zNear,
		zFar
	);

	const modelViewMatrix = mat4.create();

	mat4.translate(
		modelViewMatrix,
		modelViewMatrix,
		[0, 0, -4.6]
	);
	mat4.rotate(
		modelViewMatrix,
		modelViewMatrix,
		(inverted ? -1 : 1) * rotation.pitch,
		[1, 0, 0]
	);
	mat4.rotate(
		modelViewMatrix,
		modelViewMatrix,
		(inverted ? Math.PI : 0) + rotation.yaw,
		[0, 1, 0]
	);

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

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

	gl.useProgram(programInfo.program);

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

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

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





function clamp(value, min, max) {
	if (value < min) return min;
	if (value > max) return max;
	return value;
}