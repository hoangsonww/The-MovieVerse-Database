const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit screen
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game variables
let stack = [];
let currentBlock = {
  width: 280,
  height: 30,
  x: 0,
  y: 0,
  speed: 2,
  direction: 1,
};
let currentLevelY = canvas.height - 30;
let score = 0;
let highScore = localStorage.getItem('highScoreStackGame') || 0;
let isGameOver = false;

// Handle block placement
document.addEventListener('keydown', e => {
  e.preventDefault();

  if ((e.key === ' ' || e.key === 'Enter') && !isGameOver) {
    placeBlock();
  } else if (isGameOver && (e.key === ' ' || e.key === 'Enter')) {
    resetGame();
  }
});
canvas.addEventListener('click', () => {
  if (isGameOver) {
    resetGame();
  } else {
    placeBlock();
  }
});

function placeBlock() {
  if (stack.length === 0) {
    currentBlock.y = currentLevelY;
    stack.push({ ...currentBlock });
    nextBlock();
  } else {
    let topBlock = stack[stack.length - 1];
    let overlap = getOverlap(topBlock, currentBlock);

    if (overlap <= 0) {
      isGameOver = true;
      updateHighScore();
    } else {
      currentBlock.width = overlap;
      if (currentBlock.x < topBlock.x) {
        currentBlock.x = topBlock.x;
      }

      currentBlock.y = currentLevelY;
      stack.push({ ...currentBlock });
      nextBlock();
      score++;
    }
  }
}

function resetGame() {
  updateHighScore();
  stack = [];
  currentBlock = {
    width: 280,
    height: 30,
    x: 0,
    y: 0,
    speed: 2,
    direction: 1,
  };
  currentLevelY = canvas.height - 30;
  score = 0;
  isGameOver = false;
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScoreStackGame', highScore);
  }
}

function getOverlap(blockA, blockB) {
  let start = Math.max(blockA.x, blockB.x);
  let end = Math.min(blockA.x + blockA.width, blockB.x + blockB.width);
  return end - start;
}

function nextBlock() {
  currentLevelY -= 30;
  currentBlock.x = 0;
  currentBlock.y = 0;
  currentBlock.direction = Math.random() < 0.5 ? 1 : -1;
}

function update() {
  if (isGameOver) return;

  currentBlock.x += currentBlock.speed * currentBlock.direction;
  if (currentBlock.x < 0) {
    currentBlock.x = 0;
    currentBlock.direction = 1;
  }
  if (currentBlock.x + currentBlock.width > canvas.width) {
    currentBlock.x = canvas.width - currentBlock.width;
    currentBlock.direction = -1;
  }

  if (currentLevelY < 0) {
    isGameOver = true;
    updateHighScore(); // Update high score when the player wins
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stacked blocks
  ctx.fillStyle = 'orange';
  stack.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // Draw current block
  if (!isGameOver) {
    ctx.fillStyle = 'green';
    ctx.fillRect(currentBlock.x, currentLevelY, currentBlock.width, currentBlock.height);
  }

  // Draw score and high score
  ctx.fillStyle = 'white';
  ctx.font = '20px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);

  // Game over message
  if (isGameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '30px Poppins, sans-serif';
    ctx.textAlign = 'center';
    if (currentLevelY < 0) {
      ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 20);
    } else {
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    }

    ctx.fillStyle = 'white';
    ctx.font = '18px Poppins, sans-serif';
    ctx.fillText('Press Space, Enter, or Tap to Restart', canvas.width / 2, canvas.height / 2 + 20);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
