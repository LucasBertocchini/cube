"use strict";

const orientations = {
    "U": "M2",
    "B": "M'",
    "F": "M" ,
    "L": "S'",
    "R": "S" ,
};

function orient(moves, solveFrom) {
    const
    cube = moves.cube,
    mainColor = solveFrom.colors.main;
    
    for (const [face, turn] of Object.entries(orientations)) {
        const
        indices = cube3.centerIndices[face],
        color = cube.indices(indices);

        if (color === mainColor) {
            moves.turns(turn);
            return;
        }
    }

    const
    indicesD = cube3.centerIndices.D,
    colorD = cube.indices(indicesD);
    
    if (colorD !== mainColor)
        throw "orientation failed";
}