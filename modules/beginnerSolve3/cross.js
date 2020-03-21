"use strict";

function cross(cube, mainColor, moves) {
    const sidesSans = sides.filter(side => side !== "D"),
        turnsSans = (() => {
            let temp = [];
            sidesSans.forEach(face => 
                turnAmounts.forEach(
                    amount => temp.push({face, amount})
                )
            );
            return temp;
        })(),
        turnsSansLength = turnsSans.length;

    const positions = [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 1]
    ];

    let edges = new Edges(cube.pieces);
    console.log(edges);
    const bf = bruteForceEdges(edges.pieces, 5)
    if (bf) {
        for (let turn of bf) {
            moves.push(turn);
            cube.turn(turn.face, turn.amount);
        }
    }

    function bruteForceEdges(edges, order) {
        if (crossSolved(edges)) return [];
        if (order < 1) throw "brute force order must be an integer >= 1";

        for (const turn of turnsSans) {
            const cube = Edges.turn(edges, turn.face, turn.amount);
            if (crossSolved(cube)) return [turn];
        }

        if (order >= 2) {
            for (const turn1 of turnsSans) {
                const cube1 = Edges.turn(edges, turn1.face, turn1.amount);
                for (const turn2 of turnsSans) {
                    if (turn1.face === turn2.face) continue;
                    const cube = Edges.turn(cube1, turn2.face, turn2.amount);

                    if (crossSolved(cube))
                        return [turn1, turn2];
                }
            }
        }

        for (let suborder = 3; suborder <= order; suborder++) {
            const s = suborder - 1;

            //cubeList holds values of the cube after each turn of the j-th index-th turnsSans
            //such that cubeList[j + 1] = Edges.turn(cubeList[j], turnsSans[indices[j]].face, turnsSans[indices[j]].amount)
            //for 0 <= j < suborder, and cubeList[0] is always edges
            let cubeList = [edges];
            for (let i = 0; i < s; i++)
                cubeList.push(Edges.turn(cubeList[i], "U"));

            let indices = Array(suborder).fill(0),
                prev = [...indices];
            for (let i = suborder; i >= 0;) {
                for (i = suborder; i--;) {

                    if (indices[i] < turnsSansLength - 1) {
                        indices[i]++;

                        let moveIsValid = noRepeatedFace(suborder, indices) &&
                            UOrToUEveryTwoMoves(suborder, indices, cubeList);

                        if (moveIsValid) {
                            for (let j = 0; j < s; j++) {
                                if (indices[j] !== prev[j]) {
                                    const turn = turnsSans[indices[j]];
                                    cubeList[j + 1] = Edges.turn(cubeList[j], turn.face, turn.amount); 
                                }
                            }

                            const lastTurn = turnsSans[indices[s]],
                                cube = Edges.turn(cubeList[s], lastTurn.face, lastTurn.amount);

                            if (crossSolved(cube)) {
                                let moves = [];
                                for (let index of indices) {
                                    const turn = turnsSans[index];
                                    moves.push(turn);
                                }
                                return moves;
                            }

                            prev = [...indices];
                        }

                        break;
                    }

                    indices[i] = 0;
                }
            }
        }

        return null;
    }

    function noRepeatedFace(suborder, indices) {
        for (let j = 1; j < suborder; j++) {
            if (turnsSans[indices[j]].face === turnsSans[indices[j - 1]].face)
                return false;
        }
        return true;
    }

    function UOrToUEveryTwoMoves(suborder, indices, cubeList) {
        const firstTurn = turnsSans[indices[0]];
        let lastU = (firstTurn.face !== "U") ? 1 : 0;

        let prev = cubeList[0],
            next = cubeList[1],
            lastToU = (countU(next) > countU(prev)) ? 0 : 1;

        for (let j = 1; j < suborder; j++) {
            const index = indices[j],
                turn = turnsSans[index];

            if (turn.face !== "U") lastU++;
            else lastU = 0;

            prev = next;
            if (j < suborder - 1) next = cubeList[j + 1];
            //a major optimization may be to change this line to:
            // next = cubeList[j + 1] || Edges.turn(next, turn.face, turn.amount);

            const countPrev = countU(prev),
                countNext = countU(next);

            if (countNext > countPrev) lastToU = 0;
            else lastToU++;

            if (lastU >= 2 && lastToU >= 2)
                return false;
        }
        return true;
    }

    function countU(pieces) {
        const U = pieces[0];
        let count = 0;
        for (let [i, j] of positions) {
            const line = U[i],
                piece = line[j],
                color1 = piece[0];
            if (color1 === mainColor) count++;
        }
        
        return count;
    }

    function crossSolved(pieces) {
        const U = pieces[0];
        for (let [i, j] of positions) {
            const line = U[i],
                piece = line[j],
                color1 = piece[0];
            if (color1 !== mainColor) return false;
        }

        return true;
    }
}