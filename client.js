"use strict";

/* 3x3 cube:
0: Array(3)
0: (3) ["ygo", "yg", "ygr"]
1: (3) ["yo", "y", "yr"]
2: (3) ["ybo", "yb", "ybr"]
length: 3
__proto__: Array(0)
1: Array(3)
0: (3) ["go", "g", "gr"]
1: (3) ["o", "", "r"]
2: (3) ["bo", "b", "br"]
length: 3
__proto__: Array(0)
2: Array(3)
0: (3) ["wgo", "wg", "wgr"]
1: (3) ["wo", "w", "wr"]
2: (3) ["wbo", "wb", "wbr"]
length: 3
__proto__: Array(0)
*/

const cubeSize = 3;
let cube = constructCube(cubeSize);


window.onload = () => {
    console.log("cube")
    console.log(deepCopy(cube));
    
    console.log("\ncube[0]")
    console.log(cube[0]);
    
    //setTimeout(() => {turn("U")}, 3000);
    turn("U", 1);
    
    console.log("\npost turn")
    console.log(cube);
}

function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}


function turn(side, amount = 1) {
    if (side === "U") {
        let before = deepCopy(cube)[0];
        let after = [];
        
        for (let i = 0; i < cubeSize; i++) {
            after.push([]);
            for (let j = 0; j < cubeSize; j++) {
                let indexes = [i, j];
                if (amount === 1) {
                    indexes = [cubeSize - 1 - j, i];
                } else if (amount === -1) {
                    indexes[0] = cubeSize - 1 - i;
                } else if (amount === 2) {
                    indexes = [cubeSize - 1 - i,
                               cubeSize - 1 - j];
                }
                after[i].push(before[indexes[0]][indexes[1]]);
            }
        }
        //cube.splice(0, 1, after);
        
        cube[0] = after;
        //cube = [after, cube[1], cube[2]];
    }
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