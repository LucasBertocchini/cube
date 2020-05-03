"use strict";

//permutate the corners first, then the edges

function PLL(turns, mainFace, mainColor) {
	const
	cube = turns.cube,
	centerColors = calcCenterColors(cube);

	//corners

	const
	fourCorners = (color => {
		let result = [];

		for (const i of cube3.cornerArray) {
			const plane = cube.pieces[i];
			for (const j of cube3.cornerArray) {
				const line = plane[j];
				for (const k of cube3.cornerArray) {
					const
					indices = [i, j, k],
					sideList = sides.indices(indices);

					if (!sideList.includes(mainFace))
						continue;

					const piece = line[k];

					result.push({
						piece,
						sides: sideList,
						indices
					});
				}
			}
		}
		return result;
	})(colors.opposite[mainColor]),
	doubleColorSides = (fourCorners => {
		let sideList = [];

		for (const side of cube2.orthogonal(mainFace)) {
			let cornerList = [];
			for (const corner of fourCorners)
				if (corner.sides.includes(side))
					cornerList.push(corner);

			const
			corner0 = cornerList[0],
			color0 = sides.findColor(corner0.indices, corner0.piece, side),
			corner1 = cornerList[1],
			color1 = sides.findColor(corner1.indices, corner1.piece, side);

			if (color0 === color1)
				sideList.push(side);
		}

		return sideList;
	})(fourCorners);

	switch (doubleColorSides.length) {
		case 1:
			const
			s = doubleColorSides[0],
			op = sides.opposite[s],
			c = sides.clockwise[mainFace][s];
			
			turns.turns(`${c}' ${op} ${c}' ${s}2 ${c} ${op}' ${c}' ${s}2 ${c}2`);
			break;
		case 0:
			const
			mf = mainFace,
			sideList = cube2.orthogonal(mainFace).filter(side => cube2.layers[side]),
			conjugate = sides.conjugate.includes(mainFace),
			s0 = sideList[conjugate ? 1 : 0],
			s1 = sideList[conjugate ? 0 : 1];

			turns.turns(`${mf}' ${s1} ${mf} ${s1}' ${mf} ${s1}' ${mf}' ${s1} ${s0}' ${s1} ${mf} ${s1}' ${mf}' ${s1}' ${s0} ${s1}2 ${mf}' ${s1}2 ${mf} ${s1}`);
			break;
		case 4:
			break;
		default:
			throw "wrong amount of sides have double colors";
	}

	const
	arbitraryCorner = fourCorners[0].piece,
	indices = cube.findCorner(arbitraryCorner),
	orderedCorner = cube.indices(indices),
	arbitrarySide = sides.indices(indices).filter(side => side !== mainFace)[0],
	arbitraryColor = sides.findColor(indices, orderedCorner, arbitrarySide),
	arbitraryColorSide = keyByValue(centerColors, arbitraryColor),
	amount = sides.angle(mainFace)(arbitrarySide, arbitraryColorSide);

	if (amount)
		turns.turn({face: mainFace, amount});

	//edges

	const fourEdges = (color => {
		let result = {
			solved: [],
			offending: []
		};

		for (const i of cube3.edgeArray) {
			const plane = cube.pieces[i];
			for (const j of cube3.edgeArray) {
				const line = plane[j];
				for (const k of cube3.edgeArray) {
					const piece = line[k];

					if (piece.length !== 2)
						continue;

					const
					indices = [i, j, k],
					sideList = sides.indices(indices);

					if (!sideList.includes(mainFace))
						continue;

					const
					side = sideList.filter(side => side !== mainFace)[0],
					color = sides.findColor(indices, piece, side),
					centerColor = cube3.centerColor(cube, side),
					offendingOrSolved = (color !== centerColor) ? "offending" : "solved";

					result[offendingOrSolved].push({
						piece,
						side,
						color,
						indices
					});
				}
			}
		}
		return result;
	})(colors.opposite[mainColor]),
	nonCoaxialMiddle = side => {
        for (const middle of faces.middles)
            if (!cube3.sameAxis(mainFace, middle) && !cube3.sameAxis(side, middle))
                return middle;
    },
    mf = mainFace;

	switch (fourEdges.offending.length) {
		case 3:
			const
			solvedEdge = fourEdges.solved[0],
			solvedSide = solvedEdge.side,
			oppositeSide = sides.opposite[solvedSide],
			oppositeEdge = fourEdges.offending.filter(edge => edge.side === oppositeSide)[0],
			oppositeColor = oppositeEdge.color,
		    nc = nonCoaxialMiddle(solvedSide),
		    conjugate = {
		    	U: ["B", "L"],
		    	D: ["F", "R"],
		    	B: ["L", "D"],
		    	F: ["R", "U"],
		    	L: ["D", "F"],
		    	R: ["U", "B"]
		    }[mainFace];

			switch (oppositeColor) {
				case cube3.centerColor(cube, sides.clockwise[mainFace][oppositeSide]):
					if (conjugate.includes(solvedSide))
						turns.turns(`${nc}' ${mf}2 ${nc} ${mf}' ${nc}' ${mf}2 ${nc} ${mf}' ${nc}' ${mf}2 ${nc}`);
					else
						turns.turns(`${nc} ${mf}2 ${nc}' ${mf}' ${nc} ${mf}2 ${nc}' ${mf}' ${nc} ${mf}2 ${nc}'`);
					break;

				case cube3.centerColor(cube, sides.counterclockwise[mainFace][oppositeSide]):
					if (conjugate.includes(solvedSide))
						turns.turns(`${nc}' ${mf}2 ${nc} ${mf} ${nc}' ${mf}2 ${nc} ${mf} ${nc}' ${mf}2 ${nc}`);
					else
						turns.turns(`${nc} ${mf}2 ${nc}' ${mf} ${nc} ${mf}2 ${nc}' ${mf} ${nc} ${mf}2 ${nc}'`);
					break;

				default:
					throw "err";
			}

			break;
		case 4:
			const
			arbitraryEdge = fourEdges.offending[0],
			arbitraryColor = arbitraryEdge.color,
			arbitrarySide = arbitraryEdge.side,
			ncm = nonCoaxialMiddle(arbitrarySide),
			cm = (side => {
		        for (const middle of faces.middles)
		            if (cube3.sameAxis(side, middle))
		                return middle;
		    })(arbitrarySide);

			switch (arbitraryColor) {
				case cube3.centerColor(cube, sides.clockwise[mainFace][arbitrarySide]):
					turns.turns(`${cm}2 ${mf} ${cm}2 ${mf} ${cm}' ${mf}2 ${cm}2 ${mf}2 ${cm}' ${mf}2`);
					break;
				case cube3.centerColor(cube, sides.counterclockwise[mainFace][arbitrarySide]):
					turns.turns(`${ncm}2 ${mf} ${ncm}2 ${mf} ${ncm}' ${mf}2 ${ncm}2 ${mf}2 ${ncm}' ${mf}2`);
					break;
				case cube3.centerColor(cube, sides.opposite[arbitrarySide]):
					turns.turns(`${ncm}2 ${mf} ${ncm}2 ${mf}2 ${ncm}2 ${mf} ${ncm}2`);
					break;
				default:
					throw "err";
			}
			break;
		case 0:
			break;
		default:
			throw "wrong amount of offending edges";
	}
}

function calcCenterColors(cube) {
	let centerColors = {};
	for (const [face, indices] of Object.entries(cube3.centerIndices)) {
		const color = cube.indices(indices);
		centerColors[face] = color;
	}
	return centerColors;
}