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

const faces = ["U", "D", "F", "B", "L", "R"],
      middles = ["E", "S", "M"],
      turnAmounts = [1, -1, 2],
      sides = (() => {
            if (cubeSize === 3) return faces.concat(middles);
            else if (cubeSize === 2) return faces;
            else if (cubeSize > 3) {
                let temp = [];
                for (let layer = 1; layer < cubeSize - 1; layer++) {
                    middles.forEach(middle => temp.push(middle + layer.toString()));
                }
            } else throw "cube size must be 2, 3, or >3";
        })(),
      turns = (() => {
            let temp = [];
            sides.forEach(side => 
                turnAmounts.forEach(
                    amount => temp.push({side, amount})
                )
            );
            return temp;
        })(),
      turnsLength = turns.length;


    



window.onload = () => {
    displaySetup();
    
    //randomizeCube(50, false);
    //mainCube = [[["goy","bo","wrg"],["og","y","yr"],["brw","oy","ryb"]],[["gr","g","yb"],["o","","r"],["br","b","gy"]],[["ybo","rw","ogw"],["wo","w","wg"],["owb","wb","ryg"]]];
    //turnSideMainCube("D");
    //turnSideMainCube("R", 2);
    //console.log(beginnerSolve3());

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


//cube functions


function randomizeCube(order, log = true) {
    for (let i = 0; i < order; i++) {
        let index = randInt(turnsLength);
        let turn = turns[index];
        if (log) console.log(turn);
        mainCube = Cube.turnSide(mainCube, turn.side, turn.amount);
    }
}
function turnSideMainCube(side, amount = 1) {
    mainCube = Cube.turnSide(mainCube, side, amount);
    display();
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