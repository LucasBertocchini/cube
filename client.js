"use strict";

const cubeSize = 3;
let cube = constructCube(cubeSize);

window.onload = () => {
    console.log(cube);
    turn("U")
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

function turn(side, amount = 1) {
    if (side === "U") {
        let before = cube[0];
        let after = [];
        
        for (let i = 0; i < before.length; i++) {
            after.push([]);
            for (let j = 0; j < before[i].length; j++) {
                if (amount === 1) {
                    let index = before.length - 1 - j;
                    after[i].push(before[index][i]);
                } else if (amount === -1) {
                    let index = before.length - 1 - i;
                    after[i].push(before[j][index]);
                } else if (amount === 2) {
                    
                }
                
            }
        }
        
        [
            [1,2,3],
            [4,5,6],
            [7,8,9]
        ]
        [
            [9,8,7],
            [6,5,4],
            [3,2,1]
        ]
        
        console.table(before)
        console.table(after)
    }
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