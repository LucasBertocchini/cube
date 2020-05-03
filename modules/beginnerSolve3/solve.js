"use strict";

function cubeBeginnerSolve3(cube, standard_U_w = false, update = true) {
    if (cubeSize !== 3) throw "cube size must be 3 for beginnerSolve3";

    const
    copy = cube.copy(),
    turns = new Turns(copy),
    start = Date.now();

    const bruteForce = copy.bruteForce(standard_U_w ? 2 : 3);
    if (bruteForce) {
        turns.turn(...bruteForce);
        return end();
    }

    let allTurns = [];

    if (standard_U_w) {
        const
        mainSide = "U",
        mainColor = "w",
        turnsInstance = solve(cube, mainSide, mainColor);

        turns.turns(turnsInstance.string);
    } else {
        for (const mainSide of sides.all) {
            for (const mainColor of colors.all) {
                //the notation may be confusing; the main color is
                //actually solved onto the opposite face
                const turnsInstance = solve(cube, mainSide, mainColor);
                allTurns.push(turnsInstance);
            }
        }

        const shortestTurns = allTurns.reduce(
            (a, b) => (a.list.length - b.list.length > 0) ? b : a
        );
        turns.turns(shortestTurns.string);
    }

    return end();

    function end() {
        if (!copy.isSolved()) throw "cube not solved";

        const end = Date.now();

        if (update) {
            cube.pieces = copy.pieces;
            display();
        }

        console.log(turns.string);
        console.log(`${turns.list.length} turns in ${end - start} ms`);

        return turns;
    }
}

function solve(cube, mainSide, mainColor) {
    const
    copy = cube.copy(),
    turns = new Turns(copy);

    orient(turns, mainSide, mainColor);
    cross(turns, mainSide, mainColor);
    firstLayer(turns, mainSide, mainColor);
    secondLayer(turns, mainSide, mainColor);
    crossMainFace(turns, mainSide, mainColor);
    OLL(turns, mainSide, mainColor);
    PLL(turns, mainSide, mainColor);

    return turns;
}