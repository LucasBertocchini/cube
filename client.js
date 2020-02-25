"use strict";
// TU resident: column0679dough
// link: file:///C:/Users/User/Desktop/cube/index.html
/* 3x3 cube = [
    //     L     M      R
    [ //U
        ["ygo", "yg", "ygr"], //B
        ["yo" , "y" , "yr" ], //S
        ["ybo", "yb", "ybr"]  //F
    ],
    [ //E
        ["go" , "g" , "gr" ], //B
        ["o"  , ""  , "r"  ], //S
        ["bo" , "b" , "br" ]  //F
    ],
    [ //D
        ["wgo", "wg", "wgr"], //B
        ["wo" , "w" , "wr" ], //S
        ["wbo", "wb", "wbr"]  //F
    ]
]
*/

//import {bruteForceSolve} from "./bruteForceSolve.js";

const cubeSize = 3;

let mainCube = constructCube(cubeSize);
const solvedCube = deepCopy(mainCube),
      stringedCube = JSON.stringify(solvedCube);

const colors = {
    y: "yellow",
    w: "white",
    g: "green",
    b: "blue",
    o: "orange",
    r: "red"
},
      middles = ["E", "S", "M"],
      turnAmounts = [1, -1, 2],
      layers = {
        U: 0,
        E: 1,
        D: cubeSize - 1,
        B: 0,
        S: 1,
        F: cubeSize - 1,
        L: 0,
        M: 1,
        R: cubeSize - 1
    };

let sides = ["U", "D", "F", "B", "L", "R"];
if (cubeSize === 3) middles.forEach(middle => sides.push(middle));
else if (cubeSize > 3) {
    for (let layer = 1; layer < cubeSize - 1; layer++) {
        middles.forEach(middle => sides.push(middle + layer.toString()));
    }
}
let turns = [];
sides.forEach(side => {
    turnAmounts.forEach(amount => turns.push({side, amount}));
});
const turnsLength = turns.length;


window.onload = () => {
    displaySetup();
    display();
}

//helper functions
function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}
function reorder(string, ...indexes) {
    let newString = "";
    for (let index of indexes)
        newString += string[index];
    return newString;
}

//cube functions
function constructCube(size) {
    if (isNaN(size) || size < 2 || size % 1 !== 0)
        throw "size must be an integer greater than 1";
    
    let cube = [];
    let s = size - 1;
    
    for (let x = 0; x < size; x++) {
        cube.push([]);
        let plane = cube[x];
        
        for (let y = 0; y < size; y++) {
            plane.push([]);
            let line = plane[y];
            
            for (let z = 0; z < size; z++) {
                let piece = "";
                
                if (x === 0)
                    piece += "y";
                else if (x === s)
                    piece += "w";
                
                if (y === 0)
                    piece += "g";
                else if (y === s)
                    piece += "b";
                
                if (z === 0)
                    piece += "o";
                else if (z === s)
                    piece += "r";
                    
                line.push(piece);
            }
        }
    }
    return cube;
}
function turnSide(cube, side, amount = 1) {
    if (!turnAmounts.includes(amount)) throw "turn amount must be 1, -1, or 2";

    // conjugate the direction for opposite sides
    if (["D", "B", "R"].includes(side) && amount !== 2)
        amount *= -1;

    
    let layer = layers[side];
    if (layer === undefined) {
        layer = parseInt(side.slice(1));
    }
    let after = deepCopy(cube);
    
    function calcIndexes(i, j, iPrime, jPrime) {
        let indexes;
        if (amount === 1)
            indexes = [jPrime, i];
        else if (amount === -1)
            indexes = [j, iPrime];
        else if (amount === 2)
            indexes = [iPrime, jPrime];
        return indexes;
    }
    
    function calcPieces(newPieceFunction) {
        for (let i = 0; i < cubeSize; i++) {
            const iPrime = cubeSize - 1 - i;
            for (let j = 0; j < cubeSize; j++) {
                const jPrime = cubeSize - 1 - j;
                let indexes = calcIndexes(i, j, iPrime, jPrime);
                newPieceFunction(i, j, indexes);
            }
        }
    }
        //"E", "S", "M"
    /* loops are inside the if statements to avoid calling if's
    many times unnecisarily */
    if (side === "U" || side === "D") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[layer][indexes[0]][indexes[1]];
            
            if (newPiece.length === 3 && amount !== 2)
                newPiece = reorder(newPiece, 0, 2, 1);
            
            after[layer][i][j] = newPiece;
        });
    } else if (side === "F" || side === "B") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[indexes[0]][layer][indexes[1]];
            
            if (newPiece.length === 3 && amount !== 2)
                newPiece = reorder(newPiece, 2, 1, 0);
            else if (newPiece.length === 2 && amount !== 2)
                newPiece = reorder(newPiece, 1, 0);
            
            after[i][layer][j] = newPiece;
        });
    } else if (side === "L" || side === "R") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[indexes[0]][indexes[1]][layer];
            
            if (newPiece.length === 3 && amount !== 2)
                newPiece = reorder(newPiece, 1, 0, 2);
            
            after[i][j][layer] = newPiece;
        });
    } else if (side === "M" || side[0] === "M") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[layer][indexes[0]][indexes[1]];
            
            if (newPiece.length === 2 && amount !== 2)
                newPiece = reorder(newPiece, 1, 0);
            
            after[layer][i][j] = newPiece;
        });
    } else if (side === 1) {
        
    } else if (side === 1) {
        
    } else throw "side must be U, D, L, R, F, B, E(n), S(n), or M(n)"
    cube = after;
    return cube;
}
function isSolved(cube) {
    return (JSON.stringify(cube) === stringedCube);
}

function moveSets(n) {
    let indices = Array(n).fill(0);
    let length = sides.length;
    let turnAmounts = [1, -1, 2];
    for (let i = n; i >= 0;) {
        
        function sameIndices() {
            for (let j = 1; j < n; j++) {
                if (indices[j] === indices[j - 1])
                    return true;
            }
        }
        if (!sameIndices()) {
            let indices2 = Array(n).fill(0);
            for (let j = n; j >= 0;) {
                
                let cube = deepCopy(mainCube);
                let moves = [];
                for (let k = 0; k < n; k++) {
                    let index1 = indices[k];
                    let index2 = indices2[k];
                    let side = sides[index1];
                    let amount = turnAmounts[index2];
                    moves.push({side, amount});
                }
                let solved = false;
                //while (!solved) {
                    
                //}
                
                for (j = n; j--;) {
                    if (indices2[j] < 3 - 1) {
                        indices2[j]++;
                        break;
                    }
                    indices2[j] = 0;
                }
            }
        }
        
        for (i = n; i--;) {
            if (indices[i] < length - 1) {
                indices[i]++;
                break;
            }
            indices[i] = 0;
        }
    }
}