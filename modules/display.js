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
        face.style = `grid-template-columns: ${"auto ".repeat(cubeSize).slice(0, -1)};`;
        cubeContainer.appendChild(face);
    }
    
    
    
    

    let scrambleAndSolveButton = document.createElement("button");
    scrambleAndSolveButton.innerHTML = "scramble and solve";
    scrambleAndSolveButton.onclick = e => {
        mainCube.scramble();
        beginnerSolve3(mainCube.pieces);
    }
    document.body.appendChild(scrambleAndSolveButton);

    addBreak();
    
    for (let face of faces.all.concat(["y", "z", "x"])) {
        let turnButton = document.createElement("button");
        turnButton.innerHTML = face;
        turnButton.onclick = e => {
            let turn = {face, amount: 1};
            console.log(turn);
            mainCube.turn(turn);
            display();
        }
        turnButton.oncontextmenu = e => {
            let turn = {face, amount: -1};
            console.log(turn);
            mainCube.turn(turn);
            display();
            return false;
        }
        document.body.appendChild(turnButton);
    }
    
    addBreak();
    
    for (let i of [3, 4, 5, 10, 100]) {
        let randomizeCubeButton = document.createElement("button");
        randomizeCubeButton.innerHTML = "scramble " + i;
        randomizeCubeButton.onclick = e => {
            mainCube.scramble(i, true);
            display();
        }
        document.body.appendChild(randomizeCubeButton);
    }
    
    addBreak();
    
    for (let i = 1; i <= 4; i++) {
        let bruteForceSolveButton = document.createElement("button");
        bruteForceSolveButton.innerHTML = "brute force " + i;
        bruteForceSolveButton.onclick = e => {
            let solve = mainCube.bruteForce(i);
            console.log(solve);
            display();
        }
        document.body.appendChild(bruteForceSolveButton);
    }
    
    addBreak();
    
    let beginnerSolve3Button = document.createElement("button");
    beginnerSolve3Button.innerHTML = "beginner solve 3";
    beginnerSolve3Button.onclick = e => beginnerSolve3(mainCube.pieces);
    document.body.appendChild(beginnerSolve3Button);

    let copyPiecesButton = document.createElement("button");
    copyPiecesButton.innerHTML = "copy pieces";
    copyPiecesButton.onclick = e => {
        const text = JSON.stringify(mainCube.pieces);
        console.log(text);
    }
    document.body.appendChild(copyPiecesButton);
    
    addBreak();
    
    let resetButton = document.createElement("button");
    resetButton.innerHTML = "reset";
    resetButton.onclick = e => {
        mainCube.reset();
        display();
    }
    document.body.appendChild(resetButton);
}

function display() {
    
    function colorPiece(face, row, col, color) {
        let faceElement = document.getElementById(face);
        let piece = faceElement.children[col + cubeSize * row];
        piece.style.backgroundColor = faces.colors[color];
    }
    
    
    for (let x = 0; x < cubeSize; x++) {
        const plane = mainCube.pieces[x];
        for (let y = 0; y < cubeSize; y++) {
            const line = plane[y];
            for (let z = 0; z < cubeSize; z++) {
                let piece = line[z];
                
                const caseX = (x === 0 || x === cubeSize - 1),
                      caseY = (y === 0 || y === cubeSize - 1);

                const indexY = (caseX) ? 1 : 0;
                let indexZ = 0;
                if (caseX || caseY) indexZ = 1;
                if (caseX && caseY) indexZ = 2;
                
                if (!piece) {
                    piece = {0: "G"};
                    piece[indexY] = "G";
                    piece[indexZ] = "G";
                }

                if (x === 0)
                    colorPiece("U", y, z, piece[0]);
                else if (x === cubeSize - 1)
                    colorPiece("D", cubeSize - 1 - y, z, piece[0]);
                
                if (y === 0)
                    colorPiece("B", cubeSize - 1 - x, z, piece[indexY])
                else if (y === cubeSize - 1)
                    colorPiece("F", x, z, piece[indexY])
                
                if (z === 0)
                    colorPiece("L", x, y, piece[indexZ])
                else if (z === cubeSize - 1)
                    colorPiece("R", x, cubeSize - 1 - y, piece[indexZ])
            }
        }
    }
}