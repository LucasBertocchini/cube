"use strict";

function cubeBruteForce(pieces, order) {
    if (Cube.isSolved(pieces)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (const turn of allTurns) {
        const cube = Cube.turn(pieces, turn);
        if (Cube.isSolved(cube)) return [turn];
    }

    if (order >= 2) {
        for (const turn1 of allTurns) {
            const cube1 = Cube.turn(pieces, turn1);
            for (const turn2 of allTurns) {
                if (turn1.face === turn2.face) continue;
                const cube = Cube.turn(cube1, turn2);

                if (Cube.isSolved(cube))
                    return [turn1, turn2];
            }
        }
    }

    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let cubeList = [pieces];

        for (let i = 0; i < subOrder - 1; i++)
            cubeList.push(Cube.turn(cubeList[i], {face: "U", amount: 1}));

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const turn = allTurns[indices[subOrder - 1]];
            const cube = Cube.turn(cubeList[subOrder - 1], turn);

            if (Cube.isSolved(cube)) {
                let moves = [];
                for (let index of indices) {
                    const turn = allTurns[index];
                    moves.push(turn);
                }
                return moves;
            }

            for (i = subOrder; i--;) {
                if (indices[i] < allTurns.length - 1) {
                    indices[i]++;

                    //assure there are no repeated faces
                    //does not catch leading 0's or trailing {allTurns.length - 1}'s
                	if (i === 0 || i === 1) {
                    	while (allTurns[indices[1]].face === allTurns[indices[0]].face &&
                    		indices[1] < allTurns.length - 1)
                    		indices[1]++;
                    }
                    for (let j = 2; j < subOrder; j++) {
                    	if (i === j) {
	                    	while (allTurns[indices[j]].face === allTurns[indices[j - 1]].face &&
	                    		indices[j] < allTurns.length - 1)
	                    		indices[j]++;
	                    }
                    }
                    
                    if (indices[subOrder - 1] === 0) {
                        for (let j = 0; j < subOrder - 1; j++) {
                            const turn = allTurns[indices[j]];
                            cubeList[j + 1] = Cube.turn(cubeList[j], turn);
                        }
                    }
                    
                    break;
                }
                indices[i] = 0;
            }
        }
    }

    return null;
}