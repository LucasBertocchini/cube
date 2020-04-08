"use strict";

class Cube {
    constructor(size) {
        if (isNaN(size) || size < 2 || size % 1 !== 0)
        throw "size must be an integer greater than 1";
    
        let cube = [];
        let s = size - 1;

        for (let x = 0; x < size; x++) {
            cube.push([]);
            let plane = cube[x];

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

        this.pieces = cube;
    }
    
    turn(face, amount = 1) {this.pieces = Cube.turn(this.pieces, face, amount);}
    isSolved() {return Cube.isSolved(this.pieces);}

    turns(turnString) {
        if (!turnString) return;
        const turnList = turnString.split(" ");
        for (const turn of turnList) {
            if (turn.length === 1) this.turn(turn);
            else if (turn.length === 2) {
                if (turn[1] === "'") this.turn(turn[0], -1);
                else if (turn[1] === "2") this.turn(turn[0], 2);
                else throw "turns failed: " + turn;
            }
            else throw "turns failed: " + turn;
        }
    }

    copy() {
        let cube = new Cube(cubeSize);
        cube.pieces = deepCopy(this.pieces);
        return cube;
    }
    
    bruteForce(order) {return cubeBruteForce(this.pieces, order);}
    
    reset(clear = true) {
        this.pieces = new Cube(cubeSize).pieces;
        if (clear) console.clear();
    }

    sameAxis(face1, face2) {
        let axis = face => {
            for (let i = 0; i < 3; i++)
                if (axes[i].includes(face[0])) return i;
            throw "face must have axis";
        }
        if (axis(face1) === axis(face2)) return true;
        return false;
    }

    scramble(order = 100, log = false) {
        let turnsList = [];

        for (let i = 0; i < order; i++) {
            const prev = turnsList[turnsList.length - 1];

            let found = false;
            while (!found) {
                const index = randInt(turnsLength),
                    turn = turns[index];
                if (!prev ||
                    !this.sameAxis(turn.face, prev.face) ||
                    (turn.amount === prev.amount && turn.face !== prev.face)
                    ) {
                    if (log) console.log(turn);
                    this.turn(turn.face, turn.amount);
                    turnsList.push(turn);
                    found = true;
                }
            }
        }
    }

    
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

    turn(face, amount = 1) {this.pieces = edgesTurn(this.pieces, face, amount);}


    copy() {
        let cube = new Edges;
        cube.pieces = deepCopy(this.pieces);
        return cube;
    }
}