"use strict";

const turnsSansD = Turns.calcTurns(
    faces.sides.filter(side => side !== "D")
);

function cross(turns, solveFrom) {
    const
    cube = turns.cube,
    mainColor = solveFrom.colors.main,
    edges = new Edges(cube.pieces),
    count = countU(edges.pieces, mainColor);

    let turnList = [];

    switch (count) {
        case 0:
            cross1(edges, mainColor, solveFrom, turnList);
            break;
        case 1:
            cross2(edges, mainColor, solveFrom, turnList);
            break;
        case 2:
            cross3(edges, mainColor, solveFrom, turnList);
            break;
        case 3:
            cross4(edges, mainColor, solveFrom, turnList);
            break;
        case 4:
            break;
        default:
            throw "wrong count";
    }

    if (turnList.length) {
        const shortestTurnList = turnList.reduce(
            (a, b) => (a.length - b.length > 0) ? b : a
        );
        if (shortestTurnList.length)
            turns.turn(...shortestTurnList);
    }

    const
    toD = bringToD(cube, solveFrom),
    shortestToD = toD.reduce(
        (a, b) => (a.length - b.length > 0) ? b : a
    );
    turns.turn(...shortestToD);
}

function countU(pieces, mainColor) {
    const U = pieces[0];
    let count = 0;
    for (let [i, j] of cube3.edgeIndices) {
        const line = U[i],
            piece = line[j],
            color1 = piece[0];
        if (color1 === mainColor) count++;
    }
    return count;
}
function crossU(n) {
    return (pieces, mainColor) => countU(pieces, mainColor) >= n;
}

function cross1(cube, mainColor, solveFrom, turnList) {
    const bruteForce1 = bruteForceEdges(cube.pieces, crossU(1), mainColor);

    for (const turnList1 of bruteForce1) {
        const copy1 = cube.copy();
        copy1.turn(...turnList1);

        cross2(copy1, mainColor, solveFrom, turnList, turnList1);
    }
}
function cross2(cube, mainColor, solveFrom, turnList, turnList1 = []) {
    const bruteForce2 = bruteForceEdges(cube.pieces, crossU(2), mainColor);

    for (const turnList2 of bruteForce2) {
        const copy2 = cube.copy();
        copy2.turn(...turnList2);

        cross3(copy2, mainColor, solveFrom, turnList, turnList1.concat(turnList2));
    }
}
function cross3(cube, mainColor, solveFrom, turnList, turnList12 = []) {
    const bruteForce3 = bruteForceEdges(cube.pieces, crossU(3), mainColor);

    if (bruteForce3)
        for (const turnList3 of bruteForce3) {
            const copy3 = cube.copy();
            copy3.turn(...turnList3);
            
            cross4(copy3, mainColor, solveFrom, turnList, turnList12.concat(turnList3));
        }
    else {
        const
        fourEdges = calcFourEdges(cube.pieces, mainColor, solveFrom),
        offendingEdges = orderEdges(fourEdges.offending),
        inPlaceEdges = orderEdges(fourEdges.inPlace),
        inPlaceLine = (() => {
            const
            i0 = inPlaceEdges[0].indices,
            i1 = inPlaceEdges[1].indices;

            if (sharesElements(i0, i1, 2))
                if (inPlaceEdges[0].face === "L")
                    return "horizontal";
                else
                    return "vertical";

            return false;
        })(),
        offendingLine = (() => {
            const
            i0 = offendingEdges[0].indices,
            i1 = offendingEdges[1].indices,
            sharesEdgeElement = (i0, i1) => {
                for (let i = 0; i < 3; i++)
                    if (i0[i] === 1 && i0[i] === i1[i])
                        return true;
                return false;
            };

            if (sharesEdgeElement(i0, i1))
                if (offendingEdges[0].face === "L")
                    return "horizontal";
                else
                    return "vertical";

            return false;
        })(),
        f0 = offendingEdges[0].face,
        f1 = offendingEdges[1].face,
        top0 = offendingEdges[0].indices[0] === 0,
        top1 = offendingEdges[1].indices[0] === 0;

        let turns3;

        if (inPlaceLine)
            if (offendingLine) {
                const
                c0 = faces.clockwise["U"][f0],
                c1 = faces.clockwise["U"][f1];

                if (top0)
                    if (top1)
                        turns3 = `${f0} ${f1} U ${c0} ${c1}`;
                    else if (f0 === f1)
                        turns3 = `${f0} U ${c0}' ${faces.opposite[c0]}`;
                    else
                        turns3 = `${f0}' ${f1} U ${c0}' ${c1}'`;
                else if (top1)
                    if (f0 === f1)
                        turns3 = `${f0} U ${c0}' ${faces.opposite[c0]}`;
                    else
                        turns3 = `${f0} ${f1}' U ${c0}' ${c1}'`;
                else
                    switch(f0 === "L" || f0 === "R") {
                        case (inPlaceLine === "vertical"):
                            turns3 = `${f0} ${f1} U ${c0}' ${c1}'`;
                            break;
                        default:
                            turns3 = `${f0} ${c0}' ${f0}' ${f1} ${c1}' ${f1}'`;
                    }
            }
            else if (top0)
                turns3 = `${f0}' U' ${f1}' U ${f0}`;
            else if (top1)
                turns3 = `${f1} U ${f0} U' ${f1}'`;
            else
                switch (f0 === "L" || f0 === "R") {
                    case (inPlaceLine === "vertical"):
                        turns3 = `${f0} U' ${f1}' U ${f0}`;
                        break;
                    default:
                        turns3 = `${f1}' U ${f0} U' ${f1}'`;
                }
        else
            turns3 = `U2 ${f0} ${f1}' ${f0}`;

        const turnList3 = Turns.turnsToTurn(turns3);
        turnList.push(turnList12.concat(turnList3));
    }
}
function cross4(cube, mainColor, solveFrom, turnList, turnList123 = []) {
    const
    openSpot = (cube => {
        for (const i of cube3.edgeIndices) {
            const
            indices = [0, ...i],
            piece = cube.indices(indices),
            color = piece[0];

            if (color !== mainColor)
                for (const [face, centerIndices] of Object.entries(cube3.centerIndices))
                    if (sharesElements(indices, centerIndices, 2)) {
                        const faces = Object.values(solveFrom.faces);
                        if (!faces.includes(face))
                            return {indices, face};
                    }
        }
    })(cube),
    offendingPiece = (pieces => {
        const edgeArray = [0, 1, 2];

        for (const i of edgeArray) {
            const plane = pieces[i];
            for (const j of edgeArray) {
                const line = plane[j];
                for (const k of edgeArray) {
                    const piece = line[k];

                    if (!piece) continue;

                    if (piece.includes(mainColor))
                        if (!(piece[0] === mainColor && i === 0)) {
                            const
                            indices = [i, j, k],
                            omit = Object.values(solveFrom.faces);

                            let faceList = faces.indices(indices)
                                .filter(face => !omit.includes(face));

                            if (faceList.length > 1) {
                                const
                                f0 = faceList[0],
                                f1 = faceList[1],
                                condition1 = faces.indices[f0] > faces.indices[f1],
                                condition2 = piece[0] === mainColor;

                                if (!condition1 && !condition2)
                                    faceList = [f1, f0];
                            }

                            return {indices, faces: faceList, piece};
                        }
                }
            }
        }
    })(cube.pieces),
    f0 = openSpot.face,
    f1 = offendingPiece.faces[0],
    layer = offendingPiece.indices[0],
    angle = faces.angle("U")(f0, f1); 

    let turns4;

    switch (layer) {
        case 0:
            const cc0 = faces.counterclockwise["U"][f0];
            turns4 = `${f0} U' ${cc0}`;
            break;

        case 1:
            const
            f2 = offendingPiece.faces[1],
            c0 = faces.clockwise["U"][f0];

            switch(angle) {
                case 0:
                    if (f2 === c0)
                        turns4 = `U ${f2}'`;
                    else
                        turns4 = `U' ${f2}`;
                    break;
                case 1:
                    if (f2 === f0)
                        turns4 = `${f0}`;
                    else
                        turns4 = `U2 ${faces.opposite[f0]}'`;
                    break;
                case -1:
                    if (f2 === f0)
                        turns4 = `${f0}'`;
                    else
                        turns4 = `U2 ${faces.opposite[f0]}`;
                    break;
                case 2:
                    if (f2 === c0)
                        turns4 = `U ${f2}`;
                    else
                        turns4 = `U' ${f2}'`;
                    break;
                default:
                    throw "wrong angle between faces";
            }
            break;
        
        case 2:
            const
            c1 = faces.clockwise["U"][f1],
            color = offendingPiece.piece[0];

            if (color === mainColor)
                switch (angle) {
                    case 0:
                        turns4 = `${f1}2`;
                        break;
                    case 1:
                        turns4 = `U ${f1}2`;
                        break;
                    case -1:
                        turns4 = `U' ${f1}2`;
                        break;
                    case 2:
                        turns4 = `U2 ${f1}2`;
                        break;
                    default:
                        throw "wrong angle";
                }
            else
                switch (angle) {
                    case 0:
                        turns4 = `${f1} U ${c1}'`;
                        break;
                    case 1:
                        turns4 = `${f1}' ${f0} ${f1}`;
                        break;
                    case -1:
                        turns4 = `${f1} ${f0}' ${f1}'`;
                        break;
                    case 2:
                        turns4 = `U2 ${f1} U ${c1}'`;
                        break;
                    default:
                        throw "wrong angle";
                }
            break;

        default:
            throw "wrong layer";
    }

    const turnList4 = Turns.turnsToTurn(turns4);
    turnList.push(turnList123.concat(turnList4));
}

function bruteForceEdges(pieces, solveFunction, mainColor) {
    if (solveFunction(pieces, mainColor)) return [];

    let turnList = [];

    for (const turn of turnsSansD) {
        const newPieces = Edges.turn(pieces, turn);
        if (solveFunction(newPieces, mainColor))
            turnList.push([turn]);
    }

    if (turnList.length) return turnList;

    for (const turn1 of turnsSansD) {
        const newPieces1 = Edges.turn(pieces, turn1);
        for (const turn2 of turnsSansD) {
            if (turn1.face === turn2.face) continue;
            const newPieces2 = Edges.turn(newPieces1, turn2);

            if (solveFunction(newPieces2, mainColor))
                turnList.push([turn1, turn2])
        }
    }

    if (turnList.length) return turnList;
    return null;
}
function calcFourEdges(pieces, mainColor, solveFrom) {
    const edgeArray = [0, 1, 2];
    let fourEdges = {
        offending: [],
        inPlace: []
    };

    for (const i of edgeArray) {
        const plane = pieces[i];
        for (const j of edgeArray) {
            const line = plane[j];
            for (const k of edgeArray) {
                const piece = line[k];

                if (!piece) continue;

                if (piece.includes(mainColor)) {
                    const
                    indices = [i, j, k],
                    faceList = faces.indices(indices),
                    omit = Object.values(solveFrom.faces);

                    for (const face of faceList)
                        if (!omit.includes(face))
                            if (piece[0] === mainColor && i === 0)
                                fourEdges.inPlace.push({piece, indices, face});
                            else
                                fourEdges.offending.push({piece, indices, face});
                }
            }
        }
    }

    return fourEdges;
}
function orderEdges(edgeList) {
    const
    p0 = edgeList[0],
    p1 = edgeList[1],
    oppositeOrder = [p1, p0],
    f0 = p0.face,
    f1 = p1.face;

    if (faces.clockwise["U"][f0] === f1)
        return edgeList;
    if (faces.counterclockwise["U"][f0] === f1)
        return oppositeOrder;
    if (f0 === "B" || f0 === "L")
        return edgeList;
    return oppositeOrder;
}

function bringToD(cube, solveFrom) {
    const
    facesSans = faces.sides.filter(
        side => !Object.values(solveFrom.faces).includes(side)
    ),
    colorsSans = (faces => {
        let colorsSans = [];
        for (const face of faces) {
            const color = cube3.centerColor(cube, face);
            colorsSans.push(color);
        }
        return colorsSans;
    })(facesSans),
    permutations = permute(colorsSans);

    let turnsList = [];

    for (const i in permutations) {
        const
        permutation = permutations[i],
        copy = cube.copy();
        turnsList.push([]);

        for (const centerColor of permutation) {
            const
            centerFace = (centerColor => {
                for (const face of faces.sides) {
                    const color = cube3.centerColor(cube, face);
                    if (centerColor === color)
                        return face;
                }
            })(centerColor),
            edge = (() => {
                const edgeArray = [0, 1, 2];
                for (const i of edgeArray) {
                    const plane = copy.pieces[i];
                    for (const j of edgeArray) {
                        const line = plane[j]
                        for (const k of edgeArray) {
                            const piece = line[k];

                            if (!piece) continue;

                            if (isSamePiece(piece, centerColor + solveFrom.colors.main))
                                return {piece, indices: [i, j, k]};
                        }
                    }
                }
            })(),
            edgeFace = faces.indices(edge.indices).filter(face => face !== "U")[0],
            edgeColor = edge.piece[1],
            angle = faces.angle("U")(centerFace, edgeFace),
            turnU = (angle === 0) ? null : {
                face: "U",
                amount: Turns.oppositeAmount(angle)
            },
            turn = {face: centerFace, amount: 2};

            if (turnU) {
                turnsList[i].push(turnU);
                copy.turn(turnU);
            }
            turnsList[i].push(turn);
            copy.turn(turn);
        }
    }

    return turnsList;
}