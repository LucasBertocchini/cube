"use strict";

function firstLayer(moves, solveFrom) {
    let cube = moves.cube;
    const mainColor = solveFrom.color.main;
    
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
	})(),
		centerColors = calcCenterColors(cube),
		permutations = permute(fourCorners);

	let movesList = [];

	for (const permutation of permutations) {
		let copy = cube.copy(),
			fullSolution = "";

		for (const corner of permutation) {
			const orderedCorner = orderCorner(copy.pieces, corner),
				solution = solveCorner(copy, orderedCorner, centerColors, mainColor);

			if (solution) {
				if (fullSolution) fullSolution += " ";
				fullSolution += solution;
				copy.turns(solution);
			}
		}
		movesList.push(fullSolution);
	}

	let min = movesList[0].length;
	for (const turns of movesList) {
		const turnList = turns.split(" "),
			length = turnList.length;
		if (length < min) min = length;
	}

	for (const turns of movesList) {
		const turnList = turns.split(" "),
			length = turnList.length;
		if (length === min) {
			moves.turns(turns)
			return;
		}
	}
}




function solveCorner(cube, corner, centerColors, mainColor) {
	const pos = findCorner(cube, corner);
	const shouldBe = cornerShouldBe(corner, centerColors);

	if (pos[0] === 0) { //corner is on U
		return solveCornerOnU(cube, corner, centerColors, mainColor, pos, shouldBe);
	} else if (eqarray(pos, shouldBe)) { //corner is in place, needs orientation
		const i = cube3.centerIndices.D;
		if (corner[0] === cube.pieces[i[0]][i[1]][i[2]])
			return "";
		
		for (const indicesFaces of indicesFacesList) {
			const indices = indicesFaces.indices;

			if (eqarray(shouldBe.slice(1), indices)) {
				const faces = indicesFaces.faces,
					f0 = faces[0],
					f1 = faces[1];

				switch (corner[0]) {
					case centerColors[f0]:
						return `${f0} U' ${f0}' ${f1}' U' ${f1}`;
					case centerColors[f1]:
						return `${f1}' U ${f1} ${f0} U ${f0}'`;
					default:
						throw "corner not the right color: " + corner[0];
				}
			}
		}
	} else { //corner is in D out of place
		let moves = "";

		for (const indicesFaces of indicesFacesList) {
			const indices = indicesFaces.indices;

			if (eqarray(pos.slice(1), indices)) {
				const face = indicesFaces.faces[0];
				moves += `${face} U ${face}'`;
			}
		}

		let copy = cube.copy();
		copy.turns(moves);
		const newPos = findCorner(copy, corner),
			orderedCorner = orderCorner(copy.pieces, corner);

		if (moves) moves += " ";
		moves += solveCornerOnU(copy, orderedCorner, centerColors, mainColor, newPos, shouldBe);
		return moves;
	}
}








function findCorner(cube, corner) {
	const edgeArray = [0, 2];

	for (const i of edgeArray) {
		const plane = cube.pieces[i];
		for (const j of edgeArray) {
			const line = plane[j];
			for (const k of edgeArray) {
				const piece = line[k];

				if (isSamePiece(corner, piece))
					return [i, j, k];
			}
		}
	}

	throw "corner not found";
}

function cornerShouldBe(corner, centerColors) {
	let faceList = [];
	for (const [face, color] of Object.entries(centerColors))
		if (corner.includes(color))
			faceList.push(face);

	let result = [];
	for (const face of faceList) {
		const indices = cube3.centerIndices[face],
			index = faceIndices[face];
		result.push(indices[index]);
	}
	return result;
}

function isSamePiece(piece1, piece2) {
	const colors = piece => piece.split("").sort().join("");
	return (colors(piece1) === colors(piece2));
}

function calcCenterColors(cube) {
	let centerColors = {};
	for (const [face, i] of Object.entries(cube3.centerIndices)) {
		const color = cube.pieces[i[0]][i[1]][i[2]];
		centerColors[face] = color;
	}
	return centerColors;
}

function orderCorner(pieces, corner) {
	const edgeArray = [0, 2];

	for (const i of edgeArray) {
		const plane = pieces[i];
		for (const j of edgeArray) {
			const line = plane[j];
			for (const k of edgeArray) {
				const piece = line[k];

				if (isSamePiece(corner, piece))
					return piece;
			}
		}
	}

	throw "corner not found";
}

function solveCornerOnU(cube, corner, centerColors, mainColor, pos, shouldBe) {
	const dpos = [pos.slice(1), shouldBe.slice(1)],
		stringedPos = JSON.stringify(dpos),
		amount = amounts[stringedPos];

	if (amount === undefined) throw "amount not found";

	let moves = "";

	if (amount) {
		if (amount === 1)
			moves += "U";
		else if (amount === -1)
			moves += "U'";
		else if (amount === 2)
			moves += "U2";
	}

	for (const indicesFaces of indicesFacesList) {
		const indices = indicesFaces.indices;

		if (eqarray(shouldBe.slice(1), indices)) {
			const faces = indicesFaces.faces,
				f0 = faces[0],
				f1 = faces[1];

			if (moves) moves += " ";

			switch(corner[0]) {
				case centerColors[f0]:
					moves += `${f0} U ${f0}'`;
					break;
				case centerColors[f1]:
					moves += `${f1}' U' ${f1}`;
					break;
				case mainColor:
					moves += `${f0} U2 ${f0}' U' ${f0} U ${f0}'`;
					break;
				default:
					throw "corner not the right color: " + corner[0];
			}

			return moves;
		}
	}

	throw "solve corner on U failed";
}