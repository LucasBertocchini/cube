"use strict";

let solvedCubes = [];
let tempCube = solvedCube;
tempCube = turnCube(tempCube, "x", 1);
for (let i = 0; i < 6; i++) { // 6 faces
    tempCube = (i % 2 === 0) ? turnCube(tempCube, "x", -1) : turnCube(tempCube, "y");
    for (let j = 0; j < 4; j++) { // 4 rotations per face
        const stringedCube = JSON.stringify(tempCube);
        solvedCubes.push(stringedCube);
        tempCube = turnCube(tempCube, "z");
    }
}

const isSolved = cube => stepByStep(cube);

function stepByStep(cube) {
    let firstPiece = cube[0][0][0],
        lastPiece = cube[cubeSize - 1][cubeSize - 1][cubeSize - 1],
        U = firstPiece[0],
        D = lastPiece[0],
        F = lastPiece[1],
        B = firstPiece[1],
        L = firstPiece[2],
        R = lastPiece[2];

    for (let i = 0; i < cube.length; i++) {
        const plane = cube[i];
        for (let j = 0; j < cube.length; j++) {
            const line = plane[j];
            for (let k = 0; k < cube.length; k++) {
                const piece = line[k],
                      icolor = piece[0],
                      jcolor = (i === 0 || i === cubeSize - 1) ? piece[1] : piece[0],
                      kcolor = piece[piece.length - 1];

                if (i === 0) {
                    if (U !== icolor) return false;
                    U = icolor;
                } else if (i === cubeSize - 1) {
                    if (D !== icolor) return false;
                    D = icolor;
                }

                if (j === 0) {
                    if (B !== jcolor) return false;
                    B = jcolor;
                } else if (j === cubeSize - 1) {
                    if (F !== jcolor) return false;
                    F = jcolor;
                }

                if (k === 0) {
                    if (L !== kcolor) return false;
                    L = kcolor;
                } else if (k === cubeSize - 1) {
                    if (R !== kcolor) return false;
                    R = kcolor;
                }
            }
        }
    }
    return true;
}

function quickCheck(cube) {
    const stringedCube = JSON.stringify(cube);
    return solvedCubes.includes(stringedCube);
}