const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const cloud = document.querySelector('.cloud');
const gameOver = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart');
const scoreDisplay = document.querySelector('.score');
const scoreGameHover = document.querySelector('.game-over-score');
const highScoresDisplay = document.querySelector('.high-scores');

let score = 0;
let scoreInterval;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
let playerName = prompt("Por favor, insira seu nome:", "Jogador") || "Jogador Anônimo"; // Solicita o nome do jogador

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
    // Verifica se o score atual e o nome estão sendo corretamente adicionados ao array de highScores
    console.log("Before pushing new score", highScores);
    highScores.push({ score: score, name: playerName });
    console.log("After pushing new score", highScores);    // Certifique-se de que a ordenação está considerando o objeto com score e nome
    highScores.sort((a, b) => b.score - a.score);
    // Mantém apenas os 5 melhores scores
    highScores = highScores.slice(0, 5);
    // Atualiza os highScores no localStorage
    scoreGameHover.textContent = `Score: ${score}`;
    localStorage.setItem('highScores', JSON.stringify(highScores));
    // Atualiza a exibição dos highScores
    updateHighScoresDisplay();
}

function updateHighScoresDisplay() {
    // Check if the highScores array is defined and has at least one score
    if (highScores && highScores.length > 0) {
        highScoresDisplay.innerHTML = 'Best Scores:<br>' + highScores.map((item, index) => {
            // Check if both name and score are defined for the current item
            if (item && item.hasOwnProperty('name') && item.hasOwnProperty('score')) {
                return `${index + 1}. ${item.name}: ${item.score}`;
            } else {
                return `${index + 1}. Player: Score not available`;
            }
        }).join('<br>');
    } else {
        // If no scores are available, display a default message
        highScoresDisplay.innerHTML = 'Best Scores:<br>No high scores available.';
    }
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
    let keepName = confirm("Deseja manter o nome '" + playerName + "'?");
    if (!keepName) {
        playerName = prompt("Por favor, insira seu novo nome:", playerName) || playerName; // Permite a mudança de nome
    }

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
