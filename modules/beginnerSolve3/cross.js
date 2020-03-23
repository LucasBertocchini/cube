"use strict";

const sidesSans = sides.filter(side => side !== "D"),
    turnsSans = (() => {
        let result = [];
        sidesSans.forEach(face => 
            turnAmounts.forEach(
                amount => result.push({face, amount})
            )
        );
        return result;
    })(),
    turnsSansLength = turnsSans.length;

const positions = [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1]
];

let sideIndices = [
    {face: "B", indices: [0, 1], color: "g"},
    {face: "L", indices: [1, 0], color: "l"},
    {face: "R", indices: [1, 2], color: "r"},
    {face: "F", indices: [2, 1], color: "b"}
];

function cross(cube, mainColor, moves) {
    let edges = new Edges(cube.pieces);
    const bruteForce = bruteForceEdges(edges.pieces, 5, mainColor);
    if (bruteForce) {
        for (const turn of bruteForce) {
            moves.push(turn);
            cube.turn(turn.face, turn.amount);
        }
    } else throw "brute force edges failed";

    const toD = bringToD(cube);
    if (toD) {
        for (const turn of toD) {
            moves.push(turn);
            cube.turn(turn.face, turn.amount);
        }
    } else throw "bringing to D failed";
}

function bruteForceEdges(edges, order, mainColor) {
    if (crossSolved(edges)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (const turn of turnsSans) {
        const cube = Edges.turn(edges, turn.face, turn.amount);
        if (crossSolved(cube, mainColor)) return [turn];
    }

    if (order >= 2) {
        for (const turn1 of turnsSans) {
            const cube1 = Edges.turn(edges, turn1.face, turn1.amount);
            for (const turn2 of turnsSans) {
                if (turn1.face === turn2.face) continue;
                const cube = Edges.turn(cube1, turn2.face, turn2.amount);

                if (crossSolved(cube, mainColor))
                    return [turn1, turn2];
            }
        }
    }

    for (let suborder = 3; suborder <= order; suborder++) {
        const s = suborder - 1;

        //cubeList holds values of the cube after each turn of the j-th index-th turnsSans
        //such that cubeList[j + 1] = Edges.turn(cubeList[j], turnsSans[indices[j]].face, turnsSans[indices[j]].amount)
        //for 0 <= j < suborder, and cubeList[0] := edges
        let cubeList = [edges];
        for (let i = 0; i < s; i++)
            cubeList.push(Edges.turn(cubeList[i], "U"));

        let indices = Array(suborder).fill(0),
            prev = [...indices];
        for (let i = suborder; i >= 0;) {
            for (i = suborder; i--;) {

                if (indices[i] < turnsSansLength - 1) {
                    indices[i]++;

                    let moveIsValid = noRepeatedFace(suborder, indices, mainColor) &&
                        UOrToUEveryTwoMoves(suborder, indices, cubeList, mainColor);

                    if (moveIsValid) {
                        for (let j = 0; j < s; j++) {
                            if (indices[j] !== prev[j]) {
                                const turn = turnsSans[indices[j]];
                                cubeList[j + 1] = Edges.turn(cubeList[j], turn.face, turn.amount); 
                            }
                        }

                        const lastTurn = turnsSans[indices[s]],
                            cube = Edges.turn(cubeList[s], lastTurn.face, lastTurn.amount);

                        if (crossSolved(cube, mainColor)) {
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

function noRepeatedFace(suborder, indices, mainColor) {
    for (let j = 1; j < suborder; j++) {
        if (turnsSans[indices[j]].face === turnsSans[indices[j - 1]].face)
            return false;
    }
    return true;
}

function UOrToUEveryTwoMoves(suborder, indices, cubeList, mainColor) {
    const firstTurn = turnsSans[indices[0]];
    let lastU = (firstTurn.face !== "U") ? 1 : 0;

    let prev = cubeList[0],
        next = cubeList[1],
        lastToU = (countU(next, mainColor) > countU(prev, mainColor)) ? 0 : 1;

    for (let j = 1; j < suborder; j++) {
        const index = indices[j],
            turn = turnsSans[index];

        if (turn.face !== "U") lastU++;
        else lastU = 0;

        prev = next;
        if (j < suborder - 1) next = cubeList[j + 1];
        //a major optimization may be to change this line to:
        // next = cubeList[j + 1] || Edges.turn(next, turn.face, turn.amount);

        const countPrev = countU(prev, mainColor),
            countNext = countU(next, mainColor);

        if (countNext > countPrev) lastToU = 0;
        else lastToU++;

        if (lastU >= 2 && lastToU >= 2)
            return false;
    }
    return true;
}

function countU(pieces, mainColor) {
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

function crossSolved(pieces, mainColor) {
    const U = pieces[0];
    for (let [i, j] of positions) {
        const line = U[i],
            piece = line[j],
            color1 = piece[0];
        if (color1 !== mainColor) return false;
    }

    return true;
}

function bringToD(cube) {
    let colorsSans = [];
    for (let value of sideIndices) {
        const i = value.indices,
            i0 = i[0],
            i1 = i[1],
            color = cube.pieces[1][i0][i1];
        value.color = color;
        colorsSans.push(color);
    };

    let movesSet = [];
    const permutationList = permutations(colorsSans);

    for (let i = 0; i < permutationList.length; i++) {
        const permutation = permutationList[i];
        movesSet.push([]);
        let newCube = cube.pieces;

        for (let color of permutation) {

            const pos = color => {
                    for (let value of sideIndices)
                        if (value.color === color)
                            return value;
                },
                posColor = pos(color),
                indices = posColor.indices,
                i0 = indices[0],
                i1 = indices[1],
                piece = newCube[0][i0][i1],
                pieceColor = piece[1];

            if (pieceColor === color) {
                const face = posColor.face,
                    turn = {face, amount: 2};
                movesSet[i].push(turn);
            } else {
                for (let amount of turnAmounts) {
                    newCube = Cube.turn(newCube, "U", amount);
                    let newPiece = newCube[0][i0][i1],
                        newPieceColor = newPiece[1];

                    if (newPieceColor === color) {
                        movesSet[i].push({face: "U", amount})
                        const face = posColor.face,
                            turn = {face, amount: 2};
                        movesSet[i].push(turn);
                        break;
                    }
                }
            }
        }
    }

    const minimumLength = (() => {
        let min = Infinity;
        for (const turns of movesSet) {
            let length = turns.length;
            if (length < min) min = length;
        }
        return min;
    })();

    for (const turns of movesSet) {
        if (turns.length === minimumLength)
            return turns;
    }
}
