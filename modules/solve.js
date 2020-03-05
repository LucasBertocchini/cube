"use strict";
/*
function bruteForce(cube, order, solveFunction) {
    let sides = ["U", "D", "F", "B", "L", "R"];

    let turns = [];
    sides.forEach(side => {
        turnAmounts.forEach(amount => turns.push({side, amount}));
    });
    const turnsLength = turns.length;
    
    if (solveFunction(cube)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";
    
    
    
    
    for (let turn of turns) {
        let tempCube = turnSide(cube, turn.side, turn.amount);
        if (solveFunction(tempCube)) return [turn];
    }
    
    if (order >= 2) {
        let cubeList = [];
        cubeList.push(turnSide(cube, "U"));

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {

            const noRepeatedSide = indices.reduce((prev, index) => {
                if (prev === false) return false;
                else if (turns[prev].side === turns[index].side) return false;
                return index;
            });

            if (noRepeatedSide) {
                let turn = turns[indices[1]];
                let tempCube = turnSide(cubeList[0], turn.side, turn.amount);
                if (solveFunction(tempCube)) {
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
                        cubeList[0] = turnSide(cube, turn.side, turn.amount);
                    }
                }
                indices[i] = 0;
            }
        }
    }
    
    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let cubeList = [];
        cubeList.push(turnSide(cube, "U"));
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
                let tempCube = turnSide(cubeList[subOrder - 2], turn.side, turn.amount);
                if (solveFunction(tempCube)) {
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
                    cubeList[0] = turnSide(cube, turn.side, turn.amount);
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

function crossSolvedW(cube) {
    let U = cube.pieces[0];
    if (U[0][1][0] !== "w" || U[1][0][0] !== "w" || U[1][2][0] !== "w" || U[2][1][0] !== "w")
        return false;
    return true;
}
*/



function beginnerSolve3(displayCube = true) {
    if (cubeSize !== 3) throw "cube size must be 3 for beginnerSolve3";
    
    let cube = mainCube.copy(),
        moves = [];
    
    //choose color to solve from
    let mainColor = "w";
    
    //orient cube with color side on D
    (function orient() {
        const orientations = [
            {indices: [0, 1, 1], face: "M", amount: 2},  //U
            {indices: [1, 2, 1], face: "M", amount: 1},  //F
            {indices: [1, 0, 1], face: "M", amount: -1}, //B
            {indices: [1, 1, 0], face: "S", amount: -1}, //L
            {indices: [1, 1, 2], face: "S", amount: 1}   //R
        ];
        for (let orientation of orientations) {
            const i = orientation.indices;
            if (cube.pieces[i[0]][i[1]][i[2]] === mainColor) {
                const face = orientation.face,
                      amount = orientation.amount;
                moves.push({face, amount});
                cube.turn(face, amount);
            }
        }
    })();
    
    //cross
    (function cross() {
        console.log(cube.pieces[0]);
        
        function solveFunction(cube) {
            
            const U = cube[0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if ((i === 1 || j === 1) && !(i === 1 && j === 1)) {
                        // edge piece
                        const line = U[i];
                        const piece = line[j];
                        const color = piece[0];
                        if (color !== mainColor) return false;
                    }
                }
            }
            
            return true;
        }
        
        let bf = bruteForce(cube.pieces, 3, solveFunction);
        //console.log(bf);
        if (bf) {
            for (let turn of bf) {
                moves.push(turn);
                cube.turn(turn.face, turn.amount);
            }
        }

        
        
        
        
        
        //console.log(bruteForce(cube, 3, crossSolvedW));
        /*
        const oppositeColors = [["w", "y"], ["b", "g"], ["r", "o"]];
        const areOpposites = (c1, c2) => oppositeColors.includes([c1, c2]) ||
          oppositeColors.includes([c2, c1]);
        
        const orientations = {
            F: [2, 1],
            B: [0, 1],
            L: [1, 0],
            R: [1, 2]
        };
        let sideColors = {};
        for (let [side, indices] of Object.entries(orientations))
            sideColors[cube[1][indices[0]][indices[1]]] = side;
        
        
        
        
        let D = [];
        
        console.log(cube[2]);
        
        for (let [side, indices] of Object.entries(orientations)) {
            const piece = cube[2][indices[0]][indices[1]];
            if (piece[0] === mainColor) {
                const color = piece[1],
                      properSide = sideColors[color];
                D.push({color, side, properSide});
            }
        }
        
        for (let piece of D) console.log(piece);
        
        let amountOnProperSide = 0;
        for (let piece of D) {
            if (piece.side === piece.properSide)
                amountOnProperSide++;
        }
        
        switch (D.length) {
            case 0:
                console.log("D 0");
                break;
            case 1:
                console.log("D 1");
                break;
            case 2:
                console.log("D 2");
                break;
            case 3:
                console.log("D 3");
                switch (amountOnProperSide) {
                    case 0:
                        console.log(0);
                        break;
                    case 1:
                        console.log(1);
                        for (let amount of turnAmounts) {
                            let temp = turnSide(cube, "D", amount);
                        
                            let tempD = [];

                            for (let [side, indices] of Object.entries(orientations)) {
                                const piece = temp[2][indices[0]][indices[1]];
                                if (piece[0] === mainColor) {
                                    const color = piece[1],
                                          properSide = sideColors[color];
                                    tempD.push({color, side, properSide});
                                }
                            }

                            for (let piece of tempD) console.log(piece);

                            let tempAmountOnProperSide = 0;
                            for (let piece of tempD) {
                                if (piece.side === piece.properSide)
                                    tempAmountOnProperSide++;
                            }
                            
                            if (tempAmountOnProperSide === 2) {
                                cube = turnSide(cube, "D", amount);
                                moves.push({side: "D", amount});
                            }
                        }
                        
                        
                        break;
                    case 2:
                    case 3:
                        break;
                }
                break;
            case 4:
                console.log("D 4");
                break;
        }*/
        /*
        const orientations = {
            F: [2, 1],
            B: [0, 1],
            L: [1, 0],
            R: [1, 2]
        };
        
        
        
        console.log(cube[2]);
        
        let D = {};
        let middles = {};
        
        for (let [side, indices] of Object.entries(orientations)) {
            const piece = cube[2][indices[0]][indices[1]];
            const middle = cube[1][indices[0]][indices[1]];
            if (piece[0] === mainColor) {
                D[side] = piece[1];
            }
            middles[side] = middle;
        }
        
        console.log(D, middles);*/
    })();
    
    
    
    //return
    if (displayCube) {
        mainCube = cube;
        display();
    }
    
    console.log(moves)
    return moves;
}

function bruteForce(pieces, order, solveFunction) {
    if (solveFunction(pieces)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";
    
    const sideTurnsSansD = sideTurns.filter(turn => turn.face !== "D");
    const sideTurnsSansDLength = sideTurnsSansD.length;
    
    for (let turn of sideTurnsSansD) {
        let cube = Cube.turn(pieces, turn.face, turn.amount);
        if (solveFunction(cube)) return [turn];
    }

    if (order >= 2) {
        let cubeList = [Cube.turn(pieces, "U")];

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {

            const noRepeatedFace = indices.reduce((prev, index) => {
                if (prev === false) return false;
                else if (sideTurnsSansD[prev].face === sideTurnsSansD[index].face) return false;
                return index;
            });

            if (noRepeatedFace) {
                let turn = sideTurnsSansD[indices[1]];
                let cube = Cube.turn(cubeList[0], turn.face, turn.amount);

                if (solveFunction(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        let turn = sideTurnsSansD[index];
                        moves.push(turn);
                    }
                    return moves;
                }
            }

            for (i = 2; i--;) {
                if (indices[i] < sideTurnsSansDLength - 1) {
                    indices[i]++;
                    break;
                }
                if (noRepeatedFace) {
                    if (i === 1 && indices[0] < sideTurnsSansDLength - 1) {
                        let turn = sideTurnsSansD[indices[0] + 1];
                        cubeList[0] = Cube.turn(pieces, turn.face, turn.amount);
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
                else if (sideTurnsSansD[prev].face === sideTurnsSansD[index].face) return false;
                return index;
            });

            if (noRepeatedSide !== false) {
                let turn = sideTurnsSansD[indices[subOrder - 1]];
                let cube = Cube.turn(cubeList[subOrder - 2], turn.face, turn.amount);
                if (solveFunction(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        let turn = sideTurnsSansD[index];
                        moves.push(turn);
                    }
                    return moves;
                }
            }
            for (i = subOrder; i--;) {
                if (indices[i] < sideTurnsSansDLength - 1) {
                    indices[i]++;
                    break;
                }

                if (i === 1 && indices[0] < sideTurnsSansDLength - 1) {
                    const turn = sideTurnsSansD[indices[0] + 1];
                    cubeList[0] = Cube.turn(pieces, turn.face, turn.amount);
                }
                for (let j = 0; j < subOrder - 2; j++) {
                    if (i === j + 2 && indices[j + 1] < sideTurnsSansDLength - 1) {
                        
                        const turn = sideTurnsSansD[indices[j + 1] + 1];
                        cubeList[j + 1] = Cube.turn(cubeList[j], turn.face, turn.amount);
                    }
                }
                
                indices[i] = 0;
            }
        }
    }

    return null;
}