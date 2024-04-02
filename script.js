const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const cloud = document.querySelector('.cloud');
const gameOver = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart');
const scoreDisplay = document.querySelector('.score');
const highScoresDisplay = document.querySelector('.high-scores');

let score = 0;
let scoreInterval;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function startScore() {
    score = 0;
    updateScoreDisplay();
    scoreInterval = setInterval(() => {
        score++;
        updateScoreDisplay();
    }, 1000);
}

function stopScoreAndUpdateHighScores() {
    clearInterval(scoreInterval);
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    updateHighScoresDisplay();
}

function updateHighScoresDisplay() {
    highScoresDisplay.innerHTML = 'Best Scores:<br>' + highScores.map((score, index) => `${index + 1}. ${score}`).join('<br>');
}

function jump() {
    mario.classList.add('jump');
    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

let loop = setInterval(gameLoop, 10);

function gameLoop() {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const cloudPosition = +window.getComputedStyle(cloud).left.replace('px', '');

    if (pipePosition <= 100 && pipePosition > 0 && marioPosition < 60) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'assets/imgs/game-over.png';
        mario.style.width = '70px';
        mario.style.marginLeft = '35px';

        cloud.style.animation = 'none';
        cloud.style.left = `${cloudPosition}px`;

        gameOver.style.visibility = 'visible';

        stopScoreAndUpdateHighScores();
        clearInterval(loop);
    }
}

function restart() {
    gameOver.style.visibility = 'hidden';

    pipe.style.animation = 'pipe-animations 1.5s infinite linear';
    pipe.style.left = '';

    mario.src = 'assets/imgs/mario.gif';
    mario.style.width = '130px';
    mario.style.bottom = '0px';
    mario.style.marginLeft = '';
    mario.style.animation = '';

    cloud.style.animation = 'cloud 20s infinite linear';
    cloud.style.left = '';

    startScore();
    loop = setInterval(gameLoop, 10);
}

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);
restartButton.addEventListener('click', restart);

startScore();
updateHighScoresDisplay();
