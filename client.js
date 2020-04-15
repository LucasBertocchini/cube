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








    axes = [["U", "E", "D"], ["F", "S", "B"], ["L", "M", "R"]],
    faceIndices = {
        "U": 0, "D": 0,
        "F": 1, "B": 1,
        "L": 2, "R": 2
    },
    amounts = {
        //same
        "[[0,0],[0,0]]": 0,
        "[[0,2],[0,2]]": 0,
        "[[2,0],[2,0]]": 0,
        "[[2,2],[2,2]]": 0,

        //three in a row
        "[[2,0],[0,0]]": 1,
        "[[0,0],[0,2]]": 1,
        "[[2,2],[2,0]]": 1,
        "[[0,2],[2,2]]": 1,

        //three not in a row
        "[[0,2],[0,0]]": -1,
        "[[2,2],[0,2]]": -1,
        "[[0,0],[2,0]]": -1,
        "[[2,0],[2,2]]": -1,

        //two of each number; inverses of eachother
        "[[2,2],[0,0]]": 2,
        "[[2,0],[0,2]]": 2,
        "[[0,2],[2,0]]": 2,
        "[[0,0],[2,2]]": 2,
    },
    indicesFacesList = [
        {indices: [0, 0], faces: ["L", "B"]},
        {indices: [0, 2], faces: ["B", "R"]},
        {indices: [2, 2], faces: ["R", "F"]},
        {indices: [2, 0], faces: ["F", "L"]}
    ],
    clockwiseSides = {
        B: 0,
        R: 1,
        F: 2,
        L: 3
    },
    oppositeSide = {
        U: "D", D: "U",
        B: "F", F: "B",
        L: "R", R: "L"
    },
    ccSide = {
        B: "L", F: "R",
        L: "F", R: "B"
    };






const cube3 = {
    centerIndices: {
        U: [0, 1, 1],
        D: [2, 1, 1],
        F: [1, 2, 1],
        B: [1, 0, 1],
        L: [1, 1, 0],
        R: [1, 1, 2]
    },
    centerColor: (cube, face) => {
        const indices = cube3.centerIndices[face];
        return cube.indices(indices);
    },
    edgeIndices: [
        [0, 1],
        [1, 2],
        [2, 1],
        [1, 0]
    ],
};









window.onload = () => {
    displaySetup();
    
    mainCube.pieces = [[["goy","yg","gry"],["yb","b","yo"],["yrb","wo","grw"]],[["rb","r","yr"],["y","","w"],["rw","o","bo"]],[["obw","bw","oby"],["og","g","rg"],["ogw","gw","rwb"]]]

    const start = Date.now();




    beginnerSolve3();





    const end = Date.now();
    console.log(end - start + " ms")
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

function sharesValues(array1, array2, n) {
    let count = 0;
    for (const i in array1)
        if (array1[i] === array2[i])
            count++;
    return (count === n);
}

function sharesElements(array1, array2, n) {
    let count = 0;
    for (const i in array1)
        if (array1[i] === array2[i])
            count++;
    return (count === n);
}