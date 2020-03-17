"use strict";

function cubeBruteForce(pieces, order) {
    if (Cube.isSolved(pieces)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (const turn of turns) {
        const cube = Cube.turn(pieces, turn.face, turn.amount);
        if (Cube.isSolved(cube)) return [turn];
    }

    if (order >= 2) {
        for (const turn1 of turns) {
            const cube1 = Cube.turn(pieces, turn1.face, turn1.amount);
            for (const turn2 of turns) {
                if (turn1.face === turn2.face) continue;
                const cube = Cube.turn(cube1, turn2.face, turn2.amount);

                if (Cube.isSolved(cube))
                    return [turn1, turn2];
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