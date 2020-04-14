"use strict";

function orient(cube, mainColor, moves) {
    const orientations = [
        {indices: [0, 1, 1], turn: {face: "M", amount: 2}},  //U
        {indices: [1, 2, 1], turn: {face: "M", amount: 1}},  //F
        {indices: [1, 0, 1], turn: {face: "M", amount: -1}}, //B
        {indices: [1, 1, 0], turn: {face: "S", amount: -1}}, //L
        {indices: [1, 1, 2], turn: {face: "S", amount: 1}}   //R
    ];
    for (const orientation of orientations) {
        const i = orientation.indices;
        if (cube.pieces[i[0]][i[1]][i[2]] === mainColor) {
            const turn = orientation.turn;
            moves.turn(turn);
            return;
        }
    }
}