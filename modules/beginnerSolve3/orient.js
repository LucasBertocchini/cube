"use strict";

function orient(turns, mainFace, mainColor) {
    const
    cube = turns.cube,
    orientations = calcOrientations(mainFace);
    
    for (const face in orientations) {
        const color = cube3.centerColor(cube, face);
        if (color === mainColor) {
            const turn = orientations[face];
            turns.turns(turn);
            return;
        }
    }

    throw "orientation failed";
}

function calcOrientations(mainFace) {
    const
    oppositeFace = sides.opposite[mainFace],
    coaxialMiddle = (() => {
        for (const middle of faces.middles)
            if (!cube3.sameAxis(mainFace, middle))
                return middle;
    })(),
    index = cube2.index[mainFace],
    reducedEdgeArray = cube3.edgeArray.filter(i => i !== index);

    let orientations = {};
    orientations[mainFace] = `${coaxialMiddle}2`;
    orientations[oppositeFace] = null;

    for (const i of [0, 1]) {
        const
        faceList = keysByValue(cube2.index, reducedEdgeArray[i]),
        iPrime = 1 - i,
        middle = faces.middles[reducedEdgeArray[iPrime]];

        for (const face of faceList) {
            const conditions = [
                !(
                    cube3.sameAxis(mainFace, faces.middles[1]) &&
                    cube3.sameAxis(face, faces.middles[0])
                ),
                cube3.sameAxis(mainFace, faces.middles[2]),
                cube2.layers[face],
                cube2.layers[mainFace]
            ];
            
            orientations[face] = XOR(...conditions) ? `${middle}'` : middle;
        }
    }

    return orientations;
}