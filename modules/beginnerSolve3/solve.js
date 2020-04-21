"use strict";

function beginnerSolve3(displayCube = true) {
    if (cubeSize !== 3) throw "cube size must be 3 for beginnerSolve3";

    let cube = mainCube.copy();
    const solveFrom = {
        //the notation may be confusing; the main color is
        //actually solved onto the opposite face, and vice versa
        faces: {
            main: "U",
            opposite: "D"
        },
        colors: {
            main: "w",
            opposite: "y"
        },
    }
        
    let turns = new Turns(cube);

    solveFrom.faces.opposite = "L"
    orient(turns, solveFrom);
    // cross(turns, solveFrom);
    // firstLayer(turns, solveFrom);
    // secondLayer(turns, solveFrom);
    // Ucross(turns, solveFrom);

    
    //return
    if (displayCube) {
        mainCube.pieces = cube.pieces;
        display();
    }
    
    console.log(turns.string);
    console.log(turns.list.length + " turns");
    return turns;
}