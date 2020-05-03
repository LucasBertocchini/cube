"use strict";

function OLL(turns, mainFace, mainColor) {
	const
	cube = turns.cube,
	offendingCorners = (color => {
		let result = [];

		for (const i of cube3.cornerArray) {
			const plane = cube.pieces[i];
			for (const j of cube3.cornerArray) {
				const line = plane[j];
				for (const k of cube3.cornerArray) {
					const
					piece = line[k],
					indices = [i, j, k],
					sideList = sides.indices(indices);

					if (!sideList.includes(mainFace))
						continue;

					const solved = sides.findColor(indices, piece, mainFace) === color;

					if (!solved) {
						const index = cube2.index[mainFace];

						let reducedIndices = [...indices];
						reducedIndices.splice(index, 1);

						for (const side of sideList) {
							if (side === mainFace) continue;
							
                            const sideColor = sides.findColor(indices, piece, side);
                            if (sideColor === color) {
								result.push({
									piece,
									side,
									indices: reducedIndices,
									otherSide: sideList.filter(i => i !== mainFace && i !== side)[0]
								});
								break;
                            }
                        }
					}

				}
			}
		}
		return result;
	})(colors.opposite[mainColor]);

	if (!offendingCorners.length) return;

	let turnLists = [];

	const permutations = permute(offendingCorners);
	for (const permutation of permutations) {
		const
		copy = cube.copy(),
		turns1 = new Turns(copy),
		firstCorner = permutation[0];

		let reducedFirstCornerIndices = [...firstCorner.indices];
		reducedFirstCornerIndices.splice(cube3.index[mainFace], 0, cube3.layers[mainFace]);

		let newSides = sides.indices(reducedFirstCornerIndices).filter(side => side !== mainFace);
		if (sides.counterclockwise[mainFace][newSides[0]] === newSides[1])
			newSides.reverse();

		const
		op = sides.opposite[mainFace],
		f0 = newSides[0],
		f1 = newSides[1],
		turnStrings = {
			[f0]: `${f0}' ${op}' ${f0} ${op} ${f0}' ${op}' ${f0} ${op}`,
			[f1]: `${op}' ${f0}' ${op} ${f0} ${op}' ${f0}' ${op} ${f0}`
		}

		for (const corner of permutation) {
			const
			index = cube2.index[mainFace],
			indices = copy.findCorner(corner.piece);

			let reducedIndices = [...indices];
			reducedIndices.splice(index, 1);

			const amount = ((i0, i1) => {
				if (eqarray(i0, i1))
					return 0;

				if (i0.concat(i1).reduce(
					(acc, val) => val ? ++acc : acc , 0
				) === 2)
					return 2;

				switch (i0[1] === i1[0]) {
					case sides.conjugate.includes(mainFace):
						return 1;
					default:
						return -1;
				}
			})(firstCorner.indices, reducedIndices);

			if (amount) turns1.turn({face: mainFace, amount});

			const
			newIndices = copy.findCorner(corner.piece),
			orderedCorner = copy.indices(newIndices),
			side = ((newIndices, piece, color) => {
				const sideList = sides.indices(newIndices);
				for (const side of sideList) {
				    const sideColor = sides.findColor(newIndices, piece, side);
				    if (sideColor === color)
						return side;
				}
			})(newIndices, orderedCorner, colors.opposite[mainColor]),
			turnString = turnStrings[side];

			turns1.turns(turnString);
		}

		turnLists.push(turns1.list);
	}

	const shortestTurnList = turnLists.reduce(
        (a, b) => (a.length - b.length > 0) ? b : a
    );
    if (shortestTurnList.length)
		turns.turn(...shortestTurnList)
}