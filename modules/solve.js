"use strict";

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
        const positions = [
            [0, 1],
            [1, 0],
            [1, 2],
            [2, 1]
        ];
        function solveFunction(pieces) {
            
            const U = pieces[0];
            for (let [i, j] of positions) {
                const line = U[i],
                    piece = line[j],
                    color = piece[0];
                if (color !== mainColor) return false;
            }
            
            return true;
        }
        
        let edges = new Edges(cube.pieces);
        console.log(edges);
        const bf = bruteForceEdges(edges.pieces, 4, solveFunction)
        if (bf) {
            for (let turn of bf) {
                moves.push(turn);
                cube.turn(turn.face, turn.amount);
            }
        }

        
        
        
        
        {
            let b;
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
        }
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

    const turns = (() => {
        let temp = [];
        sides.forEach(face => 
            turnAmounts.forEach(
                amount => temp.push({face, amount})
            )
        );
        return temp;
    })(),
        turnsLength = 18;

    for (let turn of turns) {
        let cube = Cube.turn(pieces, turn.face, turn.amount);
        if (solveFunction(cube)) return [turn];
    }

    if (order >= 2) {
        let cubeList = [Cube.turn(pieces, "U")];

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {
            const repeatedFace = (turns[indices[0]].face === turns[indices[1]].face);
            
            if (!repeatedFace) {
                const turn = turns[indices[1]];
                const cube = Cube.turn(cubeList[0], turn.face, turn.amount);

                if (solveFunction(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        const turn = turns[index];
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
                indices[i] = 0;
            }

            if (indices[1] === 0) {
                const turn = turns[indices[0]];
                cubeList[0] = Cube.turn(pieces, turn.face, turn.amount);
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
                const turn = turns[indices[subOrder - 1]];
                const cube = Cube.turn(cubeList[subOrder - 1], turn.face, turn.amount);

                if (solveFunction(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        const turn = turns[index];
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

function bruteForceEdges(pieces, order, solveFunction) {
    if (solveFunction(pieces)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    const turns = (() => {
        let temp = [];
        sides.forEach(face => 
            turnAmounts.forEach(
                amount => temp.push({face, amount})
            )
        );
        return temp;
    })(),
        turnsLength = turns.length;

    for (let turn of turns) {
        let cube = Edges.turn(pieces, turn.face, turn.amount);
        if (solveFunction(cube)) return [turn];
    }

    if (order >= 2) {
        let edgesList = [Edges.turn(pieces, "U")];

        let indices = [0, 0];
        for (let i = 2; i >= 0;) {
            const repeatedFace = (turns[indices[0]].face === turns[indices[1]].face);
            
            if (!repeatedFace) {
                const turn = turns[indices[1]];
                const cube = Edges.turn(edgesList[0], turn.face, turn.amount);

                if (solveFunction(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        const turn = turns[index];
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
                indices[i] = 0;
            }

            if (indices[1] === 0) {
                const turn = turns[indices[0]];
                edgesList[0] = Edges.turn(pieces, turn.face, turn.amount);
            }
        }
    }

    for (let subOrder = 3; subOrder <= order; subOrder++) {
        let edgesList = [pieces];

        for (let i = 0; i < subOrder - 1; i++)
            edgesList.push(Edges.turn(edgesList[i], "U"));

        let indices = Array(subOrder).fill(0);
        for (let i = subOrder; i >= 0;) {

            const repeatedFace = (() => {
                for (let j = 1; j < subOrder; j++)
                    if (turns[indices[j - 1]].face === turns[indices[j]].face) return true;
                return false;
            })();

            if (!repeatedFace) {
                const turn = turns[indices[subOrder - 1]];
                const cube = Edges.turn(edgesList[subOrder - 1], turn.face, turn.amount);

                if (solveFunction(cube)) {
                    let moves = [];
                    for (let index of indices) {
                        const turn = turns[index];
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
                    edgesList[j + 1] = Edges.turn(edgesList[j], turn.face, turn.amount);
                }
            }
        }
    }

    return null;
}