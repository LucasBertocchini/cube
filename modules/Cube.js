"use strict";

class Cube {
    constructor(size) {
        if (isNaN(size) || size < 2 || size % 1 !== 0)
            throw "size must be an integer greater than 1";
    
        let pieces = [];
        const s = size - 1;

        for (let x = 0; x < size; x++) {
            pieces.push([]);
            let plane = pieces[x];
            for (let y = 0; y < size; y++) {
                plane.push([]);
                let line = plane[y];
                for (let z = 0; z < size; z++) {
                    let piece = "";

                    if      (x === 0) piece += "y";
                    else if (x === s) piece += "w";
                    if      (y === 0) piece += "g";
                    else if (y === s) piece += "b";
                    if      (z === 0) piece += "o";
                    else if (z === s) piece += "r";

                    line.push(piece);
                }
            }
        }

        this.pieces = pieces;
    }
    
    turn(...turnList) {
        for (const turn of turnList)
            this.pieces = Cube.turn(this.pieces, turn);
    }
    turns(turns) {
        if (!turns) return;
        const turnList = Turns.turnsToTurn(turns);
        this.turn(...turnList);
    }

    isSolved() {return Cube.isSolved(this.pieces);}

    copy() {
        const cube = new Cube(cubeSize);
        cube.pieces = deepCopy(this.pieces);
        return cube;
    }
    
    bruteForce(order) {return cubeBruteForce(this.pieces, order);}
    
    reset(clear = true) {
        this.pieces = new Cube(cubeSize).pieces;
        if (clear) console.clear();
    }

    scramble(order = 100, log = false) {
        let turnsList = [];

        for (let i = 0; i < order; i++) {
            const prev = turnsList[turnsList.length - 1];

            let found = false;
            while (!found) {
                const index = randInt(allTurns.length),
                    turn = allTurns[index];
                if (!prev ||
                    !faces.sameAxis(turn.face, prev.face) ||
                    (turn.amount === prev.amount && turn.face !== prev.face)
                    ) {
                    if (log) console.log(turn);
                    this.turn(turn);
                    turnsList.push(turn);
                    found = true;
                }
            }
        }
    }

    indices(i) {return this.pieces[i[0]][i[1]][i[2]];}
    static indices(pieces, i) {return pieces[i[0]][i[1]][i[2]];}
}

class Edges {
    constructor(pieces) {
        if (pieces) {
            let edges = [];

            for (let x = 0; x < cubeSize; x++) {
                edges.push([]);
                let edgesPlane = edges[x];
                const plane = pieces[x];

                 for (let y = 0; y < cubeSize; y++) {
                    edgesPlane.push([]);
                    let edgesLine = edgesPlane[y];
                    const line = plane[y];

                     for (let z = 0; z < cubeSize; z++) {
                        let edgesPiece = edgesLine[z];
                        const piece = line[z];

                        if (piece.length === 2)
                            edgesLine.push(piece);
                        else edgesLine.push(null);
                    }
                }
            }

            this.pieces = edges;
        }
    }

    turn(...turns) {
        for (const turn of turns)
            this.pieces = edgesTurn(this.pieces, turn);
    }

    turns(turnString) {
        if (!turnString) return;
        const turnList = turns.turnsToTurn(turnString);
        this.turn(...turnList);
    }

    copy() {
        const cube = new Edges;
        cube.pieces = deepCopy(this.pieces);
        return cube;
    }
    indices(i) {return this.pieces[i[0]][i[1]][i[2]];}
}