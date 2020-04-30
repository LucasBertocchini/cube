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
];
*/

const mainCube = new Cube(cubeSize);


window.onload = () => {
    displaySetup();

    mainCube.pieces =[[["gwo","bo","brw"],["br","o","go"],["ryg","gr","grw"]],[["oy","w","by"],["b","","g"],["gy","y","rw"]],[["oyb","gw","bow"],["wo","r","ry"],["ybr","wb","gyo"]]]

    const start = Date.now();


    if (0)
        for (let i = 1; i < 500; i++) {
            mainCube.scramble();
            beginnerSolve3();
        }
    else
        beginnerSolve3();




    const end = Date.now();
    console.log(end - start + " ms");
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