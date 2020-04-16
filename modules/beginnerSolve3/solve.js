"use strict";

class Moves {
    constructor(cube) {
        this.list = [];
        this.string = "";
        this.cube = cube;
    }
    
    turn(...turns) {
        //change to use cube.turnToTurns
        for (const turn of turns) {
            const turnString = Cube.turnToTurns(turn);
            if (this.string) this.string += " ";
            this.string += turnString;

            this.list.push(turn)

            this.cube.turn(turn);
        }
    }

    turns(turns) {
        if (!turns) return;

        const turnList = Cube.turnsToTurn(turns);
        for (const turn of turnList)
            this.list.push(turn);

        if (this.string) this.string += " ";
        this.string += turns;

        this.cube.turns(turns);
    }
}

function beginnerSolve3(displayCube = true) {
    if (cubeSize !== 3) throw "cube size must be 3 for beginnerSolve3";

    let cube = mainCube.copy();
    const solveFrom = {
        faces: {
            main: "U",
            opposite: "D"
        },
        colors: {
            main: "w",
            opposite: "y"
        },
    }
        
    let moves = new Moves(cube);


    orient(moves, solveFrom);
    cross(moves, solveFrom);
    // firstLayer(moves, solveFrom);
    // secondLayer(moves, solveFrom);
    // Ucross(moves, solveFrom);
    
    //return
    if (!displayCube) {
        mainCube = cube;
        display();
    }
    
    console.log(moves.string)
    console.log(moves.list.length + " moves")
    return moves;
}