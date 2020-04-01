"use strict";

function firstLayer(cube, mainColor, moves) {
	const fourCorners = (() => {
		let result = [];
		cube.pieces.forEach(
			plane => plane.forEach(
				line => line.forEach(
					piece => {
						if (piece.length === 3 && piece.includes("w"))
							result.push(piece);
					}
				)
			)
		);
		return result;
	})();

	let count = 0;
	for (const corner1 of fourCorners) {
		const filtered1 = fourCorners.filter(corner => corner !== corner1);
		for (const corner2 of filtered1) {
			const filtered2 = filtered1.filter(corner => corner !== corner2);
			for (const corner3 of filtered2) {
				const filtered3 = filtered2.filter(corner => corner !== corner3);
				const corner4 = filtered3[0];
				console.log(corner1, corner2, corner3, corner4)
				count++
			}
		}
	}
	console.log(count)
}