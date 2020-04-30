"use strict";

// this file mimics the structure of firstLayer.js

function secondLayer(turns, mainFace, mainColor) {
    const cube = turns.cube,
	fourEdges = (() => {
		let result = [];
		cube.pieces.forEach(
			plane => plane.forEach(
				line => line.forEach(
					piece => {
						if (
							piece.length === 2 &&
							!piece.includes(mainColor) &&
							!piece.includes(colors.opposite[mainColor])
						)
							result.push(piece);
					}
				)
			)
		);
		return result;
	})(),
	centerColors = calcCenterColors(cube),
	permutations = permute(fourEdges);

	let turnLists = [];

	for (const permutation of permutations) {
		const
		copy = cube.copy(),
		fullSolution = new Turns(copy);

		for (const edge of permutation) {
			const
			orderedEdge = orderEdge(copy.pieces, edge),
			solution = solveEdge(copy, orderedEdge, centerColors, mainFace, mainColor);

			fullSolution.turns(solution);
		}

		turnLists.push(fullSolution.list);
	}

	const shortestTurnList = turnLists.reduce(
        (a, b) => (a.length - b.length > 0) ? b : a
    );
    if (shortestTurnList.length)
    	turns.turn(...shortestTurnList);
}

function calcCenterColors(cube) {
	let centerColors = {};
	for (const [face, indices] of Object.entries(cube3.centerIndices)) {
		const color = cube.indices(indices);
		centerColors[face] = color;
	}
	return centerColors;
}
function orderEdge(pieces, edge) {
	for (const plane of pieces) {
		for (const line of plane) {
			for (const piece of line) {
				if (colors.isSamePiece(edge, piece))
					return piece;
			}
		}
	}

	throw "corner not found";
}

function solveEdge(cube, edge, centerColors, mainFace, mainColor) {
	const
	pos = cube.findEdge(edge),
	shouldBe = edgeShouldBe(edge, mainFace, centerColors),
	index = cube2.index[mainFace],
	layer = cube3.layers[mainFace];

	if (pos[index] === layer) { //edge is on ${mainFace}
		return solveEdgeOnMainFace(cube, edge, centerColors, pos, shouldBe, mainFace);
	} else if (pos[index] === 1) //edge is on E
		if (eqarray(pos, shouldBe)) { //edge is in place, needs orientation
			let sideList = [];
			for (const [side, indices] of Object.entries(cube3.centerIndices))
				if (sharesElements(indices, shouldBe, 2))
					sideList.push(side);

			const
			arbitrarySide = sideList[0],
			arbitrarySideColor = centerColors[arbitrarySide],
			edgeColorOnArbitrarySide = sides.findColor(cube.findEdge(edge), edge, arbitrarySide);

			if (edgeColorOnArbitrarySide === arbitrarySideColor) 
				return "";
			else {
				const
				s0 = sideList[0],
				s1 = sideList[1],
				firstSortedSide = (sides.clockwise[mainFace][s0] === s1) ? s0 : s1,
				sortedSideList = [
					firstSortedSide,
					sideList.filter(side => side !== firstSortedSide)
				],
				f0 = sortedSideList[0],
				f1 = sortedSideList[1],
				mf = mainFace;

				return `${f0} ${mf}2 ${f0}' ${mf} ${f0} ${mf}2 ${f0}' ${mf} ${f1}' ${mf}' ${f1}`;
			}
		}
		else { //edge is on E out of place
			const indicesFacesList = calcIndicesFacesList(mainFace);

			pos.splice(index, 1);

			let moveList;

			for (const indicesFaces of indicesFacesList) {
				const indices = indicesFaces.indices;

				if (eqarray(pos, indices)) {
					const
					faceList = indicesFaces.faces,
					conjugate = sides.conjugate.includes(mainFace),
					f0 = faceList[conjugate ? 1 : 0],
					f1 = faceList[conjugate ? 0 : 1],
					mf = mainFace;

					moveList = `${f0} ${mf}' ${f0}' ${mf}' ${f1}' ${mf} ${f1}`;
				}
			}

			let copy = cube.copy();
			copy.turns(moveList);

			const
			newPos = copy.findEdge(edge),
			orderedEdge = orderEdge(copy.pieces, edge),
			solution = solveEdgeOnMainFace(copy, orderedEdge, centerColors, newPos, shouldBe, mainFace);

			return `${moveList} ${solution}`;
		}
	else throw "edge in wrong position";
}

function edgeShouldBe(edge, mainFace, centerColors) {
	let faceList = [];
	for (const [face, color] of Object.entries(centerColors))
		if (edge.includes(color))
			faceList.push(face);

	let result = [];
	for (const face of faceList) {
		const
		indices = cube3.centerIndices[face],
		index = cube3.index[face];
		result[index] = indices[index];
	}

	result[cube2.index[mainFace]] = 1;
	return result;
}

function solveEdgeOnMainFace(cube, edge, centerColors, pos, shouldBe, mainFace) {
	const
	index = cube2.index[mainFace],
	color0 = sides.findColor(cube.findEdge(edge), edge, mainFace),
	color1 = edge[edge[1] === color0 ? 0 : 1], //other color on edge
	findSide = color => {
		for (const side of cube2.orthogonal(mainFace))
			if (color === centerColors[side])
				return side;
	},
	s0 = findSide(color0),
	s1 = findSide(color1),
	mf = mainFace;

	let
	reducedCenterIndices = [...cube3.centerIndices[s0]],
	reducedEdgeIndices = [...pos];

	reducedCenterIndices.splice(index, 1);
	reducedEdgeIndices.splice(index, 1);

	const turns = new Turns();

	if (!eqarray(reducedEdgeIndices, reducedCenterIndices))
		for (const amount of faces.amounts) {
			const turned = cube.copy();
			turned.turn({face: mainFace, amount});

			let newPos = turned.findEdge(edge);
			newPos.splice(index, 1);

			if (eqarray(newPos, reducedCenterIndices)) {
				turns.turn({face: mainFace, amount});
				break;
			}
		}

	if (sides.counterclockwise[mainFace][s0] === s1)
		turns.turns(`${s0}' ${mf}2 ${s0} ${mf}2 ${s1} ${mf} ${s1}'`);
	else
		turns.turns(`${s0} ${mf}2 ${s0}' ${mf}2 ${s1}' ${mf}' ${s1}`);

	return turns.string;
}