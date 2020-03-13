"use strict";

function cubeTurn(pieces, face, amount) {
	if (!turnAmounts.includes(amount)) throw "turn amount must be 1, -1, or 2";

	// conjugate the direction for opposite sides
	if (["D", "B", "R"].includes(face) && amount !== 2)
	    amount *= -1;

	let layer = layers[face];
	if (layer === undefined) layer = parseInt(face.slice(1));
	let after = deepCopy(pieces);

	function calcIndexes(i, j, iPrime, jPrime) {
	    let indexes;
	    if (amount === 1)
	        indexes = [jPrime, i];
	    else if (amount === -1)
	        indexes = [j, iPrime];
	    else if (amount === 2)
	        indexes = [iPrime, jPrime];
	    return indexes;
	}

	function calcPieces(newPieceFunction) {
	    for (let i = 0; i < cubeSize; i++) {
	        const iPrime = cubeSize - 1 - i;
	        for (let j = 0; j < cubeSize; j++) {
	            const jPrime = cubeSize - 1 - j;
	            let indexes = calcIndexes(i, j, iPrime, jPrime);
	            newPieceFunction(i, j, indexes);
	        }
	    }
	}

	/* loops are inside the if statements to avoid calling if's
	many times unnecisarily */
	if (face === "U" || face === "D") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[layer][indexes[0]][indexes[1]];

	        if (newPiece.length === 3 && amount !== 2)
	            newPiece = reorder(newPiece, 0, 2, 1);

	        after[layer][i][j] = newPiece;
	    });
	} else if (face === "F" || face === "B") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][layer][indexes[1]];

	        if (newPiece.length === 3 && amount !== 2)
	            newPiece = reorder(newPiece, 2, 1, 0);
	        else if (newPiece.length === 2 && amount !== 2)
	            newPiece = reorder(newPiece, 1, 0);

	        after[i][layer][j] = newPiece;
	    });
	} else if (face === "L" || face === "R") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][indexes[1]][layer];

	        if (newPiece.length === 3 && amount !== 2)
	            newPiece = reorder(newPiece, 1, 0, 2);

	        after[i][j][layer] = newPiece;
	    });
	} else if (face === "E") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[layer][indexes[0]][indexes[1]];

	        if (newPiece.length === 2 && amount !== 2)
	            newPiece = reorder(newPiece, 1, 0);

	        after[layer][i][j] = newPiece;
	    });
	} else if (face === "S") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][layer][indexes[1]];

	        if (newPiece.length === 2 && amount !== 2)
	            newPiece = reorder(newPiece, 1, 0);

	        after[i][layer][j] = newPiece;
	    });
	} else if (face === "M") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][indexes[1]][layer];

	        if (newPiece.length === 2 && amount !== 2)
	            newPiece = reorder(newPiece, 1, 0);

	        after[i][j][layer] = newPiece;
	    });
	} else if (face === "y") {
	    const negAmount = (amount === 2) ? 2 : -amount;
	    after = Cube.turn(after, "U", amount);
	    after = Cube.turn(after, "E", amount);
	    after = Cube.turn(after, "D", negAmount);
	} else if (face === "z") {
	    const negAmount = (amount === 2) ? 2 : -amount;
	    after = Cube.turn(after, "F", amount);
	    after = Cube.turn(after, "S", amount);
	    after = Cube.turn(after, "B", negAmount);
	} else if (face === "x") {
	    const negAmount = (amount === 2) ? 2 : -amount;
	    after = Cube.turn(after, "R", amount);
	    after = Cube.turn(after, "M", negAmount);
	    after = Cube.turn(after, "L", negAmount);
	}  else
	    throw "face must be U, D, L, R, F, B, E(n), S(n), M(n), y, z, or x";

	return after;
}

function edgesTurn(pieces, face, amount) {
	if (!turnAmounts.includes(amount)) throw "turn amount must be 1, -1, or 2";

	// conjugate the direction for opposite sides
	if (["D", "B", "R"].includes(face) && amount !== 2)
	    amount *= -1;

	let layer = layers[face];
	if (layer === undefined) layer = parseInt(face.slice(1));
	let after = deepCopy(pieces);

	function calcIndexes(i, j, iPrime, jPrime) {
	    let indexes;
	    if (amount === 1)
	        indexes = [jPrime, i];
	    else if (amount === -1)
	        indexes = [j, iPrime];
	    else if (amount === 2)
	        indexes = [iPrime, jPrime];
	    return indexes;
	}

	function calcPieces(newPieceFunction) {
	    for (let i = 0; i < cubeSize; i++) {
	        const iPrime = cubeSize - 1 - i;
	        for (let j = 0; j < cubeSize; j++) {
	            const jPrime = cubeSize - 1 - j;

	            let indexes = calcIndexes(i, j, iPrime, jPrime);
	            newPieceFunction(i, j, indexes);
	        }
	    }
	}

	/* loops are inside the if statements to avoid calling if's
	many times unnecisarily */
	if (face === "U" || face === "D") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[layer][indexes[0]][indexes[1]];

	        if (newPiece) after[layer][i][j] = newPiece;
	    });
	} else if (face === "F" || face === "B") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][layer][indexes[1]];

	        if (newPiece) {
		        if (amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][layer][j] = newPiece;
		    }
	    });
	} else if (face === "L" || face === "R") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][indexes[1]][layer];

	        if (newPiece) after[i][j][layer] = newPiece;
	    });
	} else if (face === "E") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[layer][indexes[0]][indexes[1]];

	        if (newPiece) {
		        if (amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[layer][i][j] = newPiece;
		    }
	    });
	} else if (face === "S") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][layer][indexes[1]];

	        if (newPiece) {
	        	if (amount !== 2)
	        		newPiece = reorder(newPiece, 1, 0);

		       	after[i][layer][j] = newPiece;
	    	}
	    });
	} else if (face === "M") {
	    calcPieces((i, j, indexes) => {
	        let newPiece = pieces[indexes[0]][indexes[1]][layer];

	        if (newPiece) {
		        if (amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][j][layer] = newPiece;
		    }
	    });
	} else
	    throw "face must be U, D, L, R, F, B, E(n), S(n), M(n), y, z, or x";

	return after;
}