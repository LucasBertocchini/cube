"use strict";

function beginnerSolve3(displayCube = true) {
    let cube = deepCopy(mainCube),
        moves = [];
    
    //choose color to solve from
    let mainColor = "w";
    
    
    
    //orient cube with color side on D
    let orientations = [
        {indices: [0, 1, 1], side: "M", amount: 2},  //U
        {indices: [1, 2, 1], side: "M", amount: 1},  //F
        {indices: [1, 0, 1], side: "M", amount: -1}, //B
        {indices: [1, 1, 0], side: "S", amount: -1}, //L
        {indices: [1, 1, 2], side: "S", amount: 1}   //R
    ];
    for (let orientation of orientations) {
        const i = orientation.indices,
              side = orientation.side,
              amount = orientation.amount;
        if (cube[i[0]][i[1]][i[2]] === mainColor) {
            moves.push({side, amount});
            cube = turnSide(cube, side, amount);
        }
    }
    
    
    
    //cross
    console.log(cube[2]);
    if (cube[2][2][1][0] === mainColor) { //F
        console.log(cube[2][2][1][1]);
    }
    else if (cube[2][0][1][0] === mainColor) { //B
        console.log(cube[2][0][1][1]);
    }
    else if (cube[2][1][0][0] === mainColor) { //L
        console.log(cube[2][1][0][1]);
    }
    else if (cube[2][1][2][0] === mainColor) { //R
        console.log(cube[2][1][2][1]);
    }
    // place the cross on U then bring down to D
    
    
    
    //return
    if (displayCube) {
        mainCube = cube;
        display();
    }
    
    return moves;
}