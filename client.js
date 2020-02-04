"use strict";

let cube = [
    //     F     S      B     
    [ //U
        ["ybr", "yr", "ygr"], //R
        ["yb" , "y" , "yg" ], //M
        ["ybo", "yo", "ygo"]  //L
    ],
    [ //E
        ["br" , "r" , "gr" ], //R
        ["b"  , ""  , "g"  ], //M
        ["bo" , "o" , "go" ]  //L
    ],
    [ //D
        ["wbr", "wr", "wgr"], //R
        ["wb" , "w" , "wg" ], //M
        ["wbo", "wo", "wgo"]  //L
    ]
]


window.onload = () => {
    
}

function turn(side) {
    if (side === "U") {
        [
            [1,2,3],
            [4,5,6],
            [7,8,9]
        ]
        [
            [3,6,9],
            [2,5,8],
            [1,4,7]
        ]
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