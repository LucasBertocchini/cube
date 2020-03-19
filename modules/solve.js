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
        const bf = bruteForceEdges(edges.pieces, 3, solveFunction)
        if (bf) {
            for (let turn of bf) {
                moves.push(turn);
                cube.turn(turn.face, turn.amount);
            }
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

function bruteForceEdges(edges, order, solveFunction) {

    const sidesSansD = sides.filter(side => side !== "D");
    const turns = (() => {
        let temp = [];
        sidesSansD.forEach(face => 
            turnAmounts.forEach(
                amount => temp.push({face, amount})
            )
        );
        return temp;
    })(),
        turnsLength = turns.length;

    if (solveFunction(edges)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (const turn of turns) {
        const cube = Edges.turn(edges, turn.face, turn.amount);
        if (solveFunction(cube)) return [turn];
    }

    if (order >= 2) {
        for (const turn1 of turns) {
            const cube1 = Edges.turn(edges, turn1.face, turn1.amount);
            for (const turn2 of turns) {
                if (turn1.face === turn2.face) continue;
                const cube = Edges.turn(cube1, turn2.face, turn2.amount);

                if (solveFunction(cube))
                    return [turn1, turn2];
            }
        }
    }

    for (let suborder = 3; suborder <= order; suborder++) {
        let cubeList = [edges];
        let count = 0;

        for (let i = 0; i < suborder - 1; i++)
            cubeList.push(Edges.turn(cubeList[i], "U"));

        let indices = Array(suborder).fill(0);
        for (let i = suborder; i >= 0;) {
            for (i = suborder; i--;) {

                if (indices[i] < turnsLength - 1) {
                    indices[i]++;

                    let UInLastTwoMoves = () => {
                        let lastU = 0;
                        for (let j = 0; j < suborder; j++) {
                            const index = indices[j];

                            if (turns[index].face !== "U" && turns[index].face !== "L") lastU++;
                            else lastU = 0;

                            if (lastU >= 2)
                                return false;
                        }
                        return true;
                    }

                    let noRepeatedFace = () => {
                        for (let j = 1; j < suborder; j++) {
                            if (turns[indices[j]].face === turns[indices[j - 1]].face)
                                return false;
                        }
                        return true;
                    }

                    let valid = UInLastTwoMoves() && noRepeatedFace();

                    if (valid) {
                        console.log(indices);
                        count++;





                        if (indices[suborder - 1] === 0 || indices[suborder - 1] === 3) {
                            for (let j = 0; j < suborder - 1; j++) {
                                const turn = turns[indices[j]];
                                cubeList[j + 1] = Edges.turn(cubeList[j], turn.face, turn.amount);
                            }
                        }



                        const s = suborder - 1,
                            turn = turns[indices[s]],
                            cube = Edges.turn(cubeList[s], turn.face, turn.amount);

                        if (solveFunction(cube)) {
                            let moves = [];
                            for (let index of indices) {
                                const turn = turns[index];
                                moves.push(turn);
                            }
                            return moves;
                        }
                    }




                    break;
                }
                indices[i] = 0;
            }
            
            //if (indices[0] === 5) console.log("count " + count) //545
        }
        console.log("final count " + count) //2284
    }
    return null;
}