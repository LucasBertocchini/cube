"use strict";

function orient(cube, mainColor, moves) {
    const orientations = [
        {indices: [0, 1, 1], face: "M", amount: 2},  //U
        {indices: [1, 2, 1], face: "M", amount: 1},  //F
        {indices: [1, 0, 1], face: "M", amount: -1}, //B
        {indices: [1, 1, 0], face: "S", amount: -1}, //L
        {indices: [1, 1, 2], face: "S", amount: 1}   //R
    ];
    for (let orientation of orientations) {
        const i = orientation.indices;
        if (cube.pieces[i[0]][i[1]][i[2]] === mainColor) {
            const face = orientation.face,
                amount = orientation.amount;
            moves.push({face, amount});
            cube.turn(face, amount);
        }
    }
}