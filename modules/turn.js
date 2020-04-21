"use strict";

Cube.turn = cubeTurn;
Edges.turn = edgesTurn;

function cubeTurn(pieces, turn) {
	const face = turn.face;
	let amount = turn.amount;

	// conjugate the direction for opposite sides
	if (["D", "B", "R"].includes(face) && amount !== 2)
	    amount *= -1;

	let layer = cube3.layers[face];
	if (layer === undefined) layer = parseInt(face.slice(1));

	let after = deepCopy(pieces);

	/* loops are inside the if statements to avoid calling if's
	many times unnecisarily */
	switch (face[0]) {
		case "U":
		case "D":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece.length === 3 && amount !== 2)
		            newPiece = reorder(newPiece, 0, 2, 1);

		        after[layer][i][j] = newPiece;
		    });
		    break;
		
		case "F":
		case "B":
		    calcPieces(amount, (i, j, indices) => {
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
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece.length === 3 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0, 2);

		        after[i][j][layer] = newPiece;
		    });
		    break;
		
		case "E":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[layer][i][j] = newPiece;
		    });
		    break;
		
		case "S":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[indices[0]][layer][indices[1]];

		        if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][layer][j] = newPiece;
		    });
		    break;
		
		case "M":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece.length === 2 && amount !== 2)
		            newPiece = reorder(newPiece, 1, 0);

		        after[i][j][layer] = newPiece;
		    });
		    break;
		
		case "y": 
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces(amount, (i, j, indices) => {
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
			    calcPieces(amount, (i, j, indices) => {
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
			    calcPieces(amount, (i, j, indices) => {
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

function calcIndices(amount, i, j, iPrime, jPrime) {
    switch (amount) {
    	case 1:
	        return [jPrime, i];
	    case -1:
	        return [j, iPrime];
	    case 2:
	        return [iPrime, jPrime];
	    default:
	    	throw "amount must be 1, -1, or 2: " + amount;
    }
}

function calcPieces(amount, newPieceFunction) {
    for (let i = 0; i < cubeSize; i++) {
        const iPrime = cubeSize - 1 - i;
        for (let j = 0; j < cubeSize; j++) {
            const jPrime = cubeSize - 1 - j;
            let indices = calcIndices(amount, i, j, iPrime, jPrime);
            newPieceFunction(i, j, indices);
        }
    }
}

function edgesTurn(pieces, turn) {
	const face = turn.face;
	let amount = turn.amount;
	
	// conjugate the direction for opposite sides
	if (["D", "B", "R"].includes(face) && amount !== 2)
	    amount *= -1;

	let layer = cube3.layers[face];
	if (layer === undefined) layer = parseInt(face.slice(1));

	let after = deepCopy(pieces);

	/* loops are inside the if statements to avoid calling if's
	many times unnecisarily */
	switch (face[0]) {
		case "U":
		case "D":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece) after[layer][i][j] = newPiece;
		    });
		    break;
		
		case "F":
		case "B":
		    calcPieces(amount, (i, j, indices) => {
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
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece) after[i][j][layer] = newPiece;
		    });
		    break;
		
		case "E":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[layer][indices[0]][indices[1]];

		        if (newPiece) {
			        if (amount !== 2)
			            newPiece = reorder(newPiece, 1, 0);

			        after[layer][i][j] = newPiece;
			    }
		    });
		    break;
		
		case "S":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[indices[0]][layer][indices[1]];

		        if (newPiece) {
		        	if (amount !== 2)
		        		newPiece = reorder(newPiece, 1, 0);

			       	after[i][layer][j] = newPiece;
		    	}
		    });
		    break;
		
		case "M":
		    calcPieces(amount, (i, j, indices) => {
		        let newPiece = pieces[indices[0]][indices[1]][layer];

		        if (newPiece) {
			        if (amount !== 2)
			            newPiece = reorder(newPiece, 1, 0);

			        after[i][j][layer] = newPiece;
			    }
		    });
		    break;

		case "y": 
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces(amount, (i, j, indices) => {
			    	let newPiece = pieces[layer][indices[0]][indices[1]];

			    	if (newPiece) {
			    		if (newPiece.length === 2 && amount !== 2 &&
				        	layer !== 0 && layer !== cubeSize - 1)
				            newPiece = reorder(newPiece, 1, 0);

				    	after[layer][i][j] = newPiece;
				    }
			    });
			}
		    break;
		
		case "z":
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces(amount, (i, j, indices) => {
			    	let newPiece = pieces[indices[0]][layer][indices[1]];

			    	if (newPiece) {
				    	if (newPiece.length === 2 && amount !== 2)
			            	newPiece = reorder(newPiece, 1, 0);

				    	after[i][layer][j] = newPiece;
				    }
			    });
			}
		    break;
		
		case "x":
		    for (let layer = 0; layer < cubeSize; layer++) {
			    calcPieces(amount, (i, j, indices) => {
			    	let newPiece = pieces[indices[0]][indices[1]][layer];

					if (newPiece) {
				    	if (newPiece.length === 2 && amount !== 2 &&
				        	layer !== 0 && layer !== cubeSize - 1)
			            	newPiece = reorder(newPiece, 1, 0);

				    	after[i][j][layer] = newPiece;
				    }
			    });
			}
		    break;


		
		default:
		    throw "face must be U, D, L, R, F, B, E(n), S(n), M(n), y, z, or x";
	}

	return after;
}