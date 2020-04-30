"use strict";

function beginnerSolve3(displayCube = true) {
    if (cubeSize !== 3) throw "cube size must be 3 for beginnerSolve3";

    let cube = mainCube.copy();

    //the notation may be confusing; the main color is
    //actually solved onto the opposite face, and vice versa
    const
    mainFace = "U",
    mainColor = "w";
    
        
    let turns = new Turns(cube);

    orient(turns, mainFace, mainColor);
    cross(turns, mainFace, mainColor);
    firstLayer(turns, mainFace, mainColor);
    secondLayer(turns, mainFace, mainColor);
    crossMainFace(turns, mainFace, mainColor);
    OLL(turns, mainFace, mainColor);

    

    //return
    if (displayCube) {
        mainCube.pieces = cube.pieces;
        display();
    }
    
    console.log(turns.string);
    console.log(turns.list.length + " turns");

    return turns;
}