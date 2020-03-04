"use strict";

function cubeBruteForce(cube, order) {
    if (cube.isSolved()) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";
    const pieces = cube.pieces;

    for (let turn of turns) {
        let cube = Cube.turn(pieces, turn.side, turn.amount);
        if (Cube.isSolved(cube)) return [turn];
    }

    if (order >= 2) {
        let cubeList = [Cube.turn(pieces, "U")];

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {

            const noRepeatedSide = indices.reduce((prev, index) => {
                if (prev === false) return false;
                else if (turns[prev].side === turns[index].side) return false;
                return index;
            });

            if (noRepeatedSide) {
                let turn = turns[indices[1]];
                let cube = Cube.turn(cubeList[0], turn.side, turn.amount);

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
                if (noRepeatedSide) {
                    if (i === 1 && indices[0] < turnsLength - 1) {
                        let turn = turns[indices[0] + 1];
                        cubeList[0] = Cube.turn(pieces, turn.side, turn.amount);
                    }
                }
                indices[i] = 0;
            }
        }
    }

    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let cubeList = [Cube.turn(pieces, "U")];
        for (let i = 0; i < subOrder - 2; i++)
            cubeList.push(Cube.turn(cubeList[i], "U"));

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const noRepeatedSide = indices.reduce((prev, index) => {
                if (prev === false) return false;
                else if (turns[prev].side === turns[index].side) return false;
                return index;
            });

            if (noRepeatedSide !== false) {
                let turn = turns[indices[subOrder - 1]];
                let cube = Cube.turn(cubeList[subOrder - 2], turn.side, turn.amount);
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

                if (i === 1 && indices[0] < turnsLength - 1) {
                    let turn = turns[indices[0] + 1];
                    cubeList[0] = Cube.turn(pieces, turn.side, turn.amount);
                }
                for (let j = 0; j < subOrder - 3; j++) {
                    if (i === j + 2 && indices[j + 1] < turnsLength - 1) {
                        let turn = turns[indices[j + 1] + 1];
                        cubeList[j + 1] = Cube.turn(cubeList[j], turn.side, turn.amount);
                    }
                }
                if (i === subOrder - 1 &&
                    indices[subOrder - 2] < turnsLength - 1
                   ) {
                    let turn = turns[indices[subOrder - 2] + 1];
                    cubeList[subOrder - 2] = Cube.turn(
                        cubeList[subOrder - 3],
                        turn.side,
                        turn.amount
                    );
                }

                indices[i] = 0;
            }
        }
    }

    return null;
}
/*
function bruteForceNaive(order) { // main cube
    if (mainCube.isSolved) return [];
    let turns = [];
    for (let side of sides) {
        for (let [turn, amount] of Object.entries(turnAmounts))
            turns.push({side, turn, amount});
    }
    const length = turns.length;
    
    for (let amount = 1; amount <= order; amount++) {
        let indices = Array(amount).fill(0);
        for (let i = amount; i >= 0;) {
            
            let cube = deepCopy(mainCube.pieces);
            for (let index of indices) {
                let turn = turns[index];
                cube = Cube.turn(cube, turn.side, turn.amount)
            }
            if (isSolved(cube)) {
                let moves = [];
                for (let i of indices)
                    moves.push(turns[i]);
                return moves;
            }

            for (i = amount; i--;) {
                if (indices[i] < length - 1) {
                    indices[i]++;
                    break;
                }
                indices[i] = 0;
            }
        }
    }
    
    return false;
}*/