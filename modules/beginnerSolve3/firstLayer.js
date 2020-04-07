"use strict";

const centerIndices = {
	"U": [0, 1, 1],
	"D": [2, 1, 1],
	"F": [1, 2, 1],
	"B": [1, 0, 1],
	"L": [1, 1, 0],
	"R": [1, 1, 2]
};

const faceIndices = {
	"U": 0, "D": 0,
	"F": 1, "B": 1,
	"L": 2, "R": 2
}


function firstLayer(cube, mainColor, moves) {
	//cube.turns("F U2 F'");

	const fourCorners = (() => {
		let result = [];
		cube.pieces.forEach(
			plane => plane.forEach(
				line => line.forEach(
					piece => {
						if (piece.length === 3 && piece.includes(mainColor))
							result.push(piece);
					}
				)
			)
		);
		return result;
	})();
	
	const centerColors = calcCenterColors(cube);

	const permutations = permute(fourCorners);
	for (const permutation of permutations) {
		for (let corner of permutation)
			solveCorner(cube, corner, centerColors);
		break;
		console.log("\n");
	}
}




function solveCorner(cube, corner, centerColors) {
	const pos = findCorner(cube, corner);
	const shouldBe = cornerShouldBe(cube, corner, centerColors);

	const amounts = {
		//same
		"[[0,0],[0,0]]": 0,
		"[[0,2],[0,2]]": 0,
		"[[2,0],[2,0]]": 0,
		"[[2,2],[2,2]]": 0,

		//three in a row
		"[[2,0],[0,0]]": 1,
		"[[0,0],[0,2]]": 1,
		"[[2,2],[2,0]]": 1,
		"[[0,2],[2,2]]": 1,

		//three not in a row
		"[[0,2],[0,0]]": -1,
		"[[2,2],[0,2]]": -1,
		"[[0,0],[2,0]]": -1,
		"[[2,0],[2,2]]": -1,

		//two of each number
		"[[2,2],[0,0]]": 2,
		"[[2,0],[0,2]]": 2,
		"[[0,2],[2,0]]": 2,
		"[[0,0],[2,2]]": 2,
	};


	if (pos[0] === 0) {
		console.log(corner, pos, shouldBe);

		const dpos = [pos.slice(1), shouldBe.slice(1)],
			stringedPos = JSON.stringify(dpos),
			amount = amounts[stringedPos];
		if (amount === undefined) throw "amount not found";

		if (amount) cube.turn("U", amount);
		
		if (eqarray(shouldBe, [2, 0, 0])) {
			if (corner[0] === "o")
				cube.turns("L U L'");
			else if (corner[0] === "g")
				cube.turns("B' U' B");
			else if (corner[0] === "w")
				cube.turns("L U2 L' U' L U L'");
			else throw "corner not the right color"
		}	
	}
}








function findCorner(cube, corner) {
	let edgeArray = [0, 2];
	for (let i of edgeArray) {
		const plane = cube.pieces[i];
		for (let j of edgeArray) {
			const line = plane[j];
			for (let k of edgeArray) {
				const piece = line[k];

				if (isSamePiece(corner, piece))
					return [i, j, k];
			}
		}
	}
	throw "corner not found";
}

function isSamePiece(piece1, piece2) {
	const colors = piece => piece.split("").sort().join("");
	return (colors(piece1) === colors(piece2));
}

function calcCenterColors(cube) {
	let centerColors = {};
	for (const [face, i] of Object.entries(centerIndices)) {
		const color = cube.pieces[i[0]][i[1]][i[2]];
		centerColors[face] = color;
	}
	return centerColors;
}

function cornerShouldBe(cube, corner, centerColors) {
	let faceList = [];
	for (const [face, color] of Object.entries(centerColors))
		if (corner.includes(color))
			faceList.push(face);

	let result = [];
	for (const face of faceList) {
		const indices = centerIndices[face],
			index = faceIndices[face];
		result.push(indices[index]);
	}
	return result;
}
















































