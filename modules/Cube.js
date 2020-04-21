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
    
    turn(...turns) {
        for (const turn of turns)
            this.pieces = Cube.turn(this.pieces, turn);
    }
    isSolved() {return Cube.isSolved(this.pieces);}

    turns(turnString) {
        if (!turnString) return;
        const turnList = Cube.turnsToTurn(turnString);
        for (const turn of turnList)
            this.turn(turn);
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


    scramble(order = 100, log = false) {
        let turnsList = [];

        for (let i = 0; i < order; i++) {
            const prev = turnsList[turnsList.length - 1];

            let found = false;
            while (!found) {
                const index = randInt(turns.all.length),
                    turn = turns.all[index];
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

    static turnsToTurn(turns) {
        if (!turns) return [];

        const turnsList = turns.split(" ");
        let turnList = [];
        for (const turn of turnsList) {
            if (turn.length > 1) {
                switch (turn.slice(-1)) {
                    case "'":
                        turnList.push({
                            face: turn[0],
                            amount: -1
                        });
                        break;
                    case "2":
                        turnList.push({
                            face: turn[0],
                            amount: 2
                        });
                        break;
                    default:
                        throw "amount not ' or 2";
                }
            } else turnList.push({
                face: turn,
                amount: 1
            });
        }

        return turnList;
    }

    static turnToTurns(turn) {
        let amountSymbol;

        switch(turn.amount) {
            case 1:
                return turn.face;
            case -1:
                amountSymbol = "'"
                break;
            case 2:
                amountSymbol = "2"
                break;
            default:
                throw "turn amount must be 1, -1, or 2: " + turn.amount;
        }

        return turn.face + amountSymbol;
    }

    indices(i) {return this.pieces[i[0]][i[1]][i[2]];}
    static indices(pieces, i) {return pieces[i[0]][i[1]][i[2]];}

    static clockwiseFace(reference, face) {
        if (reference !== "U") throw "not set up for references other than U";

        if (face === "B")
            return "R";
        if (face === "R")
            return "F";
        if (face === "F")
            return "L";
        if (face === "L")
            return "B";
    }

    static counterclockwiseFace(reference, face) {
        if (reference !== "U") throw "not set up for references other than U";

        if (face === "B")
            return "L";
        if (face === "L")
            return "F";
        if (face === "F")
            return "R";
        if (face === "R")
            return "B";
    }

    static angleBetweenFaces(reference, face1, face2) {
        if (reference !== "U") throw "not set up for references other than U";

        if (face1 === face2)
            return 0;
        if (Cube.clockwiseFace(reference, face1) === face2)
            return 1;
        if (Cube.counterclockwiseFace(reference, face1) === face2)
            return -1;
        if (oppositeSide[face1] === face2)
            return 2;

        throw "faces not on same plane";
    }

    static faces(indices) {
        let faceList = [];
        for (const [face, centerIndices] of Object.entries(cube3.centerIndices))
            if (sharesElements(indices, centerIndices, 2))
                faceList.push(face);
        return faceList;
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

    turn(...turns) {
        for (const turn of turns)
            this.pieces = edgesTurn(this.pieces, turn);
    }

    turns(turnString) {
        if (!turnString) return;
        const turnList = Cube.turnsToTurn(turnString);
        for (const turn of turnList)
            this.turn(turn);
    }

    copy() {
        let cube = new Edges;
        cube.pieces = deepCopy(this.pieces);
        return cube;
    }
    indices(i) {return this.pieces[i[0]][i[1]][i[2]];}
}