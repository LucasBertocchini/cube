"use strict";

function crossMainFace(turns, mainFace, mainColor) {
    const
    cube = turns.cube,
    count = countColorOnMainFace(cube, mainFace, colors.opposite[mainColor]);

    switch (count) {
        case 0:
            const
            allOrthogonal = cube2.orthogonal(mainFace),
            reducedOrthogonal = allOrthogonal.filter(side => !cube2.layers[side]),
            conjugate = sides.conjugate.includes(mainFace),
            f0 = reducedOrthogonal[conjugate ? 1 : 0],
            f1 = reducedOrthogonal[conjugate ? 0 : 1],
            mf = mainFace;

            turns.turns(`${f0} ${f1} ${mf} ${f1}' ${mf}' ${f0}' ${mf}2 ${f0} ${mf} ${f1} ${mf}' ${f1}' ${f0}'`);
            return;

        case 2:
            const
            indicesList = indicesMainFace(cube, mainFace, colors.opposite[mainColor]),
            i0 = indicesList[0],
            i1 = indicesList[1],
            faceList = [findSide(i0), findSide(i1)];

            if (colinear(indicesList, mainFace)) {
                const
                f0 = sides.counterclockwise[mainFace][faceList[0]],
                f1 = faceList[1],
                mf = mainFace;

                turns.turns(`${f0} ${f1} ${mf} ${f1}' ${mf}' ${f0}'`);
            } else {
                const
                f0 = sides.opposite[faceList[0]],
                f1 = sides.opposite[faceList[1]],
                mf = mainFace;

                turns.turns(`${f0} ${mf} ${f1} ${mf}' ${f1}' ${f0}'`);
            }
            return;

        case 4:
            return;

        default:
            throw "wrong amount of opposite mainColor on U";
    }
}

function countColorOnMainFace(cube, mainFace, color) {
    const
    layer = cube3.layers[mainFace],
    index = cube2.index[mainFace];

    let count = 0;

    for (const [i, j] of cube3.edgeIndices) {
        let indices = [i, j];
        indices.splice(index, 0, layer);

        const
        piece = cube.indices(indices),
        pieceColor = sides.findColor(indices, piece, mainFace);

        if (pieceColor === color) count++;
    }
    return count;
}

function indicesMainFace(cube, mainFace, oppositeColor) {
    const
    layer = cube3.layers[mainFace],
    index = cube2.index[mainFace];

    let indicesList = [];

    for (const [i, j] of cube3.edgeIndices) {
        let indices = [i, j];
        indices.splice(index, 0, layer);

        const
        piece = cube.indices(indices),
        color = sides.findColor(indices, piece, mainFace);

        if (color === oppositeColor) {
            let indicesPrime = [i, j];
            indicesPrime.splice(index, 0, 1);
            indicesList.push(indicesPrime);
        }
    }

    function findSide(indexList) {
        for (const [side, indices] of Object.entries(cube3.centerIndices))
            if (eqarray(indexList, indices))
                return side;
        throw "side not found";
    }

    const
    i0 = indicesList[0],
    i1 = indicesList[1],
    f0 = findSide(i0),
    f1 = findSide(i1),
    clockwise = sides.counterclockwise[mainFace][f0] === f1;

    if (!clockwise)
        indicesList = [indicesList[1], indicesList[0]];

    return indicesList;
}

function colinear(indices, mainFace) {
    const
    indices0 = indices[0],
    indices1 = indices[1],
    reducedIndices = cube3.edgeArray.filter(
        (e, i) => i !== cube3.index[mainFace]
    );

    for (const i of reducedIndices)
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