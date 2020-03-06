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
        let cubeList = [Cube.turn(pieces, "U")];
        for (let i = 0; i < subOrder - 2; i++)
            cubeList.push(Cube.turn(cubeList[i], "U"));

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const repeatedFace = (() => {
                for (let j = 1; j < subOrder; j++)
                    if (turns[indices[j - 1]].face === turns[indices[j]].face) return true;
                return false;
            })();

            if (!repeatedFace) {
                //6 0 14
                let turn = turns[indices[subOrder - 1]];
                let cube = Cube.turn(cubeList[subOrder - 2], turn.face, turn.amount);
                if (Cube.isSolved(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        let turn = turns[index];
                        moves.push(turn);
                    }
                    return moves;
                }
                
                if (indices[0] === 6 && indices[1] === 0 && indices[2] === 14) {
                    console.log(indices);
                    mainCube.pieces = cube;
                    display();
                    return;
                }
            }
            

            for (i = subOrder; i--;) {
                if (indices[i] < turnsLength - 1) {
                    indices[i]++;
                    console.log(indices)
                    break;
                } else {
                    console.log("a")
                    console.log(indices)
                }
//                console.log("n")
//                console.log(indices)
                if (i === 1 && indices[0] < turnsLength - 1) {
                    const turn = turns[indices[0] + 1];
//                    console.log(indices)
                    cubeList[0] = Cube.turn(pieces, turn.face, turn.amount);
                }
                for (let j = 0; j < subOrder - 2; j++) {
                    if (i === j + 2 && indices[j + 1] < turnsLength - 1) {
                        const turn = turns[indices[j + 1] + 1];
//                        console.log(indices)
                        cubeList[j + 1] = Cube.turn(cubeList[j], turn.face, turn.amount);
                    }
                }

                indices[i] = 0;
            }
        }
    }

    return null;
}