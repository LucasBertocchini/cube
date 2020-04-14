"use strict";

const orientations = [
    {face: "U", turn: "M2"},
    {face: "B", turn: "M'"},
    {face: "F", turn: "M"},
    {face: "L", turn: "S'"},
    {face: "R", turn: "S"}
];

function orient(moves, solveFrom) {
    const
    cube = moves.cube,
    mainColor = solveFrom.color.main;
    
    for (const orientation of orientations) {
        const
        face = orientation.face,
        indices = cube3.centerIndices[face],
        color = cube.indices(indices);

        if (color === mainColor) {
            const turn = orientation.turn;
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