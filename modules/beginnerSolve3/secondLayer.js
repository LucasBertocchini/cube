"use strict";

// this file mimics the structure of firstLayer.js

function secondLayer(moves, solveFrom) {
    let cube = moves.cube;
    const mainColor = solveFrom.color.main;
    
	const fourEdges = (() => {
		let result = [];
		cube.pieces.forEach(
			plane => plane.forEach(
				line => line.forEach(
					piece => {
						if (piece.length === 2 && !piece.includes(mainColor)) {
							const i = cube3.centerIndices.U,
								Ucolor = cube.pieces[i[0]][i[1]][i[2]];
							if (!piece.includes(Ucolor))
								result.push(piece);
						}
					}
				)
			)
		);
		return result;
	})(),
		centerColors = calcCenterColors(cube),
		permutations = permute(fourEdges);

	let movesList = [];

	for (const permutation of permutations) {
		let copy = cube.copy(),
			fullSolution = "";

		for (const edge of permutation) {
			const orderedEdge = orderEdge(copy.pieces, edge),
				solution = solveEdge(copy, orderedEdge, centerColors, mainColor);

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
			moves.turns(turns);
			return;
		}
	}
}







function orderEdge(pieces, edge) {
	for (const plane of pieces) {
		for (const line of plane) {
			for (const piece of line) {
				if (isSamePiece(edge, piece))
					return piece;
			}
		}
	}

	throw "corner not found";
}

function solveEdge(cube, edge, centerColors, mainColor) {
	const pos = findEdge(cube.pieces, edge);
	const shouldBe = edgeShouldBe(edge, centerColors);

	if (pos[0] === 0) { //edge is on U
		return solveEdgeOnU(cube, edge, centerColors, pos, shouldBe);
	} else if (pos[0] === 1) //edge is on E
		if (eqarray(pos, shouldBe)) { //edge is in place, needs orientation
			let sideList = [];
			for (const [side, indices] of Object.entries(cube3.centerIndices))
				if (sharesValues(indices, shouldBe, 2))
					sideList.push(side);

			const firstSide = sideList.reduce(
					(f0, f1) =>	(faceIndices[f0] <= faceIndices[f1]) ? f0 : f1,
					"L"
				),
				firstSideColor = centerColors[firstSide];

			if (edge[0] === firstSideColor) 
				return "";
			else {
				const s0 = sideList[0],
					s1 = sideList[1],
					c0 = clockwiseSides[s0],
					c1 = clockwiseSides[s1],
					firstSortedSide = (c0 < c1 && Math.max(c0, c1) - Math.min(c0, c1) === 1) ? s0 : s1,
					sortedSideList = [
						firstSortedSide,
						sideList.filter(side => side !== firstSortedSide)[0]
					],
					f0 = sortedSideList[0],
					f1 = sortedSideList[1];

				return `${f0} U2 ${f0}' U ${f0} U2 ${f0}' U ${f1}' U' ${f1}`;
			}
		}
		else { //edge is on E out of place
			let moveList;

			for (const indicesFaces of indicesFacesList) {
				const indices = indicesFaces.indices;

				if (eqarray(pos.slice(1), indices)) {
					const faces = indicesFaces.faces,
						f0 = faces[0],
						f1 = faces[1];

					moveList = `${f0} U' ${f0}' U' ${f1}' U ${f1}`;
				}
			}

			let copy = cube.copy();
			copy.turns(moveList);

			const newPos = findEdge(copy.pieces, edge),
				orderedEdge = orderEdge(copy.pieces, edge),
				solution = solveEdgeOnU(copy, orderedEdge, centerColors, newPos, shouldBe);

			return moveList + " " + solution;
		}
	else throw "edge in wrong position";

	return "";
}

function findEdge1(pieces, edge) {
	const edgeArray = [0, 1, 2];

	for (const i of edgeArray) {
		const plane = pieces[i];
		for (const j of edgeArray) {
			const line = plane[j];
			for (const k of edgeArray) {
				const piece = line[k];

				if (isSamePiece(edge, piece))
					return [i, j, k];
			}
		}
	}

	throw "edge not found";
}

function orderEdge(pieces, edge) {
	const edgeArray = [0, 1, 2];

	for (const i of edgeArray) {
		const plane = pieces[i];
		for (const j of edgeArray) {
			const line = plane[j];
			for (const k of edgeArray) {
				const piece = line[k];

				if (isSamePiece(edge, piece))
					return piece;
			}
		}
	}

	throw "edge not found";
}

function edgeShouldBe(edge, centerColors) {
	let faceList = [];
	for (const [face, color] of Object.entries(centerColors))
		if (edge.includes(color))
			faceList.push(face);

	let result = [1]; // 1 is the first index and the index of E
	for (const face of faceList) {
		const indices = cube3.centerIndices[face],
			index = faceIndices[face];
		result.push(indices[index]);
	}
	return result;
}

function calcCenterColors(cube) {
	let centerColors = {};
	for (const [face, i] of Object.entries(cube3.centerIndices)) {
		const color = cube.pieces[i[0]][i[1]][i[2]];
		centerColors[face] = color;
	}
	return centerColors;
}

function solveEdgeOnU(cube, edge, centerColors, pos, shouldBe) {
	const s0 = (() => {
			for (const side of ["B", "F", "L", "R"])
				if (edge[0] === centerColors[side])
					return side;
		})(),
		s1 = (() => {
			for (const side of ["B", "F", "L", "R"])
				if (edge[1] === centerColors[side])
					return side;
		})(),
		c0 = clockwiseSides[s0],
		c1 = clockwiseSides[s1],
		reducedCenterIndices = cube3.centerIndices[s0].slice(1),
		reducedEdgeIndices = pos.slice(1);

	if (eqarray(reducedEdgeIndices, reducedCenterIndices)) {
		//edge is on U in position to be hammered
		if (c0 - 1 === c1 || (c0 === 0 && c1 === 3))
			return `${s0}' U2 ${s0} U2 ${s1} U ${s1}'`;
		else
			return `${s0} U2 ${s0}' U2 ${s1}' U' ${s1}`;
	} else { //edge is on U not in position to be hammered
		let firstTurn;

		for (const amount of turnAmounts) {
			const turned = Cube.turn(cube.pieces, {face: "U", amount}),
				newPos = findEdge(turned, edge);

			if (eqarray(newPos.slice(1), reducedCenterIndices)) {
				if (amount === 1) firstTurn = "U";
				else if (amount === -1) firstTurn = "U'";
				else if (amount === 2) firstTurn = "U2";
				break;
			}
		}

		if (c0 - 1 === c1 || (c0 === 0 && c1 === 3))
			return `${firstTurn} ${s0}' U2 ${s0} U2 ${s1} U ${s1}'`;
		else
			return `${firstTurn} ${s0} U2 ${s0}' U2 ${s1}' U' ${s1}`;
	}
}