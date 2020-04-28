"use strict";

function cross(turns, mainFace, mainColor) {
    const
    cube = turns.cube,
    edges = new Edges(cube.pieces),
    count = countMainColorOnMainFace(edges, mainFace, mainColor);

    let turnList = [];

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

    const
    toOppositeMainFace = bringToOppositeMainFace(cube, mainFace, mainColor),
    shortestToOppositeMainFace = toOppositeMainFace.reduce(
        (a, b) => (a.length - b.length > 0) ? b : a
    );
    turns.turn(...shortestToOppositeMainFace);
}

function countMainColorOnMainFace(edges, mainFace, mainColor) {
    const
    layer = cube3.layers[mainFace],
    index = cube2.index[mainFace];

    let count = 0;

    for (const [i, j] of cube3.edgeIndices) {
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
        condition = face => cube3.sameAxis(face, faces.orthogonal[mainFace]),
        inPlaceLine = (() => {
            const
            i0 = inPlaceEdges[0].indices,
            i1 = inPlaceEdges[1].indices;

            if (sharesElements(i0, i1, 2))
                return (condition(inPlaceEdges[0].face)) ? "horizontal" : "vertical";
            return false;
        })(),
        offendingLine = (() => {
            const
            i0 = offendingEdges[0].indices,
            i1 = offendingEdges[1].indices,
            sharesEdgeElement = ((i0, i1) => {
                for (const i of cube3.edgeArray)
                    if (i0[i] === 1 && i0[i] === i1[i])
                        return true;
                return false;
            })(i0, i1);

            if (sharesEdgeElement)
                return (condition(offendingEdges[0].face)) ? "horizontal" : "vertical";
            return false;
        })(),
        mf = mainFace,
        f0 = offendingEdges[0].face,
        f1 = offendingEdges[1].face,
        index = cube2.index[mainFace],
        main0 = offendingEdges[0].indices[index] === cube3.layers[mainFace],
        main1 = offendingEdges[1].indices[index] === cube3.layers[mainFace],
        axis = (() => {
            const orthogonalFace = faces.orthogonal[mainFace];
            for (const axis of cube2.axes)
                if (axis.includes(orthogonalFace))
                    return axis;
            throw "axis not found";
        })();

        let turns3;

        if (inPlaceLine)
            if (offendingLine) {
                const
                c0 = faces.clockwise[mainFace][f0],
                c1 = faces.clockwise[mainFace][f1];

                if (main0)
                    if (main1)
                        turns3 = `${f0} ${f1} ${mf} ${c0} ${c1}`;
                    else if (f0 === f1)
                        turns3 = `${f0} ${mf} ${c0}' ${faces.opposite[c0]}`;
                    else
                        turns3 = `${f0}' ${f1} ${mf} ${c0}' ${c1}'`;
                else if (main1)
                    if (f0 === f1)
                        turns3 = `${f0} ${mf} ${c0}' ${faces.opposite[c0]}`;
                    else
                        turns3 = `${f0} ${f1}' ${mf} ${c0}' ${c1}'`;
                else
                    switch(axis.includes(f0)) {
                        case (inPlaceLine === "vertical"):
                            turns3 = `${f0} ${f1} ${mf} ${c0}' ${c1}'`;
                            break;
                        default:
                            turns3 = `${f0} ${c0}' ${f0}' ${f1} ${c1}' ${f1}'`;
                    }
            } else if (main0)
                turns3 = `${f0}' ${mf}' ${f1}' ${mf} ${f0}`;
            else if (main1)
                turns3 = `${f1} ${mf} ${f0} ${mf}' ${f1}'`;
            else
                switch (axis.includes(f0)) {
                    case (inPlaceLine === "vertical"):
                        turns3 = `${f0} ${mf}' ${f1}' ${mf} ${f0}`;
                        break;
                    default:
                        turns3 = `${f1}' ${mf} ${f0} ${mf}' ${f1}'`;
                }
        else
            turns3 = `${mf}2 ${f0} ${f1}' ${f0}`;

        const turnList3 = Turns.turnsToTurn(turns3);
        turnList.push(turnList12.concat(turnList3));
    }
}
function cross4(edges, mainFace, mainColor, turnList, turnList123 = []) {
    const
    openSpot = (edges => {
        for (const [i, j] of cube3.edgeIndices) {
            const
            layer = cube3.layers[mainFace],
            index = cube2.index[mainFace];

            let indices = [i, j];
            indices.splice(index, 0, layer);

            const
            piece = edges.indices(indices),
            color = faces.findColor(indices, piece, mainFace);

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

                    if (piece.includes(mainColor)) {
                        const
                        indices = [i, j, k],
                        color = faces.findColor(indices, piece, mainFace),
                        faceList = faces.indices(indices);

                        if (!(color === mainColor && faceList.includes(mainFace))) {
                            const omit = [mainFace, faces.opposite[mainFace]];

                            let reducedFaceList = faceList.filter(face => !omit.includes(face));

                            if (reducedFaceList.length > 1) {
                                const
                                f0 = reducedFaceList[0],
                                f1 = reducedFaceList[1],
                                firstFaceColor = faces.findColor(indices, piece, f0);

                                if (firstFaceColor !== mainColor)
                                    reducedFaceList = [f1, f0];
                            }

                            return {indices, faces: reducedFaceList, piece};
                        }
                    }
                }
            }
        }
    })(edges.pieces),
    mf = mainFace,
    f0 = openSpot.face,
    f1 = offendingPiece.faces[0],
    angle = faces.angle(mainFace)(f0, f1),
    index = cube2.index[mainFace];

    let layer = offendingPiece.indices[index];
    if (cube2.layers[mainFace]) layer = 2 - layer;

    let turns4;

    switch (layer) {
        case 0:
            const cc0 = faces.counterclockwise[mainFace][f0];
            turns4 = `${f0} ${mf}' ${cc0}`;
            break;

        case 1:
            const
            f2 = offendingPiece.faces[1],
            c0 = faces.clockwise[mainFace][f0];

            switch(angle) {
                case 0:
                    turns4 = (f2 === c0) ? `${mf} ${f2}'` : `${mf}' ${f2}`;
                    break;
                case 1:
                    turns4 = (f2 === f0) ? `${f0}` : `${mf}2 ${faces.opposite[f0]}'`;
                    break;
                case -1:
                    turns4 = (f2 === f0) ? `${f0}'` : `${mf}2 ${faces.opposite[f0]}`;
                    break;
                case 2:
                    turns4 = (f2 === c0) ? `${mf} ${f2}` : `${mf}' ${f2}'`;
                    break;
                default:
                    throw "wrong angle between faces";
            }
            break;
        
        case 2:
            const color = faces.findColor(
                edges.findEdge(offendingPiece.piece),
                offendingPiece.piece,
                mainFace
            );

            if (color === mainColor)
                switch (angle) {
                    case 0:
                        turns4 = `${f1}2`;
                        break;
                    case 1:
                        turns4 = `${mf} ${f1}2`;
                        break;
                    case -1:
                        turns4 = `${mf}' ${f1}2`;
                        break;
                    case 2:
                        turns4 = `${mf}2 ${f1}2`;
                        break;
                    default:
                        throw "wrong angle";
                }
            else {
                const c1 = faces.clockwise[mainFace][f1];
                switch (angle) {
                    case 0:
                        turns4 = `${f1} ${mf} ${c1}'`;
                        break;
                    case 1:
                        turns4 = `${f1}' ${f0} ${f1}`;
                        break;
                    case -1:
                        turns4 = `${f1} ${f0}' ${f1}'`;
                        break;
                    case 2:
                        turns4 = `${mf}2 ${f1} ${mf} ${c1}'`;
                        break;
                    default:
                        throw "wrong angle";
                }
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
                        if (!omit.includes(face)) {
                            const color = faces.findColor(indices, piece, mainFace);
                            if (color === mainColor && faceList.includes(mainFace))
                                fourEdges.inPlace.push({piece, indices, face});
                            else
                                fourEdges.offending.push({piece, indices, face});
                        }
                }
            }
        }
    }

    return fourEdges;
}
function orderEdges(edgeList, mainFace) {
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

    const faceList = Object.entries(cube3.layers)
        .filter(([face, index]) => index === 0 && face !== mainFace)
        .map(([face, index]) => face);

    if (faceList.includes(f0))
        return edgeList;
    return oppositeOrder;
}

function bringToOppositeMainFace(edges, mainFace, mainColor) {
    const
    facesSans = faces.sides.filter(
        side => ![mainFace, faces.opposite[mainFace]].includes(side)
    ),
    colorsSans = (faceList => {
        let colorsSans = [];
        for (const face of faceList) {
            const color = cube3.centerColor(edges, face);
            colorsSans.push(color);
        }
        return colorsSans;
    })(facesSans),
    permutations = permute(colorsSans);

    let turnsList = [];

    for (const i in permutations) {
        const
        permutation = permutations[i],
        copy = edges.copy();
        turnsList.push([]);

        for (const centerColor of permutation) {
            const
            centerFace = (centerColor => {
                for (const face of faces.sides) {
                    const color = cube3.centerColor(edges, face);
                    if (centerColor === color)
                        return face;
                }
            })(centerColor),
            edge = (() => {
                for (const i of cube3.edgeArray) {
                    const plane = copy.pieces[i];
                    for (const j of cube3.edgeArray) {
                        const line = plane[j]
                        for (const k of cube3.edgeArray) {
                            const piece = line[k];

                            if (!piece) continue;
                            if (colors.isSamePiece(piece, centerColor + mainColor))
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