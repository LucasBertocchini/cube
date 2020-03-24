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

let mainCube = new Cube(cubeSize);

const colors = {
    y: "yellow",
    w: "white",
    g: "green",
    b: "blue",
    o: "orange",
    r: "red"
},
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
    turns = (() => {
        let temp = [];
        faces.forEach(face => 
            turnAmounts.forEach(
                amount => temp.push({face, amount})
            )
        );
        return temp;
    })(),
    turnsLength = turns.length,
    sideTurns = (() => {
        let temp = [];
        sides.forEach(face => 
            turnAmounts.forEach(
                amount => temp.push({face, amount})
            )
        );
        return temp;
    })(),
    sideTurnsLength = sideTurns.length,
    /*solvedCubes = (() => {
        let solvedCubes = [];
        let tempCube = new Cube(cubeSize);
        tempCube.turn("x");
        for (let i = 0; i < 6; i++) { // 6 faces
            if (i % 2 === 0) tempCube.turn("x", -1);
            else tempCube.turn("y");
            for (let j = 0; j < 4; j++) { // 4 rotations per face
                const stringedCube = JSON.stringify(tempCube.pieces);
                solvedCubes.push(stringedCube);
                tempCube.turn("z");
            }
        }
        return solvedCubes;
    })(),*/
    axes = [["U", "E", "D"], ["F", "S", "B"], ["L", "M", "R"]];

window.onload = () => {
    displaySetup();
    
    mainCube.pieces = [[["goy","bo","wrg"],["og","y","yr"],["brw","oy","ryb"]],[["gr","g","yb"],["o","","r"],["br","b","gy"]],[["ybo","rw","ogw"],["wo","w","wg"],["owb","wb","ryg"]]];
    mainCube.turn("D");
    mainCube.turn("R", 2);
    mainCube.turn("D");
    // mainCube.turn("L", 2);
    // mainCube.turn("U");
    // mainCube.turn("R", 2);
    console.time();
    beginnerSolve3();
    console.timeEnd();


    // mainCube.pieces = [[["bry","br","brw"],["rg","o","yb"],["ryg","ow","yob"]],[["gy","g","oy"],["w","","y"],["bo","b","ry"]],[["ogy","og","grw"],["rw","r","gw"],["wbo","wb","gow"]]];
    // console.log(mainCube.bruteForce(4));

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

function randInt(n) {
    return Math.floor(Math.random() * n);
}

function permutations(array) {
    //https://stackoverflow.com/questions/9960908/permutations-in-javascript
    let length = array.length,
        result = [array.slice()],
        c = new Array(length).fill(0),
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


//cube functions


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
}