"use strict";

let cube = [
    [ // white side
        ["wbr", "wr", "wgr"],
        ["wb", "w", "wg"],
        ["wbo", "wo", "wgo"]
    ],
    [
        ["br", "r", "gr"],
        ["b", "", "g"],
        ["bo", "o", "go"]
    ],
    [ // yellow side
        ["ybr", "yr", "ygr"],
        ["yb", "y", "yg"],
        ["ybo", "yo", "ygo"]
    ]
]


window.onload = () => {
    console.table(cube);
}


function turn(side) {
    
}