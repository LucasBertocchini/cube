"use strict";

let sideIndices = [
    {face: "B", indices: [0, 1], color: "g"},
    {face: "L", indices: [1, 0], color: "l"},
    {face: "R", indices: [1, 2], color: "r"},
    {face: "F", indices: [2, 1], color: "b"}
];

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
    turnsSansLength = turnsSans.length,
    positions = (() => {
        let result = [];
        for (let side of sideIndices)
            result.push(side.indices);
        return result;
    })();

function cross(cube, mainColor, moves) {
    if (crossSolved(cube.pieces, mainColor, 2)) return;

    const edges = new Edges(cube.pieces);
    const bruteForce3 = bruteForceEdges(edges.pieces, cross3, 5, mainColor);

    let turnSet;
    if (bruteForce3)
        if (bruteForce3.length) {
            let copy = edges.copy();
            for (const turn of bruteForce3)
                copy.turn(turn.face, turn.amount);

            const bruteForce1 = bruteForceEdges(copy.pieces, crossSolved, 4, mainColor);
            if (bruteForce1) {
                const lastMove3 = bruteForce3[bruteForce3.length - 1],
                    firstMove1 = bruteForce1[0];
                let repeatedFace = (lastMove3.face === firstMove1.face);

                if (repeatedFace) {
                    const netAmount = lastMove3.amount + firstMove1.amount;
                    bruteForce3.pop();
                    bruteForce1.shift();

                    if (netAmount % 4 === 0) {
                        const effectiveAmount = (() => {
                            switch(netAmount) {
                                case 1, 2, -1:
                                    return netAmount;
                                case -2:
                                    return 2;
                                case 3:
                                    return -1;
                                default:
                                    throw "unexpected net amount: " + netAmount;
                            }
                        })();
                        bruteForce3.push({
                            face: lastMove3.face,
                            amount: effectiveAmount
                        });
                    }
                }

                const bruteForceMoves = bruteForce3.concat(bruteForce1);
                turnSet = bruteForceMoves;
            } else throw "brute force edges failed";
        } else {
            const bruteForce1 = bruteForceEdges(edges.pieces, crossSolved, 4, mainColor);
            if (bruteForce1)
                turnSet = bruteForce1;
            else throw "brute force edges failed";
        }
    else throw "brute force edges failed";

    for (const turn of turnSet) {
        moves.push(turn);
        cube.turn(turn.face, turn.amount);
    }

    const lastMove = turnSet[turnSet.length - 1];

    const toD = bringToD(cube, lastMove);
    if (toD)
        for (const turn of toD) {
            moves.push(turn);
            cube.turn(turn.face, turn.amount);
        }
    else throw "bringing to D failed";
}



function bruteForceEdges(edges, solveFunction, order, mainColor) {
    if (solveFunction(edges, mainColor)) return [];
    if (order < 1) throw "brute force order must be an integer >= 1";

    for (const turn of turnsSans) {
        const cube = Edges.turn(edges, turn.face, turn.amount);
        if (solveFunction(cube, mainColor))
            return [turn];
    }

    if (order >= 2) {
        for (const turn1 of turnsSans) {
            const cube1 = Edges.turn(edges, turn1.face, turn1.amount);
            for (const turn2 of turnsSans) {
                if (turn1.face === turn2.face) continue;
                const cube = Edges.turn(cube1, turn2.face, turn2.amount);

                if (solveFunction(cube, mainColor))
                    return [turn1, turn2];
            }
        }
    }

    for (let suborder = 3; suborder <= order; suborder++) {
        const s = suborder - 1,
            firstTurn = turnsSans[0];
        let turnsList = Array(suborder).fill(firstTurn);

        let cubeList = [edges];
        //cubeList holds values of the cube after each turn of the j-th index-th turnsSans
        //such that cubeList[j + 1] = Edges.turn(cubeList[j], turnsSans[indices[j]].face, turnsSans[indices[j]].amount)
        //for 0 <= j < suborder, and cubeList[0] := edges

        for (let i = 0; i < s; i++)
            cubeList.push(Edges.turn(
                cubeList[i], firstTurn.face, firstTurn.amount
            ));

        let indices = Array(suborder).fill(0);

        for (let i = suborder; i >= 0;) {
            const moveIsValid = noRepeatedFace(suborder, indices, mainColor) &&
                UOrToUEveryTwoMoves(suborder, indices, cubeList, mainColor);

            if (moveIsValid) {
                const lastTurn = turnsSans[indices[s]],
                    cube = Edges.turn(cubeList[s], lastTurn.face, lastTurn.amount);

                if (solveFunction(cube, mainColor)) {
                    let moves = [];
                    for (const index of indices) {
                        const turn = turnsSans[index];
                        moves.push(turn);
                    }
                    return moves;
                }
            }

            let range = suborder;
            for (i = suborder; i--;) {
                //the i-- assures that i !== suborder
                range--;

                if (indices[i] < turnsSansLength - 1) {
                    indices[i]++;
                    break;
                }
                indices[i] = 0;
            }

            for (let j = range; j < s; j++) {
                const turn = turnsSans[indices[j]];
                cubeList[j + 1] = Edges.turn(cubeList[j], turn.face, turn.amount);
            }
        }
    }

    return null;
}

function noRepeatedFace(suborder, indices, mainColor) {
    for (let j = 1; j < suborder; j++)
        if (turnsSans[indices[j]].face === turnsSans[indices[j - 1]].face)
            return false;
    return true;
}

function UOrToUEveryTwoMoves(suborder, indices, cubeList, mainColor) {
    const firstTurn = turnsSans[indices[0]];
    let lastU = (firstTurn.face !== "U") ? 1 : 0;

    let copy = deepCopy(cubeList);

    let prev = copy[0],
        next = copy[1],
        lastToU = (countU(next, mainColor) > countU(prev, mainColor)) ? 0 : 1,
        lastOffU = {
            howLongAgo: (countU(next, mainColor) < countU(prev, mainColor)) ? 0 : 1,
            turn: firstTurn
        };

    for (let j = 1; j < suborder; j++) {
        const index = indices[j],
            turn = turnsSans[index];

        //lastU
        if (turn.face !== "U") lastU++;
        else lastU = 0;

        //lastToU
        prev = next;
        if (j < suborder - 1) next = copy[j + 1];
        //a major optimization may be to change this line ^ to:
        //next = Edges.turn(next, turn.face, turn.amount);

        const countPrev = countU(prev, mainColor),
            countNext = countU(next, mainColor);
        if (countNext > countPrev) lastToU = 0;
        else lastToU++;

        lastOffU
        if (countNext < countPrev)
            lastOffU = {
                howLongAgo: 0,
                turn: turnsSans[index]
            };
        else lastOffU.howLongAgo++;

        const inverseAmount = amount => (amount === 2) ? 2 : -amount,
            lastOffUTurn = lastOffU.turn,
            lastOffUValid = ((lastOffU.howLongAgo === 2) &&
                (turn.face === lastOffUTurn.face) &&
                (inverseAmount(turn.amount) === lastOffUTurn.amount)
            );

        if (lastU >= 2 && lastToU >= 2 && lastOffUValid)
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

function cross3(pieces, mainColor) {
    return (countU(pieces, mainColor) >= 3);
}

function crossSolved(pieces, mainColor, layer = 0) {
    const face = pieces[layer];
    for (let [i, j] of positions) {
        const line = face[i],
            piece = line[j],
            color1 = piece[0];
        if (color1 !== mainColor) return false;
    }
    return true;
}

function bringToD(cube, lastMove) {
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
    const permutations = permute(colorsSans);

    for (let i = 0; i < permutations.length; i++) {
        const permutation = permutations[i];
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
                let copy = deepCopy(newCube);
                for (let amount of turnAmounts) {
                    newCube = Cube.turn(copy, "U", amount);
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
            if (lastMove && turns[0].face === lastMove.face && turns[0].amount === lastMove.amount)
                continue;
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