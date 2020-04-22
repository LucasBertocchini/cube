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

const
cubeSize = 3,
mainCube = new Cube(cubeSize);

const faces = {
    sides: ["U", "D", "B", "F", "L", "R"],
    middles: ["E", "S", "M"],
    amounts: [1, -1, 2],
    colors: {
        y: "yellow",
        w: "white",
        g: "green",
        b: "blue",
        o: "orange",
        r: "red",
    },
    sameAxis: (face1, face2) => {
        const axis = face => {
            for (const axis of cube3.axes)
                if (axis.includes(face[0])) return axis;
            throw "face must have axis";
        }
        if (axis(face1) === axis(face2)) return true;
        return false;
    },
    opposite: {
        U: "D", D: "U",
        B: "F", F: "B",
        L: "R", R: "L"
    },
    index: {
        U: 0, D: 0,
        F: 1, B: 1,
        L: 2, R: 2
    },
    clockwise: {
        U: {B: "R", R: "F", F: "L", L: "B"},
    },
    counterclockwise: {
        U: {B: "L", L: "F", F: "R", R: "B"},
    },
    angle: (reference) => (face1, face2) => {
        if (face1 === face2)
            return 0;
        if (faces.clockwise[reference][face1] === face2)
            return 1;
        if (faces.counterclockwise[reference][face1] === face2)
            return -1;
        if (faces.opposite[face1] === face2)
            return 2;

        throw "faces not on same plane";
    },
    indices: indices => {
        let faceList = [];
        for (const [face, centerIndices] of Object.entries(cube3.centerIndices))
            if (sharesElements(indices, centerIndices, 2))
                faceList.push(face);
        return faceList;
    },
};
faces.all = ((sides, middles) => {
    if (cubeSize === 3) return sides.concat(middles);
    if (cubeSize === 2) return sides;
    if (cubeSize > 3) {
        let temp = [];
        for (let layer = 1; layer < cubeSize - 1; layer++)
            middles.forEach(middle => temp.push(middle + layer.toString()));
    }

    throw "cube size must be 2, 3, or >3";
})(faces.sides, faces.middles);

class Turns {
    constructor(cube) {
        this.list = [];
        this.string = "";
        if (cube) this.cube = cube;
    }
    turn(...turnList) {
        //change to use cube.turnToTurns
        for (const turn of turnList) {
            const turnString = Turns.turnToTurns(turn);
            if (this.string) this.string += " ";
            this.string += turnString;

            this.list.push(turn)

            this.cube.turn(turn);
        }
    }
    turns(turns) {
        if (!turns) return;

        const turnList = Turns.turnsToTurn(turns);
        for (const turn of turnList)
            this.list.push(turn);

        if (this.string) this.string += " ";
        this.string += turns;

        this.cube.turns(turns);
    }

    static calcTurns(faceList) {
        let result = [];
        faceList.forEach(face => 
            faces.amounts.forEach(
                amount => result.push({face, amount})
            )
        );
        return result;
    }
    static oppositeAmount(amount) {return (amount === 2) ? 2 : -amount}
    static turnsToTurn(turns) {
        if (!turns) return [];

        const turnsList = turns.split(" ");
        let turnList = [];
        for (const turn of turnsList) {
            if (turn.length > 1) {
                switch (turn.slice(-1)) {
                    case "'":
                        turnList.push({
                            face: turn[0],
                            amount: -1
                        });
                        break;
                    case "2":
                        turnList.push({
                            face: turn[0],
                            amount: 2
                        });
                        break;
                    default:
                        throw "amount not ' or 2";
                }
            } else turnList.push({
                face: turn,
                amount: 1
            });
        }

        return turnList;
    }
    static turnToTurns(turn) {
        let amountSymbol;

        switch(turn.amount) {
            case 1:
                return turn.face;
            case -1:
                amountSymbol = "'"
                break;
            case 2:
                amountSymbol = "2"
                break;
            default:
                throw "turn amount must be 1, -1, or 2: " + turn.amount;
        }

        return turn.face + amountSymbol;
    }
}
const allTurns = Turns.calcTurns(faces.all);

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
    layers: {
        U: 0, E: 1, D: 2,
        B: 0, S: 1, F: 2,
        L: 0, M: 1, R: 2
    },
    axes: [
        ["U", "E", "D"],
        ["B", "S", "F"],
        ["L", "M", "R"]
    ],
    edgeArray: [0, 1, 2],
};

const cube2 = {
    layers: {
        U: 0, D: 1,
        B: 0, F: 1,
        L: 0, R: 1
    },
};

Object.freeze(faces);
Object.freeze(cube3);
Object.freeze(cube2);

// const
// amounts = {
//     //same
//     "[[0,0],[0,0]]": 0,
//     "[[0,2],[0,2]]": 0,
//     "[[2,0],[2,0]]": 0,
//     "[[2,2],[2,2]]": 0,

//     //three in a row
//     "[[2,0],[0,0]]": 1,
//     "[[0,0],[0,2]]": 1,
//     "[[2,2],[2,0]]": 1,
//     "[[0,2],[2,2]]": 1,

//     //three not in a row
//     "[[0,2],[0,0]]": -1,
//     "[[2,2],[0,2]]": -1,
//     "[[0,0],[2,0]]": -1,
//     "[[2,0],[2,2]]": -1,

//     //two of each number; inverses of eachother
//     "[[2,2],[0,0]]": 2,
//     "[[2,0],[0,2]]": 2,
//     "[[0,2],[2,0]]": 2,
//     "[[0,0],[2,2]]": 2,
// },
// indicesFacesList = [
//     {indices: [0, 0], faces: ["L", "B"]},
//     {indices: [0, 2], faces: ["B", "R"]},
//     {indices: [2, 2], faces: ["R", "F"]},
//     {indices: [2, 0], faces: ["F", "L"]}
// ],
// clockwiseSides = {
//     B: 0,
//     R: 1,
//     F: 2,
//     L: 3
// },
// ccSide = {
//     B: "L", F: "R",
//     L: "F", R: "B"
// };
















function isSamePiece(piece1, piece2) {
    if (piece1 === piece2 ||
        piece1.split("").sort().join("") === piece2
        ) return true;
    return false;
}














window.onload = () => {
    displaySetup();
    
    //mainCube.pieces = [[["goy","yg","gry"],["yb","b","yo"],["yrb","wo","grw"]],[["rb","r","yr"],["y","","w"],["rw","o","bo"]],[["obw","bw","oby"],["og","g","rg"],["ogw","gw","rwb"]]]

    mainCube.pieces = [[["bwr","wb","bwo"],["by","r","rg"],["wgo","wo","goy"]],[["yo","y","gy"],["b","","g"],["wr","w","ry"]],[["byr","og","yob"],["bo","o","wg"],["gyr","rb","rgw"]]]

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


function sharesElements(array1, array2, n) {
    let count = 0;
    for (const i in array1)
        if (array1[i] === array2[i])
            count++;
    return (count === n);
}
function keysByValue(object, value) {
    let keys = [];
    for (const [key, val] of Object.entries(object))
        if (val === value)
            keys.push(key);
    return keys;
}
function XOR(...conditions) {
    let count = 0;
    for (const condition of conditions)
        if (condition)
            count++;
    return count % 2 === 1;
}