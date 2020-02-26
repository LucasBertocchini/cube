"use strict";

function displaySetup() {
    function addBreak() {
        const br = document.createElement("br");
        document.body.appendChild(br);
    }
    let cubeContainer = document.querySelector("#cube-container");
    cubeContainer.style = "grid-template-columns: auto auto auto;";
    
    let gridItems = [
        null, "B", null,
        null, "U", null,
        "L" , "F", "R" ,
        null, "D", null
    ];
    
    for (let gridItem of gridItems) {
        let face = document.createElement("div");
        face.className = "face";
        if (gridItem) {
            face.id = gridItem;
            
            for (let i = 0; i < cubeSize ** 2; i++) {
                let piece = document.createElement("div");
                piece.className = "piece";
                if (i === (cubeSize ** 2 - 1) / 2) piece.innerHTML = gridItem;
                else piece.innerHTML = "&nbsp;";
                face.appendChild(piece);
            }
        }
        face.style = `grid-template-columns: ${"auto ".repeat(cubeSize)};`;
        cubeContainer.appendChild(face);
    }
    
    
    
    
    
    for (let side of sides) {
        let turnButton = document.createElement("button");
        turnButton.innerHTML = "Turn " + side;
        turnButton.onclick = e => {
            let turn = {side, amount: 1};
            console.log(turn);
            mainCube = turnSide(mainCube, side);
            display();
        }
        turnButton.oncontextmenu = e => {
            let turn = {side, amount: -1};
            console.log(turn);
            mainCube = turnSide(mainCube, side, -1);
            display();
            return false;
        }
        document.body.appendChild(turnButton);
    }
    
    addBreak();
    
    for (let axis of ["x", "y", "z"]) {
        let rotateButton = document.createElement("button");
        rotateButton.innerHTML = "Rotate " + axis;
        rotateButton.onclick = e => {
            console.log("rotate " + axis);
            mainCube = turnCube(mainCube, axis);
            display();
        }
        rotateButton.oncontextmenu = e => {
            console.log("rotate " + axis + "'");
            mainCube = turnCube(mainCube, axis, -1);
            display();
            return false;
        }
        document.body.appendChild(rotateButton);
    }
    
    addBreak();
    
    for (let i of [1, 2, 3, 5, 10, 100]) {
        let randomizeCubeButton = document.createElement("button");
        randomizeCubeButton.innerHTML = "Randomize " + i;
        randomizeCubeButton.onclick = e => {
            randomizeCube(i);
            display();
        }
        document.body.appendChild(randomizeCubeButton);
    }
    
    addBreak();
    
    for (let i = 1; i <= 5; i++) {
        let bruteForceSolveButton = document.createElement("button");
        bruteForceSolveButton.innerHTML = "Brute Force " + i;
        bruteForceSolveButton.onclick = e => {
            let solve = bruteForceSolve(i);
            console.log(solve);
            display();
        }
        document.body.appendChild(bruteForceSolveButton);
    }
    
    addBreak();
    
    let beginnerSolve3Button = document.createElement("button");
    beginnerSolve3Button.innerHTML = "Beginner Solve 3";
    beginnerSolve3Button.onclick = e => beginnerSolve3(mainCube);
    document.body.appendChild(beginnerSolve3Button);
    
    addBreak();
    
    let resetButton = document.createElement("button");
    resetButton.innerHTML = "Reset";
    resetButton.onclick = e => {
        console.clear();
        mainCube = solvedCube;
        display();
    }
    document.body.appendChild(resetButton);
}

function display() {
    
    function colorPiece(face, row, col, color) {
        let faceElement = document.getElementById(face);
        let piece = faceElement.children[col + cubeSize * row];
        piece.style.backgroundColor = colors[color];
    }
    
    
    for (let x = 0; x < cubeSize; x++) {
        const plane = mainCube[x];
        for (let y = 0; y < cubeSize; y++) {
            const line = plane[y];
            for (let z = 0; z < cubeSize; z++) {
                const piece = line[z];
                
                const caseX = (x === 0 || x === cubeSize - 1),
                      caseY = (y === 0 || y === cubeSize - 1);
                
                if (x === 0) //U
                    colorPiece("U", y, z, piece[0]);
                else if (x === cubeSize - 1)
                    colorPiece("D", cubeSize - 1 - y, z, piece[0]);
                
                const indexY = (caseX) ? 1 : 0;
                if (y === 0) {
                    colorPiece("B", cubeSize - 1 - x, z, piece[indexY])
                } else if (y === cubeSize - 1) {
                    colorPiece("F", x, z, piece[indexY])
                }
                
                let indexZ = 0;
                if (caseX || caseY) indexZ = 1;
                if (caseX && caseY) indexZ = 2;
                if (z === 0) {
                    colorPiece("L", x, y, piece[indexZ])
                } else if (z === cubeSize - 1) {
                    colorPiece("R", x, cubeSize - 1 - y, piece[indexZ])
                }
            }
        }
    }
}