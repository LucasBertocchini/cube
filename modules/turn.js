"use strict";

function cubeTurn(pieces, face, amount) {
	if (!turnAmounts.includes(amount)) throw "turn amount must be 1, -1, or 2";

	// conjugate the direction for opposite sides
	if (["D", "B", "R"].includes(face) && amount !== 2)
	    amount *= -1;

	let layer = layers[face];
	if (layer === undefined) layer = parseInt(face.slice(1));
	let after = deepCopy(pieces);

	function calcIndices(i, j, iPrime, jPrime) {
	    let indices;
	    switch (amount) {
	    	case 1:
		        indices = [jPrime, i];
		        break;
		    case -1:
		        indices = [j, iPrime];
		        break;
		    case 2:
		        indices = [iPrime, jPrime];
	    }
	    return indices;
	}

	function calcPieces(newPieceFunction) {
	    for (let i = 0; i < cubeSize; i++) {
	        const iPrime = cubeSize - 1 - i;
	        for (let j = 0; j < cubeSize; j++) {
	            const jPrime = cubeSize - 1 - j;
	            let indices = calcIndices(i, j, iPrime, jPrime);
	            newPieceFunction(i, j, indices);
	        }
	    }
	}
	
	/* loops are inside the if statements to avoid calling if's
	many times unnecisarily */
	switch (face[0]) {
		case "U":
		case "D":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece.length === 3 && amount !== 2)
		            newPiece = reorder(newPiece, 0, 2, 1);

		        after[layer][i][j] = newPiece;
		    });
		    break;
		
		case "F":
		case "B":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][layer][indices[1]];

		        if (newPiece.length === 3 && amount !== 2)
		            newPiece = reorder(newPiece, 2, 1, 0);
		        else if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][layer][j] = newPiece;
		    });
		    break;
		
		case "L":
		case "R":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece.length === 3 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0, 2);

		        after[i][j][layer] = newPiece;
		    });
		    break;
		
		case "E":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[layer][i][j] = newPiece;
		    });
		    break;
		
		case "S":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][layer][indices[1]];

		        if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][layer][j] = newPiece;
		    });
		    break;
		
		case "M":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][j][layer] = newPiece;
		    });
		    break;
		
		case "y": 
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces((i, j, indices) => {
			    	let newPiece = pieces[layer][indices[0]][indices[1]];

			    	if (newPiece.length === 3 && amount !== 2)
			            newPiece = reorder(newPiece, 0, 2, 1);
			        else if (newPiece.length === 2 && amount !== 2 &&
			        	layer !== 0 && layer !== cubeSize - 1)
			            newPiece = reorder(newPiece, 1, 0);

			    	after[layer][i][j] = newPiece;
			    });
			}
		    break;
		
		case "z":
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces((i, j, indices) => {
			    	let newPiece = pieces[indices[0]][layer][indices[1]];

			    	if (newPiece.length === 3 && amount !== 2)
			            newPiece = reorder(newPiece, 2, 1, 0);
			        else if (newPiece.length === 2 && amount !== 2)
		            	newPiece = reorder(newPiece, 1, 0);

			    	after[i][layer][j] = newPiece;
			    });
			}
		    break;
		
		case "x":
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces((i, j, indices) => {
			    	let newPiece = pieces[indices[0]][indices[1]][layer];

			    	if (newPiece.length === 3 && amount !== 2)
			            newPiece = reorder(newPiece, 1, 0, 2);
			        else if (newPiece.length === 2 && amount !== 2 &&
			        	layer !== 0 && layer !== cubeSize - 1)
		            	newPiece = reorder(newPiece, 1, 0);

			    	after[i][j][layer] = newPiece;
			    });
			}
		    break;
		
		default:
		    throw "face must be U, D, L, R, F, B, E(n), S(n), M(n), y, z, or x";
	}

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

	function calcIndices(i, j, iPrime, jPrime) {
	    let indices;
	    if (amount === 1)
	        indices = [jPrime, i];
	    else if (amount === -1)
	        indices = [j, iPrime];
	    else if (amount === 2)
	        indices = [iPrime, jPrime];
	    return indices;
	}

	function calcPieces(newPieceFunction) {
	    for (let i = 0; i < cubeSize; i++) {
	        const iPrime = cubeSize - 1 - i;
	        for (let j = 0; j < cubeSize; j++) {
	            const jPrime = cubeSize - 1 - j;

	            let indices = calcIndices(i, j, iPrime, jPrime);
	            newPieceFunction(i, j, indices);
	        }
	    }
	}

	/* loops are inside the if statements to avoid calling if's
	many times unnecisarily */
	switch (face[0]) {
		case "U":
		case "D":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece) after[layer][i][j] = newPiece;
		    });
		    break;
		
		case "F":
		case "B":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][layer][indices[1]];

		        if (newPiece) {
			        if (amount !== 2)
			            newPiece = reorder(newPiece, 1, 0);

			        after[i][layer][j] = newPiece;
			    }
		    });
		    break;
		
		case "L":
		case "R":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece) after[i][j][layer] = newPiece;
		    });
		    break;
		
		case "E":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece) {
			        if (amount !== 2)
			            newPiece = reorder(newPiece, 1, 0);

			        after[layer][i][j] = newPiece;
			    }
		    });
		    break;
		
		case "S":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][layer][indices[1]];

		        if (newPiece) {
		        	if (amount !== 2)
		        		newPiece = reorder(newPiece, 1, 0);

			       	after[i][layer][j] = newPiece;
		    	}
		    });
		    break;
		
		case "M":
		    calcPieces((i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece) {
			        if (amount !== 2)
			            newPiece = reorder(newPiece, 1, 0);

			        after[i][j][layer] = newPiece;
			    }
		    });
		    break;
		
		default:
		    throw "face must be U, D, L, R, F, B, E(n), S(n), M(n), y, z, or x";
	}

	return after;
}