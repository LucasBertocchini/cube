"use strict";

function cross(turns, mainFace, mainColor) {
    const
    cube = turns.cube,
    edges = new Edges(cube.pieces),
    count = countMainColorOnMainFace(edges, mainFace, mainColor);

    let turnList = [];
    
    console.log({count})

    switch (count) {
        case 0:
            cross1(edges, mainFace, mainColor, turnList);
            break;
        case 1:
            cross2(edges, mainFace, mainColor, turnList);
            break;
        case 2:
            cross3(edges, mainFace, mainColor, turnList);
            break;
        case 3:
            cross4(edges, mainFace, mainColor, turnList);
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

    // const
    // toD = bringToD(cube, mainFace, mainColor),
    // shortestToD = toD.reduce(
    //     (a, b) => (a.length - b.length > 0) ? b : a
    // );
    // turns.turn(...shortestToD);
}

function countMainColorOnMainFace(edges, mainFace, mainColor) {
    const
    layer = cube3.layers[mainFace],
    index = faces.index[mainFace];

    let count = 0;

    for (let [i, j] of cube3.edgeIndices) {
        let indices = [i, j];
        indices.splice(index, 0, layer);

        const
        piece = edges.indices(indices),
        color = faces.findColor(indices, piece, mainFace);

        if (color === mainColor) count++;
    }
    return count;
}
function countGreaterThanOrEqualTo(n) {
    return (edges, mainFace, mainColor) => countMainColorOnMainFace(edges, mainFace, mainColor) >= n;
}

function cross1(edges, mainFace, mainColor, turnList) {
    const bruteForce1 = bruteForceEdges(edges, countGreaterThanOrEqualTo(1), mainFace, mainColor);

    for (const turnList1 of bruteForce1) {
        const copy1 = edges.copy();
        copy1.turn(...turnList1);

        cross2(copy1, mainFace, mainColor, turnList, turnList1);
    }
}
function cross2(edges, mainFace, mainColor, turnList, turnList1 = []) {
    const bruteForce2 = bruteForceEdges(edges, countGreaterThanOrEqualTo(2), mainFace, mainColor);

    for (const turnList2 of bruteForce2) {
        const copy2 = edges.copy();
        copy2.turn(...turnList2);

        cross3(copy2, mainFace, mainColor, turnList, turnList1.concat(turnList2));
    }
}
function cross3(edges, mainFace, mainColor, turnList, turnList12 = []) {
    const bruteForce3 = bruteForceEdges(edges, countGreaterThanOrEqualTo(3), mainFace, mainColor);

    if (bruteForce3)
        for (const turnList3 of bruteForce3) {
            const copy3 = edges.copy();
            copy3.turn(...turnList3);
            
            cross4(copy3, mainFace, mainColor, turnList, turnList12.concat(turnList3));
        }
    else {
        const
        fourEdges = calcFourEdges(edges.pieces, mainFace, mainColor),
        offendingEdges = orderEdges(fourEdges.offending, mainFace),
        inPlaceEdges = orderEdges(fourEdges.inPlace, mainFace),
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
                c0 = faces.clockwise[mainFace][f0],
                c1 = faces.clockwise[mainFace][f1];

                if (top0)
                    if (top1)
                        turns3 = `${f0} ${f1} ${mainFace} ${c0} ${c1}`;
                    else if (f0 === f1)
                        turns3 = `${f0} ${mainFace} ${c0}' ${faces.opposite[c0]}`;
                    else
                        turns3 = `${f0}' ${f1} ${mainFace} ${c0}' ${c1}'`;
                else if (top1)
                    if (f0 === f1)
                        turns3 = `${f0} ${mainFace} ${c0}' ${faces.opposite[c0]}`;
                    else
                        turns3 = `${f0} ${f1}' ${mainFace} ${c0}' ${c1}'`;
                else
                    switch(f0 === "L" || f0 === "R") {
                        case (inPlaceLine === "vertical"):
                            turns3 = `${f0} ${f1} ${mainFace} ${c0}' ${c1}'`;
                            break;
                        default:
                            turns3 = `${f0} ${c0}' ${f0}' ${f1} ${c1}' ${f1}'`;
                    }
            } else if (top0)
                turns3 = `${f0}' ${mainFace}' ${f1}' ${mainFace} ${f0}`;
            else if (top1)
                turns3 = `${f1} ${mainFace} ${f0} ${mainFace}' ${f1}'`;
            else
                switch (f0 === "L" || f0 === "R") {
                    case (inPlaceLine === "vertical"):
                        turns3 = `${f0} ${mainFace}' ${f1}' ${mainFace} ${f0}`;
                        break;
                    default:
                        turns3 = `${f1}' ${mainFace} ${f0} ${mainFace}' ${f1}'`;
                }
        else
            turns3 = `${mainFace}2 ${f0} ${f1}' ${f0}`;

        const turnList3 = Turns.turnsToTurn(turns3);
        turnList.push(turnList12.concat(turnList3));
    }
}
function cross4(edges, mainFace, mainColor, turnList, turnList123 = []) {
    const
    openSpot = (edges => {
        for (const i of cube3.edgeIndices) {
            const
            indices = [0, ...i],
            piece = edges.indices(indices),
            color = piece[0];

            if (color !== mainColor)
                for (const [face, centerIndices] of Object.entries(cube3.centerIndices))
                    if (sharesElements(indices, centerIndices, 2)) {
                        const faceList = [mainFace, faces.opposite[mainFace]];
                        if (!faceList.includes(face))
                            return {indices, face};
                    }
        }
    })(edges),
    offendingPiece = (pieces => {
        for (const i of cube3.edgeArray) {
            const plane = pieces[i];
            for (const j of cube3.edgeArray) {
                const line = plane[j];
                for (const k of cube3.edgeArray) {
                    const piece = line[k];

                    if (!piece) continue;

                    if (piece.includes(mainColor))
                        if (!(piece[0] === mainColor && i === 0)) {
                            const
                            indices = [i, j, k],
                            omit = [mainFace, faces.opposite[mainFace]];

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
    })(edges.pieces),
    f0 = openSpot.face,
    f1 = offendingPiece.faces[0],
    layer = offendingPiece.indices[0],
    angle = faces.angle(mainFace)(f0, f1); 

    let turns4;

    switch (layer) {
        case 0:
            const cc0 = faces.counterclockwise[mainFace][f0];
            turns4 = `${f0} ${mainFace}' ${cc0}`;
            break;

        case 1:
            const
            f2 = offendingPiece.faces[1],
            c0 = faces.clockwise[mainFace][f0];

            switch(angle) {
                case 0:
                    if (f2 === c0)
                        turns4 = `${mainFace} ${f2}'`;
                    else
                        turns4 = `${mainFace}' ${f2}`;
                    break;
                case 1:
                    if (f2 === f0)
                        turns4 = `${f0}`;
                    else
                        turns4 = `${mainFace}2 ${faces.opposite[f0]}'`;
                    break;
                case -1:
                    if (f2 === f0)
                        turns4 = `${f0}'`;
                    else
                        turns4 = `${mainFace}2 ${faces.opposite[f0]}`;
                    break;
                case 2:
                    if (f2 === c0)
                        turns4 = `${mainFace} ${f2}`;
                    else
                        turns4 = `${mainFace}' ${f2}'`;
                    break;
                default:
                    throw "wrong angle between faces";
            }
            break;
        
        case 2:
            const
            c1 = faces.clockwise[mainFace][f1],
            color = offendingPiece.piece[0];

            if (color === mainColor)
                switch (angle) {
                    case 0:
                        turns4 = `${f1}2`;
                        break;
                    case 1:
                        turns4 = `${mainFace} ${f1}2`;
                        break;
                    case -1:
                        turns4 = `${mainFace}' ${f1}2`;
                        break;
                    case 2:
                        turns4 = `${mainFace}2 ${f1}2`;
                        break;
                    default:
                        throw "wrong angle";
                }
            else
                switch (angle) {
                    case 0:
                        turns4 = `${f1} ${mainFace} ${c1}'`;
                        break;
                    case 1:
                        turns4 = `${f1}' ${f0} ${f1}`;
                        break;
                    case -1:
                        turns4 = `${f1} ${f0}' ${f1}'`;
                        break;
                    case 2:
                        turns4 = `${mainFace}2 ${f1} ${mainFace} ${c1}'`;
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

function bruteForceEdges(edges, solveFunction, mainFace, mainColor) {
    if (solveFunction(edges, mainFace, mainColor)) return [];

    const turnsSans = Turns.calc(
        faces.sides.filter(side => side !== faces.opposite[mainFace])
    );

    let turnList = [];

    for (const turn of turnsSans) {
        const copy = edges.copy();
        copy.turn(turn);
        if (solveFunction(copy, mainFace, mainColor))
            turnList.push([turn]);
    }

    if (turnList.length) return turnList;

    for (const turn1 of turnsSans) {
        const copy1 = edges.copy();
        copy1.turn(turn1);
        for (const turn2 of turnsSans) {
            if (turn1.face === turn2.face) continue;
            const copy2 = copy1.copy();
            copy2.turn(turn2);

            if (solveFunction(copy2, mainFace, mainColor))
                turnList.push([turn1, turn2])
        }
    }

    if (turnList.length) return turnList;
    return null;
}
function calcFourEdges(pieces, mainFace, mainColor) {
    let fourEdges = {
        offending: [],
        inPlace: []
    };

    for (const i of cube3.edgeArray) {
        const plane = pieces[i];
        for (const j of cube3.edgeArray) {
            const line = plane[j];
            for (const k of cube3.edgeArray) {
                const piece = line[k];

                if (!piece) continue;

                if (piece.includes(mainColor)) {
                    const
                    indices = [i, j, k],
                    faceList = faces.indices(indices),
                    omit = [mainFace, faces.opposite[mainFace]];

                    for (const face of faceList)
                        if (!omit.includes(face))
                            if (faces.findColor(indices, piece, face) === mainColor && i === 0)
                                fourEdges.inPlace.push({piece, indices, face});
                            else
                                fourEdges.offending.push({piece, indices, face});
                }

                // (
                //                     (i === 0            && mainFace === "U") ||
                //                     (i === cubeSize - 1 && mainFace === "D") ||
                //                     (j === 0            && mainFace === "B") ||
                //                     (j === cubeSize - 1 && mainFace === "F") ||
                //                     (k === 0            && mainFace === "L") ||
                //                     (k === cubeSize - 1 && mainFace === "R")
                //                 )
            }
        }
    }

    return fourEdges;
}
function orderEdges(edgeList, mainFace) {
    console.log(edgeList)
    const
    p0 = edgeList[0],
    p1 = edgeList[1],
    oppositeOrder = [p1, p0],
    f0 = p0.face,
    f1 = p1.face;

    if (faces.clockwise[mainFace][f0] === f1)
        return edgeList;
    if (faces.counterclockwise[mainFace][f0] === f1)
        return oppositeOrder;
    if (f0 === "B" || f0 === "L")
        return edgeList;
    return oppositeOrder;
}

function bringToD(cube, mainFace, mainColor) {
    const
    facesSans = faces.sides.filter(
        side => ![mainFace, faces.opposite[mainFace]].includes(side)
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
                            if (isSamePiece(piece, centerColor + mainColor))
                                return {piece, indices: [i, j, k]};
                        }
                    }
                }
            })(),
            edgeFace = faces.indices(edge.indices).filter(face => face !== mainFace)[0],
            edgeColor = edge.piece[1],
            angle = faces.angle(mainFace)(centerFace, edgeFace),
            turnMainFace = (angle === 0) ? null : {
                face: mainFace,
                amount: Turns.oppositeAmount(angle)
            },
            turn = {face: centerFace, amount: 2};

            if (turnMainFace) {
                turnsList[i].push(turnMainFace);
                copy.turn(turnMainFace);
            }
            turnsList[i].push(turn);
            copy.turn(turn);
        }
    }

    return turnsList;
}