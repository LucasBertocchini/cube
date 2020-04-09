"use strict";
// TU resident: column0679dough
// link: file:///C:/Users/User/Desktop/cube/index.html
/* 3x3 cube = [
           L     M      R
    [  U
        ["ygo", "yg", "ygr"], B
        ["yo" , "y" , "yr" ], S
        ["ybo", "yb", "ybr"]  F
    ],
    [  E
        ["go" , "g" , "gr" ], B
        ["o"  , ""  , "r"  ], S
        ["bo" , "b" , "br" ]  F
    ],
    [  D
        ["wgo", "wg", "wgr"], B
        ["wo" , "w" , "wr" ], S
        ["wbo", "wb", "wbr"]  F
    ]
]
*/

const cubeSize = 3;

let mainCube = new Cube(cubeSize);

const colors = {
        y: "yellow",
        w: "white",
        g: "green",
        b: "blue",
        o: "orange",
        r: "red",
        G: "gray"
    },
    layers = {
        U: 0, E: 1, D: 2,
        B: 0, S: 1, F: 2,
        L: 0, M: 1, R: 2
    };

const sides = ["U", "D", "F", "B", "L", "R"],
    middles = ["E", "S", "M"],
    turnAmounts = [1, -1, 2],
    faces = (() => {
        if (cubeSize === 3) return sides.concat(middles);
        else if (cubeSize === 2) return sides;
        else if (cubeSize > 3) {
            let temp = [];
            for (let layer = 1; layer < cubeSize - 1; layer++)
                middles.forEach(middle => temp.push(middle + layer.toString()));
        } else throw "cube size must be 2, 3, or >3";
    })(),
    calcTurns = sideList => {
        let result = [];
        sideList.forEach(face => 
            turnAmounts.forEach(
                amount => result.push({face, amount})
            )
        );
        return result;
    },
    turns = calcTurns(faces),
    turnsLength = turns.length,
    sideTurns = calcTurns(sides),
    sideTurnsLength = sideTurns.length,
    axes = [["U", "E", "D"], ["F", "S", "B"], ["L", "M", "R"]];

window.onload = () => {
    displaySetup();
    
    mainCube.pieces = [[["ybr","yr","gry"],["rg","o","wg"],["ybo","ob","grw"]],[["yg","y","rw"],["g","","b"],["oy","w","go"]],[["gow","wo","bow"],["bw","r","by"],["wrb","br","yog"]]];

    console.time();
    beginnerSolve3();
    console.timeEnd();

    display();
}












//helper functions
function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}

function reorder(string, ...indices) {
    let newString = "";
    for (const index of indices)
        newString += string[index];
    return newString;
}

function randInt(n) {
    return Math.floor(Math.random() * n);
}

function permute(array) {
    //https://stackoverflow.com/questions/9960908/permutations-in-javascript
    const length = array.length;
    let result = [array.slice()],
        c = Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = array[i];
            array[i] = array[k];
            array[k] = p;
            c[i]++;
            i = 1;
            result.push(array.slice());
        } else {
            c[i] = 0;
            i++;
        }
    }
    return result;
}

function eqarray(array1, array2) {
    return (JSON.stringify(array1) === JSON.stringify(array2));
}




/*
function moveSets(n) {
    let indices = Array(n).fill(0);
    let length = faces.length;
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
                    let side = faces[index1];
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
}*/