"use strict";

function cubeBruteForce(pieces, order) {
    if (Cube.isSolved(pieces)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (let turn of turns) {
        let cube = Cube.turn(pieces, turn.face, turn.amount);
        if (Cube.isSolved(cube)) return [turn];
    }

    if (order >= 2) { //convert to double for loop
        let first = Cube.turn(pieces, "U");

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {

            const turn = turns[indices[1]];
            const cube = Cube.turn(first, turn.face, turn.amount);

            if (Cube.isSolved(cube)) {
                let moves = [];
                for (let index of indices) {
                    const turn = turns[index];
                    moves.push(turn);
                }
                return moves;
            }

            for (i = 2; i--;) {
                if (indices[i] < turnsLength - 1) {
                    indices[i]++;

                    if (i === 1) {
	                    while (turns[indices[0]].face === turns[indices[1]].face &&
	                    	indices[1] < turnsLength - 1)
	                    	indices[1]++;
                	}

                    break;
                }
                indices[i] = 0;
            }

            if (indices[1] === 0) {
                const turn = turns[indices[0]];
                first = Cube.turn(pieces, turn.face, turn.amount);
            }
        }
    }

    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let cubeList = [pieces];

        for (let i = 0; i < subOrder - 1; i++)
            cubeList.push(Cube.turn(cubeList[i], "U"));

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const turn = turns[indices[subOrder - 1]];
            const cube = Cube.turn(cubeList[subOrder - 1], turn.face, turn.amount);

            if (Cube.isSolved(cube)) {
                let moves = [];
                for (let index of indices) {
                    const turn = turns[index];
                    moves.push(turn);
                }
                return moves;
            }

            for (i = subOrder; i--;) {
                if (indices[i] < turnsLength - 1) {
                    indices[i]++;

                    //assure there are no repeated faces
                    //does not catch leading 0's or trailing {turnsLength - 1}'s
                	if (i === 0 || i === 1) {
                    	while (turns[indices[1]].face === turns[indices[0]].face &&
                    		indices[1] < turnsLength - 1)
                    		indices[1]++;
                    }
                    for (let j = 2; j < subOrder; j++) {
                    	if (i === j) {
	                    	while (turns[indices[j]].face === turns[indices[j - 1]].face &&
	                    		indices[j] < turnsLength - 1)
	                    		indices[j]++;
	                    }
                    }
                    
                    break;
                }
                indices[i] = 0;
            }

            if (indices[subOrder - 1] === 0) {
                for (let j = 0; j < subOrder - 1; j++) {
                    const turn = turns[indices[j]];
                    cubeList[j + 1] = Cube.turn(cubeList[j], turn.face, turn.amount);
                }
            }
        }
    }

    return null;
}