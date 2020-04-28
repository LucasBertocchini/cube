"use strict";

function displaySetup() {
    function addBreak() {
        const br = document.createElement("br");
        document.body.appendChild(br);
    }
    const cubeContainer = document.querySelector("#cube-container");
    cubeContainer.style = "grid-template-columns: auto auto auto;";
    
    const gridItems = [
        null, "B", null,
        null, "U", null,
        "L" , "F", "R" ,
        null, "D", null
    ];
    
    for (const gridItem of gridItems) {
        const face = document.createElement("div");
        face.className = "face";
        if (gridItem) {
            face.id = gridItem;
            
            for (let i = 0; i < cubeSize ** 2; i++) {
                const piece = document.createElement("div");
                piece.className = "piece";
                if (i === (cubeSize ** 2 - 1) / 2) piece.innerHTML = gridItem;
                else piece.innerHTML = "&nbsp;";
                face.appendChild(piece);
            }
        }
        face.style = `grid-template-columns: ${"auto ".repeat(cubeSize).slice(0, -1)};`;
        cubeContainer.appendChild(face);
    }
    
    
    
    

    const scrambleAndSolveButton = document.createElement("button");
    scrambleAndSolveButton.innerHTML = "scramble and solve";
    scrambleAndSolveButton.onclick = e => {
        console.log("\n");

        mainCube.scramble();
        beginnerSolve3(mainCube.pieces);
    }
    document.body.appendChild(scrambleAndSolveButton);

    const scrambleSolveAndTimeButton = document.createElement("button");
    scrambleSolveAndTimeButton.innerHTML = "scramble, solve, and time";
    scrambleSolveAndTimeButton.onclick = e => {
        console.log("\n");

        mainCube.scramble();

        const start = Date.now();
        beginnerSolve3();
        const end = Date.now();

        console.log(end - start + " ms");
    }
    document.body.appendChild(scrambleSolveAndTimeButton);

    addBreak();
    
    for (const face of faces.all.concat(["y", "z", "x"])) {
        const turnButton = document.createElement("button");
        turnButton.innerHTML = face;
        turnButton.onclick = e => {
            const turn = {face, amount: 1};
            console.log(turn);
            mainCube.turn(turn);
            display();
        }
        turnButton.oncontextmenu = e => {
            const turn = {face, amount: -1};
            console.log(turn);
            mainCube.turn(turn);
            display();
            return false;
        }
        document.body.appendChild(turnButton);
    }
    
    addBreak();
    
    for (const i of [3, 4, 5, 10, 100]) {
        const randomizeCubeButton = document.createElement("button");
        randomizeCubeButton.innerHTML = "scramble " + i;
        randomizeCubeButton.onclick = e => {
            mainCube.scramble(i, true);
            display();
        }
        document.body.appendChild(randomizeCubeButton);
    }
    
    addBreak();
    
    for (let i = 1; i <= 4; i++) {
        const bruteForceSolveButton = document.createElement("button");
        bruteForceSolveButton.innerHTML = "brute force " + i;
        bruteForceSolveButton.onclick = e => {
            const solve = mainCube.bruteForce(i);
            console.log(solve);
            display();
        }
        document.body.appendChild(bruteForceSolveButton);
    }
    
    addBreak();
    
    const beginnerSolve3Button = document.createElement("button");
    beginnerSolve3Button.innerHTML = "beginner solve 3";
    beginnerSolve3Button.onclick = e => beginnerSolve3(mainCube.pieces);
    document.body.appendChild(beginnerSolve3Button);

    const copyPiecesButton = document.createElement("button");
    copyPiecesButton.innerHTML = "copy pieces";
    copyPiecesButton.onclick = e => {
        const text = JSON.stringify(mainCube.pieces);
        console.log(text);
    }
    document.body.appendChild(copyPiecesButton);
    
    addBreak();
    
    const resetButton = document.createElement("button");
    resetButton.innerHTML = "reset";
    resetButton.onclick = e => {
        mainCube.reset();
        display();
    }
    document.body.appendChild(resetButton);
}

function display() {
    
    function colorPiece(face, row, col, color) {
        const faceElement = document.getElementById(face);
        const piece = faceElement.children[col + cubeSize * row];
        piece.style.backgroundColor = colors[color];
    }
    
    
    for (let x = 0; x < cubeSize; x++) {
        let plane = mainCube.pieces[x];
        for (let y = 0; y < cubeSize; y++) {
            let line = plane[y];
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