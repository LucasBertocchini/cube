"use strict";
// TU resident: column0679dough
/* 3x3 cube = [
    //     L     M      R
    [ //U
        ["ygo", "yg", "ygr"], //B
        ["yo" , "y" , "yr" ], //S
        ["ybo", "yb", "ybr"]  //F
    ],
    [ //E
        ["go" , "g" , "gr" ], //B
        ["o"  , "  ", "r"  ], //S
        ["bo" , "b" , "br" ]  //F
    ],
    [ //D
        ["wgo", "wg", "wgr"], //B
        ["wo" , "w" , "wr" ], //S
        ["wbo", "wb", "wbr"]  //F
    ]
]
*/

const cubeSize = 3;
let cube = constructCube(cubeSize);


window.onload = () => {
    console.log(deepCopy(cube));
    turn("U", -1);
    console.log(cube);
}




function turn(side, amount = 1) {
    // conjugate the direction for opposite sides
    if (["D", "R", "B"].includes(side) &&
        (amount === 1 || amount === -1))
            amount *= -1;
    
    const layers = {
        U: 0,
        D: cubeSize - 1,
        L: 0,
        R: cubeSize - 1,
        B: 0,
        F: cubeSize - 1
    }
    const layer = layers[side];
    let after = deepCopy(cube),
        calcIndexes = (i, j, iPrime) => {
        const jPrime = cubeSize - 1 - j;
        
        let indexes;
        if (amount === 1)
            indexes = [jPrime, i];
        else if (amount === -1)
            indexes = [j, iPrime];
        else if (amount === 2)
            indexes = [iPrime, jPrime];
        else
            throw "turn amount must be 1, -1, or 2";
        return indexes;
    }
    
    if (side === "U" || side === "D") {
        for (let i = 0; i < cubeSize; i++) {
            const iPrime = cubeSize - 1 - i;
            for (let j = 0; j < cubeSize; j++) {

                let indexes = calcIndexes(i, j, iPrime);
                let newPiece = cube[layer][indexes[0]][indexes[1]];
                after[layer][i][j] = newPiece;
            }
        }
    } else if (side === "L" || side === "R") {
        for (let i = 0; i < cubeSize; i++) {
            const iPrime = cubeSize - 1 - i;
            for (let j = 0; j < cubeSize; j++) {
                const jPrime = cubeSize - 1 - j;
                
                let indexes = calcIndexes(i, j, iPrime);
                let newPiece = cube[indexes[0]][indexes[1]][layer];
                after[i][j][layer] = newPiece;
            }
        }
    } else if (side === "B" || side === "F") {
        for (let i = 0; i < cubeSize; i++) {
            const iPrime = cubeSize - 1 - i;
            for (let j = 0; j < cubeSize; j++) {
                const jPrime = cubeSize - 1 - j;
                
                let indexes = calcIndexes(i, j, iPrime);
                let newPiece = cube[indexes[0]][layer][indexes[1]];
                after[i][layer][j] = newPiece;
            }
        }
    } else
        throw "side must be U, D, L, R, F, B, En, Sn, or Mn"
    
    cube = after;
}

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

function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}

function display() {
    let html = "";
    for (let x = 0; x < cube.length; x++) {
        let plane = cube[x];
        html += "<p>";
        for (let y = 0; y < plane.length; y++) {
            let line = plane[y];
            for (let z = 0; z < line.length; z++) {
                let piece = line[z];
                html += (piece + " ");
            }
            html += "&nbsp;".repeat(20);
        }
        html += "</p>";
    }
    document.body.innerHTML = html;
}
