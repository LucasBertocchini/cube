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
let mainCube = constructCube(cubeSize);
const solvedCube = deepCopy(mainCube);
const stringedCube = JSON.stringify(solvedCube);
const colors = {
    y: "yellow",
    w: "white",
    g: "green",
    b: "blue",
    o: "orange",
    r: "red"
};
const sides = ["U", "D", "B", "F", "L", "R"],
      turnAmounts = {"": 1, "'": -1, "2": 2};


window.onload = () => {
    displaySetup();
    for (let i = 0; i < 2; i++) {
        let side = sides[randomInt(sides.length)];
        let amounts = Object.values(turnAmounts);
        let amount = amounts[randomInt(amounts.length)];
        console.log(side, amount);
        mainCube = turnSide(mainCube, side, amount);
    }
    let solve = bruteForceSolve(2)
    if (solve) console.log(...solve);
    else console.log(false);
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
function keyByValue(object, value) {
    return Object.keys(object).find(
        key => (object[key] === value)
    );
}
function randomInt(n) {
    return Math.floor(Math.random() * n);
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
    } else
        throw "side must be U, D, L, R, F, B, En, Sn, or Mn"
    
    cube = after;
    return cube;
}
function isSolved(cube) {
    return (JSON.stringify(cube) === stringedCube);
}

function bruteForceSolve(n) { // main cube
    let turns = [];
    for (let side of sides) {
        for (let [turn, amount] of Object.entries(turnAmounts))
            turns.push({side, turn, amount});
    }
    const length = turns.length;
    
    for (let amount = 1; amount <= n; amount++) {
        let indices = Array(amount).fill(0);
        for (let i = amount; i >= 0;) {
            let cube = deepCopy(mainCube);
            for (let index of indices) {
                let turn = turns[index];
                /*if (index > 0 && turn.side === turns[index - 1].side)
                    break;*/
                cube = turnSide(cube, turn.side, turn.amount)
            }
            if (isSolved(cube)) {
                let moves = [];
                for (let i of indices)
                    moves.push(turns[i]);
                return moves;
            }

            for (i = amount; i--;) {
                if (indices[i] < length - 1) {
                    indices[i]++;
                    break;
                }
                indices[i] = 0;
            }
        }
    }
    
    
    return false;
}

//display functions
function displaySetup() {
    let cubeContainer = document.querySelector("#cube-container");
    cubeContainer.style = "grid-template-columns: auto auto auto;";
    
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
        face.style = `grid-template-columns: ${"auto ".repeat(cubeSize)};`;
        cubeContainer.appendChild(face);
    }
    
    for (let side of sides) {
        let turnButton = document.createElement("button");
        turnButton.id = side;
        turnButton.innerHTML = "Turn " + side;
        turnButton.onclick = () => {
            mainCube = turnSide(mainCube, side);
            display();
        }
        document.body.appendChild(turnButton);
    }
}
function display() {
    
    function colorPiece(face, row, col, color) {
        let faceElement = document.getElementById(face);
        let piece = faceElement.children[col + cubeSize * row];
        piece.style.backgroundColor = colors[color];
    }
    
    
    for (let x = 0; x < cubeSize; x++) {
        const plane = mainCube[x];
        for (let y = 0; y < cubeSize; y++) {
            const line = plane[y];
            for (let z = 0; z < cubeSize; z++) {
                const piece = line[z];
                
                const caseX = (x === 0 || x === cubeSize - 1),
                      caseY = (y === 0 || y === cubeSize - 1);
                
                if (x === 0) //U
                    colorPiece("U", y, z, piece[0]);
                else if (x === cubeSize - 1)
                    colorPiece("D", cubeSize - 1 - y, z, piece[0]);
                
                const indexY = (caseX) ? 1 : 0;
                if (y === 0) {
                    colorPiece("B", cubeSize - 1 - x, z, piece[indexY])
                } else if (y === cubeSize - 1) {
                    colorPiece("F", x, z, piece[indexY])
                }
                
                let indexZ = 0;
                if (caseX || caseY) indexZ = 1;
                if (caseX && caseY) indexZ = 2;
                if (z === 0) {
                    colorPiece("L", x, y, piece[indexZ])
                } else if (z === cubeSize - 1) {
                    colorPiece("R", x, cubeSize - 1 - y, piece[indexZ])
                }
            }
        }
    }
}