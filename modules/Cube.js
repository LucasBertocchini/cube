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

                    if (x === 0)
                        piece += "y";
                    else if (x === s)
                        piece += "w";

                    if (y === 0)
                        piece += "g";
                    else if (y === s)
                        piece += "b";

                    if (z === 0)
                        piece += "o";
                    else if (z === s)
                        piece += "r";

                    line.push(piece);
                }
            }
        }
        this.pieces = cube;
    }
    
    turn(side, amount = 1, updateNotReturn = true) {
        if (!turnAmounts.includes(amount)) throw "turn amount must be 1, -1, or 2";

        // conjugate the direction for opposite sides
        if (["D", "B", "R"].includes(side) && amount !== 2)
            amount *= -1;


        let layer = layers[side];
        if (layer === undefined) layer = parseInt(side.slice(1));
        let after = deepCopy(this.pieces);

        function calcIndexes(i, j, iPrime, jPrime) {
            let indexes;
            if (amount === 1)
                indexes = [jPrime, i];
            else if (amount === -1)
                indexes = [j, iPrime];
            else if (amount === 2)
                indexes = [iPrime, jPrime];
            return indexes;
        }

        function calcPieces(newPieceFunction) {
            for (let i = 0; i < cubeSize; i++) {
                const iPrime = cubeSize - 1 - i;
                for (let j = 0; j < cubeSize; j++) {
                    const jPrime = cubeSize - 1 - j;
                    let indexes = calcIndexes(i, j, iPrime, jPrime);
                    newPieceFunction(i, j, indexes);
                }
            }
        }
        
        /* loops are inside the if statements to avoid calling if's
        many times unnecisarily */
        if (side === "U" || side === "D") {
            calcPieces((i, j, indexes) => {
                let newPiece = this.pieces[layer][indexes[0]][indexes[1]];

                if (newPiece.length === 3 && amount !== 2)
                    newPiece = reorder(newPiece, 0, 2, 1);

                after[layer][i][j] = newPiece;
            });
        } else if (side === "F" || side === "B") {
            calcPieces((i, j, indexes) => {
                let newPiece = this.pieces[indexes[0]][layer][indexes[1]];

                if (newPiece.length === 3 && amount !== 2)
                    newPiece = reorder(newPiece, 2, 1, 0);
                else if (newPiece.length === 2 && amount !== 2)
                    newPiece = reorder(newPiece, 1, 0);

                after[i][layer][j] = newPiece;
            });
        } else if (side === "L" || side === "R") {
            calcPieces((i, j, indexes) => {
                let newPiece = this.pieces[indexes[0]][indexes[1]][layer];

                if (newPiece.length === 3 && amount !== 2)
                    newPiece = reorder(newPiece, 1, 0, 2);

                after[i][j][layer] = newPiece;
            });
        } else if (side[0] === "E") {
            calcPieces((i, j, indexes) => {
                let newPiece = this.pieces[layer][indexes[0]][indexes[1]];

                if (newPiece.length === 2 && amount !== 2)
                    newPiece = reorder(newPiece, 1, 0);

                after[layer][i][j] = newPiece;
            });
        } else if (side[0] === "S") {
            calcPieces((i, j, indexes) => {
                let newPiece = this.pieces[indexes[0]][layer][indexes[1]];

                if (newPiece.length === 2 && amount !== 2)
                    newPiece = reorder(newPiece, 1, 0);

                after[i][layer][j] = newPiece;
            });
        } else if (side[0] === "M") {
            calcPieces((i, j, indexes) => {
                let newPiece = this.pieces[indexes[0]][indexes[1]][layer];

                if (newPiece.length === 2 && amount !== 2)
                    newPiece = reorder(newPiece, 1, 0);

                after[i][j][layer] = newPiece;
            });
        } else throw "side must be U, D, L, R, F, B, E(n), S(n), or M(n)";

        if (updateNotReturn) this.pieces = after;
        else return after;
    }
    
    returnTurn(side, amount = 1) {
        return this.turn(side, amount, false);
    }
    
    turnCube(axis, amount = 1) {
        let after,
            negAmount = (amount === 2) ? 2 : -amount;

        if (axis === "x") {
            this.turn("R", amount);
            this.turn("M", negAmount);
            this.turn("L", negAmount);
        } else if (axis === "y") {
            this.turn("U", amount);
            this.turn("E", amount);
            this.turn("D", negAmount);
        } else if (axis === "z") {
            this.turn("F", amount);
            this.turn("S", amount);
            this.turn("B", negAmount);
        } else throw "axis must be x, y, or z";
    }
}