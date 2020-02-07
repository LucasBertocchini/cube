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

const cubeSize = 3;
let cube = constructCube(cubeSize);
const solvedCube = deepCopy(cube);
const colors = {
    y: "yellow",
    w: "white",
    g: "green",
    b: "blue",
    o: "orange",
    r: "red"
};


window.onload = () => {
    let i = 1;
    console.log(deepCopy(cube)[i]);
    turn("R", -1);
    console.log(cube[i]);
    //display();
}




function turn(side, amount = 1) {
    // conjugate the direction for opposite sides
    if (["D", "B", "R"].includes(side) &&
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
    let after = deepCopy(cube);
    
    function calcIndexes(i, j, iPrime, jPrime) {
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
    
    if (side === "U" || side === "D") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[layer][indexes[0]][indexes[1]];
            after[layer][i][j] = newPiece;
        });
    } else if (side === "F" || side === "B") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[indexes[0]][layer][indexes[1]];
            after[i][layer][j] = newPiece;
        });
    } else if (side === "L" || side === "R") {
        calcPieces((i, j, indexes) => {
            let newPiece = cube[indexes[0]][indexes[1]][layer];
            console.log(newPiece);
            if (amount !== 2 && newPiece.length === 3) {
                const firstChar = newPiece[0],
                      secondChar = newPiece[1],
                      lastChar = newPiece[2];
                newPiece = secondChar + firstChar + lastChar;
            }
            console.log(newPiece);
            after[i][j][layer] = newPiece;
        });
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

function reorder(string i1, i2, i3 = null) {
    if (i3) return string[i1] + string[i2] + string[i3];
    else return string[i1] + string[i2];
}

function display() {
    let cubeContainer = document.querySelector("#cube-container");
    
    let gridItems = [
        null, "B", null,
        null, "U", null,
        "L" , "F", "R" ,
        null, "D", null
    ];
    
    for (let gridItem of gridItems) {
        let face = document.createElement("div");
        face.className = "face";
        if (gridItem) {
            face.id = gridItem;
            
            for (let i = 0; i < cubeSize ** 2; i++) {
                let piece = document.createElement("div");
                piece.className = "piece";
                if (i === (cubeSize ** 2 - 1) / 2) piece.innerHTML = gridItem;
                face.appendChild(piece);
            }
        }
        cubeContainer.appendChild(face);
    }
    
    function colorPiece(face, row, col, color) {
        let faceElement = document.getElementById(face);
        let piece = faceElement.children[row + cubeSize * col];
        piece.style.backgroundColor = colors[color];
    }
    colorPiece("B", 1, 2, "y")
    
    
    for (let x = 0; x < cubeSize; x++) {
        const plane = cube[x];
        for (let y = 0; y < cubeSize; y++) {
            const line = plane[y];
            for (let z = 0; z < cubeSize; z++) {
                const piece = line[z];
                if (x === 0) { //U
                    colorPiece("U", y, z, cube[0][y][z][0])
                    console.log(y,z,cube[0][y][z])
                }
            }
        }
    }
}
