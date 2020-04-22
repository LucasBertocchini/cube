"use strict";

function calcOrientations(mainFace) {
    let orientations = {};

    const
    oppositeFace = faces.opposite[mainFace],
    coaxialMiddle = (() => {
        for (const middle of faces.middles)
            if (!faces.sameAxis(mainFace, middle))
                return middle;
    })(),
    index = faces.index[mainFace],
    reducedEdgeArray = cube3.edgeArray.filter(i => i !== index);

    orientations[mainFace] = null;
    orientations[oppositeFace] = `${coaxialMiddle}2`;

    for (const i of [0, 1]) {
        const
        faceList = keysByValue(faces.index, reducedEdgeArray[i]),
        iPrime = 1 - i,
        middle = faces.middles[reducedEdgeArray[iPrime]];

        for (const face of faceList) {
            const conditions = [
                !(
                    faces.sameAxis(mainFace, faces.middles[1]) &&
                    faces.sameAxis(face, faces.middles[0])
                ),
                faces.sameAxis(mainFace, faces.middles[2]),
                cube2.layers[face],
                cube2.layers[mainFace]
            ];
            if (XOR(...conditions))
                orientations[face] = middle;
            else
                orientations[face] = `${middle}'`;
        }
    }

    return orientations;
}


function orient(turns, solveFrom) {
    const
    cube = turns.cube,
    mainColor = solveFrom.colors.main,
    mainFace = solveFrom.mainFace,
    orientations = calcOrientations(mainFace);
    
    for (const face in orientations) {
        const color = cube3.centerColor(cube, face);
        if (color === mainColor) {
            const turn = orientations[face];
            if (turn) turns.turns(turn);
            return;
        }
    }

    throw "orientation failed";
}