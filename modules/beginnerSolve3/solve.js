"use strict";

function beginnerSolve3(displayCube = true) {
    if (cubeSize !== 3) throw "cube size must be 3 for beginnerSolve3";

    let cube = mainCube.copy(),
        moves = [];

    let mainColor = "w";

    orient(cube, mainColor, moves);
    cross(cube, mainColor, moves);
    firstLayer(cube, mainColor, moves);
    
    //return
    if (displayCube) {
        mainCube = cube;
        display();
    }
    
    console.log(moves)
    return moves;
}