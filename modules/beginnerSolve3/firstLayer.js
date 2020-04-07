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
	cube.turns("F U2 F'");

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
		console.log("\n");
	}
}




function solveCorner(cube, corner, centerColors) {
	const pos = findCorner(cube, corner);
	const shouldBe = cornerShouldBe(cube, corner, centerColors);


	console.log(corner, pos, shouldBe);
	if (pos[0] === 0) {
		if (eqarray(pos.slice(1), shouldBe.slice(1))) {
			if (isSamePiece(corner, "ogw")) {
				if (corner[0] === "o") {
					cube.turns("L U L'");
				} else if (corner[0] === "g") {
					cube.turns("B' U' B");
				}
			}
		}
		for (const amount of turnAmounts) {
			const newCube = cube.copy();
			newCube.turn("U", amount);
			const newPos = findCorner(newCube, corner);

			if (eqarray(newPos.slice(1), shouldBe.slice(1))) {
				if (isSamePiece(corner, "ogw")) {
					console.log(corner)
					if (corner[0] === "o") {
						cube.turn("U", amount);
						cube.turns("L U L'");
						break;
					} else if (corner[0] === "g") {
						cube.turn("U", amount);
						cube.turns("B' U' B");
						break;
					}
				}
			}
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
















































