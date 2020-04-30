"use strict";

class Cube {
    constructor(size) {
        if (isNaN(size) || size < 2 || size % 1 !== 0)
            throw "size must be an integer greater than 1";
    
        let pieces = [];
        const s = size - 1;

        for (let i = 0; i < size; i++) {
            pieces.push([]);
            let plane = pieces[i];
            for (let j = 0; j < size; j++) {
                plane.push([]);
                let line = plane[j];
                for (let k = 0; k < size; k++) {
                    let piece = "";

                    const
                    indices = [i, j, k],
                    faceList = sides.indices(indices);

                    for (const face of faceList) {
                        const color = colors.sides[face];
                        piece += color;
                    }

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
                const index = randInt(Turns.all.length),
                    turn = Turns.all[index];
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

    findCorner(corner) {
        for (const i of faces.cornerArray) {
            const plane = this.pieces[i];
            for (const j of faces.cornerArray) {
                const line = plane[j];
                for (const k of faces.cornerArray) {
                    const piece = line[k];

                    if (colors.isSamePiece(corner, piece))
                        return [i, j, k];
                }
            }
        }

        throw "corner not found";
    }

    findEdge(edge) {
        for (const i of faces.edgeArray) {
            for (const j of faces.edgeArray) {
                for (const k of faces.edgeArray) {
                    const indices = [i, j, k];

                    let count = 0;
                    for (const index of indices)
                        if (!faces.cornerArray.includes(index))
                            count++;
                    if (count !== 1) continue;

                    if (colors.isSamePiece(edge, this.indices(indices)))
                        return indices;
                }
            }
        }

        throw "edge not found";
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

    turn(...turnList) {
        for (const turn of turnList)
            this.pieces = edgesTurn(this.pieces, turn);
    }

    turns(turns) {
        if (!turns) return;
        const turnList = Turns.turnsToTurn(turns);
        this.turn(...turnList);
    }

    copy() {
        const cube = new Edges;
        cube.pieces = deepCopy(this.pieces);
        return cube;
    }
    indices(i) {return this.pieces[i[0]][i[1]][i[2]];}

    findEdge(edge) {
        for (const i of faces.edgeArray) {
            for (const j of faces.edgeArray) {
                for (const k of faces.edgeArray) {
                    const indices = [i, j, k];

                    let count = 0;
                    for (const index of indices)
                        if (!faces.cornerArray.includes(index))
                            count++;
                    if (count !== 1) continue;

                    if (colors.isSamePiece(edge, this.indices(indices)))
                        return indices;
                }
            }
        }

        throw "edge not found";
    }
}