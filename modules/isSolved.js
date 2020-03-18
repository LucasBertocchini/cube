"use strict";

const cubeIsSolved = cube => stepByStep(cube);

function stepByStep(cube) {
    const firstPiece = cube[0][0][0],
        s = cubeSize - 1,
        lastPiece = cube[s][s][s],
        U = firstPiece[0],
        D = lastPiece[0],
        F = lastPiece[1],
        B = firstPiece[1],
        L = firstPiece[2],
        R = lastPiece[2];

    for (let i = 0; i < cubeSize; i++) {
        const plane = cube[i];
        for (let j = 0; j < cubeSize; j++) {
            const line = plane[j];
            for (let k = 0; k < cubeSize; k++) {
                const piece = line[k];

                if (i === 0) {
                    const icolor = piece[0];
                    if (icolor !== U) return false;
                } else if (i === s) {
                    const icolor = piece[0];
                    if (icolor !== D) return false;
                }

                if (j === 0) {
                    const jcolor = (i === 0 || i === s) ? piece[1] : piece[0];
                    if (jcolor !== B) return false;
                } else if (j === s) {
                    const jcolor = (i === 0 || i === s) ? piece[1] : piece[0];
                    if (jcolor !== F) return false;
                }

                if (k === 0) {
                    const kcolor = piece[piece.length - 1];
                    if (kcolor !== L) return false;
                } else if (k === s) {
                    const kcolor = piece[piece.length - 1];
                    if (kcolor !== R) return false;
                }
            }
        }
    }
    return true;
}

function check24(cube) {
    const stringedCube = JSON.stringify(cube);
    return solvedCubes.includes(stringedCube);
}