"use strict";

function bruteForceSolve(order) {
    if (isSolved(mainCube)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";
    
    for (let turn of turns) {
        let cube = turnSide(mainCube, turn.side, turn.amount);
        if (isSolved(cube)) return [turn];
    }
    
    if (order >= 2) {
        let cubeList = [];
        cubeList.push(turnSide(mainCube, "U"));

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {

            const noRepeatedSide = indices.reduce((prev, index) => {
                if (prev === false) return false;
                else if (turns[prev].side === turns[index].side) return false;
                return index;
            });

            if (noRepeatedSide) {
                let turn = turns[indices[1]];
                let cube = turnSide(cubeList[0], turn.side, turn.amount);
                if (isSolved(cube)) {
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
                        cubeList[0] = turnSide(mainCube, turn.side, turn.amount);
                    }
                }
                indices[i] = 0;
            }
        }
    }
    
    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let cubeList = [];
        cubeList.push(turnSide(mainCube, "U"));
        for (let i = 0; i < subOrder - 2; i++) {
            cubeList.push(turnSide(cubeList[i], "U"));
        }

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const noRepeatedSide = indices.reduce((prev, index) => {
                if (prev === false) return false;
                else if (turns[prev].side === turns[index].side) return false;
                return index;
            });

            if (noRepeatedSide !== false) {
                let turn = turns[indices[subOrder - 1]];
                let cube = turnSide(cubeList[subOrder - 2], turn.side, turn.amount);
                if (isSolved(cube)) {
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
                    cubeList[0] = turnSide(mainCube, turn.side, turn.amount);
                }
                for (let j = 0; j < subOrder - 3; j++) {
                    if (i === j + 2 && indices[j + 1] < turnsLength - 1) {
                        let turn = turns[indices[j + 1] + 1];
                        cubeList[j + 1] = turnSide(cubeList[j], turn.side, turn.amount);
                    }
                }
                if (i === subOrder - 1 &&
                    indices[subOrder - 2] < turnsLength - 1
                   ) {
                    let turn = turns[indices[subOrder - 2] + 1];
                    cubeList[subOrder - 2] = turnSide(
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

function bruteForceNaive(order) { // main cube
    if (isSolved(mainCube)) return [];
    let turns = [];
    for (let side of sides) {
        for (let [turn, amount] of Object.entries(turnAmounts))
            turns.push({side, turn, amount});
    }
    const length = turns.length;
    
    for (let amount = 1; amount <= order; amount++) {
        let indices = Array(amount).fill(0);
        for (let i = amount; i >= 0;) {
            
            let cube = deepCopy(mainCube);
            for (let index of indices) {
                let turn = turns[index];
                cube = turnSide(cube, turn.side, turn.amount)
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
}