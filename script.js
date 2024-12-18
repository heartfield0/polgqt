let currentPlayer = "Player 1";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let playerScores = { "Player 1": 0, "Player 2": 0 };
let isTwoPlayerMode = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('background-music').play();
}

function playWithComputer() {
    isTwoPlayerMode = false;
    resetGame();
}

function playTwoPlayers() {
    isTwoPlayerMode = true;
    resetGame();
}

function makeMove(index) {
    if (gameState[index] !== "" || !gameActive || gamePaused) {
        return;
    }

    gameState[index] = currentPlayer === "Player 1" ? "x" : "o";
    document.querySelectorAll('.cell')[index].innerHTML = `<img src="${currentPlayer === 'Player 1' ? '1.gif' : '2.gif'}" alt="${currentPlayer}">`;
    checkResult();
    currentPlayer = currentPlayer === "Player 1" ? "Player 2" : "Player 1";
    document.getElementById('turn').textContent = currentPlayer;
    
    if (!isTwoPlayerMode && currentPlayer === "Player 2" && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let availableCells = gameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (availableCells.length > 0) {
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        makeMove(randomIndex);
    }
}

function checkResult() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        playerScores[currentPlayer]++;
        document.getElementById(currentPlayer === "Player 1" ? "player1" : "player2").textContent = `${currentPlayer}: ${playerScores[currentPlayer]}`;
        document.getElementById('winner').textContent = `${currentPlayer} Wins!`;
        document.getElementById('winner').classList.remove('hidden');
        displayWinningLine(winningCells);
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        gameActive = false;
        document.getElementById('winner').textContent = "It's a Draw!";
        document.getElementById('winner').classList.remove('hidden');
        return;
    }
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "Player 1";
    document.getElementById('turn').textContent = currentPlayer;
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    document.getElementById('winner').classList.add('hidden');
    const winningLine = document.querySelector('.winning-line');
    if (winningLine) {
        winningLine.remove();
    }
}

function resetScore() {
    playerScores = { "Player 1": 0, "Player 2": 0 };
    document.getElementById("player1").textContent = "Player 1: 0";
    document.getElementById("player2").textContent = "Player 2: 0";
    resetGame();
}

function toggleMute() {
    const music = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');
    if (music.muted) {
        music.muted = false;
        muteButton.textContent = "Mute";
    } else {
        music.muted = true;
        muteButton.textContent = "Unmute";
    }
}

function setVolume(volume) {
    const music = document.getElementById('background-music');
    music.volume = volume;
}

let gamePaused = false;

function togglePause() {
    const backgroundMusic = document.getElementById('background-music');
    const pauseButton = document.getElementById('pause-button');
    const pauseOverlay = document.getElementById('pause-overlay');
    gamePaused = !gamePaused;
    if (gamePaused) {
        backgroundMusic.pause();
        pauseButton.textContent = "Resume";
        pauseOverlay.style.display = 'flex';
    } else {
        backgroundMusic.play();
        pauseButton.textContent = "Pause";
        pauseOverlay.style.display = 'none';
    }
}

function displayWinningLine(winningCells) {
    
    const existingWinningLine = document.querySelector('.winning-line');
    if (existingWinningLine) {
        existingWinningLine.remove();
    }

    const line = document.createElement('div');
    line.classList.add('winning-line');
    const [a, b, c] = winningCells;
    const cells = document.querySelectorAll('.cell');
    const cellA = cells[a];
    const cellB = cells[b];
    const cellC = cells[c];

    if (a % 3 === b % 3) {
        
        line.classList.add('vertical');
        line.style.left = `${cellA.offsetLeft + cellA.offsetWidth / 2}px`;
    } else if (Math.floor(a / 3) === Math.floor(b / 3)) {
        
        line.classList.add('horizontal');
        line.style.top = `${cellA.offsetTop + cellA.offsetHeight / 2}px`;
    } else if (a === 0 && c === 8) {
        
        line.classList.add('diagonal-1');
        line.style.top = `${cellA.offsetTop + cellA.offsetHeight / 2}px`;
        line.style.left = `${cellA.offsetLeft + cellA.offsetWidth / 2}px`;
    } else if (a === 2 && c === 6) {
        
        line.classList.add('diagonal-2');
        line.style.top = `${cellA.offsetTop + cellA.offsetHeight / 2}px`;
        line.style.right = `${board.clientWidth - cellA.offsetLeft - cellA.offsetWidth / 2}px`;
    }

    document.getElementById('board').appendChild(line);
}



