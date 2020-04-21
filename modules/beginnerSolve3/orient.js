"use strict";

const orientations = {
    U: {
        U: null,
        D: "M2",
        B: "M" ,
        F: "M'",
        L: "S" ,
        R: "S'"
    },
    D: {
        U: "M2",
        D: null,
        B: "M'",
        F: "M" ,
        L: "S'",
        R: "S"
    },
    B: {
        U: "M'",
        D: "M" ,
        B: null,
        F: "M2",
        L: "E" ,
        R: "E'"
    },
    F: {
        U: "M" ,
        D: "M'",
        B: "M2",
        F: null,
        L: "E'",
        R: "E"
    },
    L: {
        U: "S'",
        D: "S" ,
        B: "E'",
        F: "E" ,
        L: null,
        R: "E2"
    },
    R: {
        U: "S" ,
        D: "S'",
        B: "E" ,
        F: "E'",
        L: "E2",
        R: null
    }
};

console.log(orientations)

let orientations2 = {};
let face = "U";
let opposite = "D";

let face2 = (() => {
    for (const middle of faces.middles)
        if (!faces.sameAxis(face, middle))
            return middle;
})();

orientations2[face] = null;
orientations2[opposite] = `${face2}2`;

console.log(orientations2);

function orient(turns, solveFrom) {
    const
    cube = turns.cube,
    mainColor = solveFrom.colors.main,
    oppositeFace = solveFrom.faces.opposite,
    orientationList = Object.entries(orientations[oppositeFace]);
    
    for (const [face, turn] of orientationList) {
        const color = cube3.centerColor(cube, face);
        if (color === mainColor) {
            if (turn) turns.turns(turn);
            return;
        }
    }

    throw "orientation failed";
}