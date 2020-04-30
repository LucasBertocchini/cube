"use strict";

const cubeSize = 3;


const sides = {
    all: ["U", "D", "B", "F", "L", "R"],
    opposite: {
        U: "D", D: "U",
        B: "F", F: "B",
        L: "R", R: "L"
    },
    clockwise: {
        U: {B: "R", R: "F", F: "L", L: "B"},
        D: {B: "L", L: "F", F: "R", R: "B"},
        B: {U: "L", L: "D", D: "R", R: "U"},
        F: {U: "R", R: "D", D: "L", L: "U"},
        L: {U: "F", F: "D", D: "B", B: "U"},
        R: {U: "B", B: "D", D: "F", F: "U"}
    },
    counterclockwise: {
        U: {B: "L", L: "F", F: "R", R: "B"},
        D: {B: "R", R: "F", F: "L", L: "B"},
        B: {U: "R", R: "D", D: "L", L: "U"},
        F: {U: "L", L: "D", D: "R", R: "U"},
        L: {U: "B", B: "D", D: "F", F: "U"},
        R: {U: "F", F: "D", D: "B", B: "U"}
    },
    angle: (reference) => (face1, face2) => {
        if (face1 === face2)
            return 0;
        if (sides.clockwise[reference][face1] === face2)
            return 1;
        if (sides.counterclockwise[reference][face1] === face2)
            return -1;
        if (sides.opposite[face1] === face2)
            return 2;

        throw "faces not on same plane";
    },
    indices(indices) {
        const
        i = indices[0],
        j = indices[1],
        k = indices[2],
        s = cubeSize - 1;

        let faceList = [];

        if      (i === 0) faceList.push("U");
        else if (i === s) faceList.push("D");
        if      (j === 0) faceList.push("B");
        else if (j === s) faceList.push("F");
        if      (k === 0) faceList.push("L");
        else if (k === s) faceList.push("R");

        return faceList;
    },
    findColor(indices, piece, face) {
        const faceList = sides.indices(indices);
        faceList.sort((a, b) => cube2.index[a] - cube2.index[b]);

        let index = faceList.indexOf(face)
        if (index === -1)
            index = faceList.indexOf(sides.opposite[face]);

        return piece[index];
    },
    orthogonal: {
        U: "L",
        L: "F",
        F: "D",
        D: "R",
        R: "B",
        B: "U",
    },
    conjugate: ["D", "B", "R"],
}

const faces = {
    middles: ["E", "S", "M"],
    amounts: [1, -1, 2],
    cornerArray: [0, cubeSize - 1],
    edgeArray: [...Array(cubeSize).keys()],
    sameAxis: (face1, face2) => cube3.sameAxis(
        faces.baseFace(face1),
        faces.baseFace(face2)
    ),
    baseFace(face) {
        const length = face.length;
        if (length === 1) return face;
        else return face[length - 1];
    },
};
faces.all = ((sides, middles) => {
    if (cubeSize < 2 || cubeSize % 1 !== 0)
        throw "cube size must be an integer >= 2";
    switch (cubeSize) {
        case 2:
            return sides;
        case 3:
            return sides.concat(middles);
        default:
            let temp = [];
            for (let layer = 1; layer < cubeSize - 1; layer++)
                middles.forEach(middle => temp.push(middle + layer.toString()));
    }
})(sides.all, faces.middles);

class Turns {
    constructor(cube) {
        this.list = [];
        this.string = "";
        if (cube) this.cube = cube;
    }
    static get all() {return Turns.calc(faces.all);}
    turn(...turnList) {
        //change to use cube.turnToTurns
        for (const turn of turnList) {
            const turnString = Turns.turnToTurns(turn);
            if (this.string) this.string += " ";
            this.string += turnString;

            this.list.push(turn)

            if (this.cube) this.cube.turn(turn);
        }
    }
    turns(turns) {
        if (!turns) return;

        const turnList = Turns.turnsToTurn(turns);
        for (const turn of turnList)
            this.list.push(turn);

        if (this.string) this.string += " ";
        this.string += turns;

        if (this.cube) this.cube.turns(turns);
    }

    static calc(faceList) {
        let result = [];
        faceList.forEach(face => 
            faces.amounts.forEach(
                amount => result.push({face, amount})
            )
        );
        return result;
    }
    static oppositeAmount(amount) {return (amount === 2) ? 2 : -amount}
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
}

const cube3 = {
    centerIndices: {
        U: [0, 1, 1],
        D: [2, 1, 1],
        F: [1, 2, 1],
        B: [1, 0, 1],
        L: [1, 1, 0],
        R: [1, 1, 2]
    },
    centerColor(cube, face) {
        const indices = cube3.centerIndices[face];
        return cube.indices(indices);
    },
    edgeIndices: [
        [0, 1],
        [1, 2],
        [2, 1],
        [1, 0]
    ],
    cornerIndices: [
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 0]
    ],
    layers: {
        U: 0, E: 1, D: 2,
        B: 0, S: 1, F: 2,
        L: 0, M: 1, R: 2
    },
    edgeArray: [0, 1, 2],
    cornerArray: [0, 2],
    index: {
        U: 0, E: 0, D: 0,
        F: 1, S: 1, B: 1,
        L: 2, M: 2, R: 2
    },
    sameAxis: (face1, face2) => (cube3.index[face1] === cube3.index[face2]),
};

const cube2 = {
    layers: {
        U: 0, D: 1,
        B: 0, F: 1,
        L: 0, R: 1
    },
    axes: [
        ["U", "D"],
        ["B", "F"],
        ["L", "R"]
    ],
    index: {
        U: 0, D: 0,
        F: 1, B: 1,
        L: 2, R: 2
    },
    orthogonal: face => sides.all.filter(
        side => !cube3.sameAxis(side, face)
    ),
};

const colors = {
    y: "yellow",
    w: "white",
    g: "green",
    b: "blue",
    o: "orange",
    r: "red",
    G: "gray",
    
    sides: {
        U: "y",
        D: "w",
        B: "g",
        F: "b",
        L: "o",
        R: "r"
    },
    isSamePiece(p1, p2) {
        const orderColors = piece => piece.split("").sort().join("");
        return (p1 === p2 || orderColors(p1) === orderColors(p2))
    },
    opposite: {
        y: "w",
        w: "y",
        g: "b",
        b: "g",
        o: "r",
        r: "o"
    }
}

function freezeObjects(...objects) {
    for (const object of objects)
        Object.freeze(object);
}

freezeObjects(
    sides,
    faces,
    cube3,
    cube2,
    colors
);