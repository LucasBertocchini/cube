"use strict";

class Moves {
    constructor(cube, mainColor) {
        this.list = [];
        this.string = "";
        this.cube = cube;
        this.mainColor = mainColor
    }

    movesSingular(turn) {
        const turnString = Cube.turnToTurns(turn);
        if (this.string) this.string += " ";
        this.string += turnString;

        this.list.push(turn)

        this.cube.turn(turn.face, turn.amount);
    }

    turn(turns) {
        if (Array.isArray(turns)) {
            if (!turns.length) return;

            for (const turn of turns)
                this.movesSingular(turn)
        }
        else
            this.movesSingular(turns)
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
    const mainColor = "w";
        
    let moves = new Moves(cube, mainColor);


    orient(cube, mainColor, moves);
    cross(moves.cube, mainColor, moves);
    firstLayer(moves.cube, mainColor, moves);
    secondLayer(moves.cube, mainColor, moves);
    Ucross(moves.cube, mainColor, moves);
    
    //return
    if (displayCube) {
        mainCube = cube;
        display();
    }
    
    console.log(moves.string)
    return moves;
}