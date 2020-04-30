"use strict";

function OLL(turns, mainFace, mainColor) {
	const cube = turns.cube;

	const fourCorners = (color => {
		let result = {
			solved: [],
			offending: []
		};

		for (const i of cube3.cornerArray) {
			const plane = cube.pieces[i];
			for (const j of cube3.cornerArray) {
				const line = plane[j];
				for (const k of cube3.cornerArray) {
					const piece = line[k];

					if (piece.includes(color)) {
						const
						indices = [i, j, k],
						solved = sides.findColor(indices, piece, mainFace) === color;

						if (solved)
							result.solved.push({piece, side: mainFace, indices});
						else {
							const sideList = sides.indices(indices);
							for (const side of sideList) {
								if (side === mainFace) continue;
								
	                            const sideColor = sides.findColor(indices, piece, side);
	                            if (sideColor === color) {
									result.offending.push({piece, side, indices});
									break;
	                            }
	                        }
						}
					}

				}
			}
		}
		return result;
	})(colors.opposite[mainColor]);

	console.log(fourCorners)
}