const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
  x: 50,
  y: 200,
  width: 20,
  height: 20,
  vy: 0,
  gravity: 0.1, // Reduced gravity for slower falling
  jump: 3, // Slightly reduced jump for balance
};

let pipes = [];
let gap = 100; // Increased gap for easier gameplay
let pipeWidth = 40;
let pipeSpeed = 2;
let score = 0;
let isGameOver = false;
let spawnTimer = 0;
const spawnInterval = 100; // Minimum frames between pipe spawns

// Bird jump or game reset
function handleJumpOrReset() {
  if (isGameOver) {
    resetGame();
  } else {
    bird.vy = -bird.jump;
  }
}

// Reset the game
function resetGame() {
  bird.y = 200;
  bird.vy = 0;
  pipes = [];
  score = 0;
  pipeSpeed = 2;
  isGameOver = false;
  spawnTimer = 0;
}

// Add event listeners for jump or reset
document.addEventListener('keydown', handleJumpOrReset);
canvas.addEventListener('click', handleJumpOrReset);

function createPipe() {
  let topHeight = Math.floor(Math.random() * (canvas.height - gap - 40)) + 20;
  let bottomY = topHeight + gap;
  let bottomHeight = canvas.height - bottomY;

  pipes.push({
    x: canvas.width,
    y: 0,
    width: pipeWidth,
    height: topHeight,
  });
  pipes.push({
    x: canvas.width,
    y: bottomY,
    width: pipeWidth,
    height: bottomHeight,
  });
}

function update() {
  if (isGameOver) return;

  // Apply gravity
  bird.vy += bird.gravity;
  bird.y += bird.vy;

  // Bird boundaries
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    isGameOver = true;
  }

  // Move pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;

    // Collision check
    if (
      bird.x < pipes[i].x + pipes[i].width &&
      bird.x + bird.width > pipes[i].x &&
      bird.y < pipes[i].y + pipes[i].height &&
      bird.y + bird.height > pipes[i].y
    ) {
      isGameOver = true;
    }

    // Remove pipe if off-screen
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
      // Increment score only for top pipes
      if (i % 2 === 0) score++;
    }
  }

  // Spawn pipes at a regular interval
  spawnTimer++;
  if (spawnTimer > spawnInterval) {
    createPipe();
    spawnTimer = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set the game background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Draw pipes
  ctx.fillStyle = 'green';
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
  }

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = "20px 'Poppins', sans-serif"; // Use Poppins font
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Game over text
  if (isGameOver) {
    ctx.fillStyle = 'red';
    ctx.font = "24px 'Poppins', sans-serif"; // Use Poppins font
    const gameOverText = 'Game Over!';
    const restartText = 'Press Any Key or Tap to Restart';

    const gameOverWidth = ctx.measureText(gameOverText).width;
    const restartWidth = ctx.measureText(restartText).width;

    ctx.fillText(gameOverText, (canvas.width - gameOverWidth) / 2, canvas.height / 2 - 20);
    ctx.fillStyle = 'white';
    ctx.fillText(restartText, (canvas.width - restartWidth) / 2, canvas.height / 2 + 20);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
