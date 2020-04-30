"use strict";

function firstLayer(turns, mainFace, mainColor) {
    const
    cube = turns.cube,
	fourCorners = (() => {
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

	let turnLists = [];

	for (const permutation of permutations) {
		const
		copy = cube.copy(),
		turns = new Turns(copy);

		for (const corner of permutation) {
			const
			orderedCorner = orderCorner(copy.pieces, corner),
			solution = solveCorner(copy, orderedCorner, centerColors, mainFace, mainColor);

			turns.turns(solution);
		}

		turnLists.push(turns.list);
	}

	const shortestTurnList = turnLists.reduce(
        (a, b) => (a.length - b.length > 0) ? b : a
    );
    if (shortestTurnList.length)
    	turns.turn(...shortestTurnList);
}




function solveCorner(cube, corner, centerColors, mainFace, mainColor) {
	const
	pos = cube.findCorner(corner),
	shouldBe = cornerShouldBe(corner, centerColors),
	index = cube2.index[mainFace],
	layer = cube3.layers[mainFace],
	color = sides.findColor(pos, corner, mainFace),
	indicesFacesList = calcIndicesFacesList(mainFace);



	if (pos[index] === layer)
		//corner is on mainFace
		return solveCornerOnmainFace(cube, corner, centerColors, mainFace, mainColor, pos, shouldBe, indicesFacesList);
	else if (eqarray(pos, shouldBe)) {
		//corner is in place, needs orientation
		const i = cube3.centerIndices[sides.opposite[mainFace]];
		if (color === cube.indices(i))
			return "";
		
		for (const indicesFaces of indicesFacesList) {
			const indices = indicesFaces.indices;


			let shouldBePrime = [...shouldBe];
			shouldBePrime.splice(index, 1);

			if (eqarray(shouldBePrime, indices)) {
				const
				faceList = indicesFaces.faces,
				conjugate = sides.conjugate.includes(mainFace),
				f0 = faceList[conjugate ? 1 : 0],
				f1 = faceList[conjugate ? 0 : 1],
				mf = mainFace;

				switch (color) {
					case centerColors[f0]:
						return `${f0} ${mf}' ${f0}' ${f1}' ${mf}' ${f1}`;
					case centerColors[f1]:
						return `${f1}' ${mf} ${f1} ${f0} ${mf} ${f0}'`;
					default:
						throw "corner not the right color: " + color;
				}
			}
		}
	} else {
		//corner is on opposite face out of place
		let turns = "";

		for (const indicesFaces of indicesFacesList) {
			const indices = indicesFaces.indices;

			let reducedPos = [...pos];
			reducedPos.splice(index, 1);

			if (eqarray(reducedPos, indices)) {
				const
				conjugate = sides.conjugate.includes(mainFace),
				face = conjugate ? indicesFaces.faces[1] : indicesFaces.faces[0];
				turns += `${face} ${mainFace} ${face}'`;
			}
		}

		let copy = cube.copy();
		copy.turns(turns);
		const newPos = copy.findCorner(corner),
			orderedCorner = orderCorner(copy.pieces, corner);

		if (turns) turns += " ";
		turns += solveCornerOnmainFace(copy, orderedCorner, centerColors, mainFace, mainColor, newPos, shouldBe, indicesFacesList);
		return turns;
	}
}



function cornerShouldBe(corner, centerColors) {
	let faceList = [];
	for (const [face, color] of Object.entries(centerColors))
		if (corner.includes(color))
			faceList.push(face);

	let result = [];
	for (const face of faceList) {
		const indices = cube3.centerIndices[face],
			index = cube2.index[face];
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

function orderCorner(pieces, corner) {
	for (const i of cube3.cornerArray) {
		const plane = pieces[i];
		for (const j of cube3.cornerArray) {
			const line = plane[j];
			for (const k of cube3.cornerArray) {
				const piece = line[k];

				if (colors.isSamePiece(corner, piece))
					return piece;
			}
		}
	}

	throw "corner not found";
}

function solveCornerOnmainFace(cube, corner, centerColors, mainFace, mainColor, pos, shouldBe, indicesFacesList) {
	const
	index = cube2.index[mainFace],
	color = sides.findColor(pos, corner, mainFace),
	posPrime = [...pos],
	shouldBePrime = [...shouldBe];

	posPrime.splice(index, 1);
	shouldBePrime.splice(index, 1);

	const
	amount = ((pos, shouldBe) => {
		if (eqarray(pos, shouldBe))
			return 0;

		if (pos.concat(shouldBe).reduce(
			(acc, val) => val ? ++acc : acc , 0
		) === 2)
			return 2;

		switch (pos[1] === shouldBe[0]) {
			case sides.conjugate.includes(mainFace):
				return -1;
			default:
				return 1;
		}
	})(posPrime, shouldBePrime),
	turns = new Turns();
	
	if (amount) turns.turn({face: mainFace, amount});

	for (const indicesFaces of indicesFacesList) {
		const indices = indicesFaces.indices;

		if (eqarray(shouldBePrime, indices)) {
			const
			faceList = indicesFaces.faces,
			conjugate = sides.conjugate.includes(mainFace),
			f0 = faceList[conjugate ? 1 : 0],
			f1 = faceList[conjugate ? 0 : 1],
			mf = mainFace;

			switch(color) {
				case centerColors[f0]:
					turns.turns(`${f0} ${mf} ${f0}'`);
					break;
				case centerColors[f1]:
					turns.turns(`${f1}' ${mf}' ${f1}`);
					break;
				case mainColor:
					turns.turns(`${f0} ${mf}2 ${f0}' ${mf}' ${f0} ${mf} ${f0}'`);
					break;
				default:
					throw "corner not the right color: " + color;
			}

			return turns.string;
		}
	}

	throw "solve corner on mainFace failed";
}

function calcIndicesFacesList(mainFace) {
	const initialFaces = sides.all.reduce(
		(acc, side) => {
			if (!cube3.sameAxis(side, mainFace) && !cube2.layers[side])
				acc.push(side);
			return acc;
		}, []
	),
	conjugate = sides.conjugate.includes(mainFace),
	f0 = initialFaces[1],
	f1 = initialFaces[0],
	f2 = sides[conjugate ? "counterclockwise" : "clockwise"][mainFace][f1],
	f3 = sides[conjugate ? "clockwise" : "counterclockwise"][mainFace][f0],
	faceList = [f0, f1, f2, f3];

	let indicesFacesList = [];
	for (let i = 0; i < 4; i++) {
		const
		indices = cube3.cornerIndices[i],
		indicesFaces = {indices, faces: [faceList[i], faceList[(i + 1) % 4]]};
		indicesFacesList.push(indicesFaces);
	}
	
	return indicesFacesList;
};