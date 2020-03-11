"use strict";

function cubeBruteForce(pieces, order) {
    if (Cube.isSolved(pieces)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (let turn of turns) {
        let cube = Cube.turn(pieces, turn.face, turn.amount);
        if (Cube.isSolved(cube)) return [turn];
    }

    if (order >= 2) {
        let cubeList = [Cube.turn(pieces, "U")];

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {

            const repeatedFace = (turns[indices[0]].face === turns[indices[1]].face);
            
            if (!repeatedFace) {
                let turn = turns[indices[1]];
                let cube = Cube.turn(cubeList[0], turn.face, turn.amount);

                if (Cube.isSolved(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        let turn = turns[index];
                        moves.push(turn);
                    }
                    return moves;
                }
            }

            for (i = 2; i--;) {
                if (indices[i] < turnsLength - 1) {
                    indices[i]++;
                    break;
                }
                
                if (i === 1 && indices[0] < turnsLength - 1) {
                    let turn = turns[indices[0] + 1];
                    cubeList[0] = Cube.turn(pieces, turn.face, turn.amount);
                }
                
                indices[i] = 0;
            }
        }
    }

    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let cubeList = [pieces];

        for (let i = 0; i < subOrder - 1; i++)
            cubeList.push(Cube.turn(cubeList[i], "U"));

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const repeatedFace = (() => {
                for (let j = 1; j < subOrder; j++)
                    if (turns[indices[j - 1]].face === turns[indices[j]].face) return true;
                return false;
            })();

            if (!repeatedFace) {
                let turn = turns[indices[subOrder - 1]];
                let cube = Cube.turn(cubeList[subOrder - 1], turn.face, turn.amount);

                if (Cube.isSolved(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        let turn = turns[index];
                        moves.push(turn);
                    }
                    return moves;
                }
            }

            for (i = subOrder; i--;) {
                if (indices[i] < turnsLength - 1) {
                    indices[i]++;
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