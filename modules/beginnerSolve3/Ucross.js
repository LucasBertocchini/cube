"use strict";

function Ucross(moves, solveFrom) {
    let cube = moves.cube;
    const mainColor = solveFrom.color.main;
    
	const count = countU(cube.pieces, "y");

    switch (count) {
        case 0:
            const turns = "F R U R' U' F' U2 F U R U' R' F'";
            moves.turns(turns);
            return;

        case 2:
            const indicesList = indicesU(cube.pieces, "y");

            const i0 = indicesList[0],
                i1 = indicesList[1],
                faceList = [findSide(i0), findSide(i1)];

            if (colinear(indicesList)) {
                const f0 = ccSide[faceList[0]],
                    f1 = faceList[1],
                    turns = `${f0} ${f1} U ${f1}' U' ${f0}'`;

                moves.turns(turns);
            } else {
                const f0 = oppositeSide[faceList[0]],
                    f1 = oppositeSide[faceList[1]],
                    turns = `${f0} U ${f1} U' ${f1}' ${f0}'`;

                moves.turns(turns);
            }

            return;

        case 4:
            return;

        default:
            throw "wrong amount of opposite mainColor on U";
    }
}

function countU(pieces, color) {
    const U = pieces[0];
    let count = 0;
    for (const [i, j] of cube3.edgeIndices) {
        const line = U[i],
            piece = line[j],
            color1 = piece[0];
        if (color1 === color) count++;
    }
    return count;
}

function indicesU(pieces, color) {
    const positions = [
        [0, 1],
        [1, 2],
        [2, 1],
        [1, 0]
    ];

    const U = pieces[0];
    let indices = [];
    for (const [i, j] of positions) {
        const line = U[i],
            piece = line[j],
            color1 = piece[0];
        if (color1 === color) indices.push([1, i, j]);
    }

    function findSide(indexList) {
        for (const [side, indices] of Object.entries(cube3.centerIndices))
            if (eqarray(indexList, indices))
                return side;
        throw "side not found";
    }

    const i0 = indices[0],
        i1 = indices[1],
        f0 = findSide(i0),
        f1 = findSide(i1),
        c0 = clockwiseSides[f0],
        c1 = clockwiseSides[f1],
        clockwise = (c0 - 1 === c1 || (c0 === 0 && c1 === 3));

    if (!clockwise)
        indices = [indices[1], indices[0]];

    return indices;
}

function colinear(indices) {
    const indices0 = indices[0],
        indices1 = indices[1];
    for (let i of [1, 2])
        if (indices0[i] === indices1[i])
            return true;
    return false;
}

function findSide(indexList) {
    for (const [side, indices] of Object.entries(cube3.centerIndices))
        if (eqarray(indexList, indices))
            return side;
    throw "side not found";
}