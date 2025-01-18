const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dino properties
let dino = {
  x: 50,
  y: canvas.height - 50,
  width: 20,
  height: 20,
  vy: 0,
  gravity: 0.3,
  jumpForce: 8,
};

let obstacles = [];
let gameSpeed = 3;
let score = 0;
let isGameOver = false;
let spawnTimer = 0; // Timer to control obstacle spawns
const spawnInterval = 100; // Minimum frames between spawns (e.g., 2 seconds at 60 FPS)

// Key press or tap to jump
function handleJump() {
  if (!isGameOver && dino.y >= canvas.height - dino.height) {
    dino.vy = -dino.jumpForce;
  }
}

// Reset the game
function resetGame() {
  dino.y = canvas.height - dino.height;
  dino.vy = 0;
  obstacles = [];
  score = 0;
  gameSpeed = 3; // Reset speed
  spawnTimer = 0; // Reset spawn timer
  isGameOver = false;
}

// Handle key presses for jump or reset
document.addEventListener('keydown', e => {
  if (isGameOver && (e.code === 'Space' || e.code === 'ArrowUp')) {
    resetGame();
  } else {
    handleJump();
  }
});

// Handle mouse/touch input for jump or reset
canvas.addEventListener('click', () => {
  if (isGameOver) {
    resetGame();
  } else {
    handleJump();
  }
});

function update() {
  if (isGameOver) return;

  // Apply gravity
  dino.vy += dino.gravity;
  dino.y += dino.vy;

  // Limit Dino to the ground
  if (dino.y > canvas.height - dino.height) {
    dino.y = canvas.height - dino.height;
    dino.vy = 0;
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;

    // Collision check
    if (
      dino.x < obstacles[i].x + obstacles[i].width &&
      dino.x + dino.width > obstacles[i].x &&
      dino.y < obstacles[i].y + obstacles[i].height &&
      dino.y + dino.height > obstacles[i].y
    ) {
      isGameOver = true;
    }

    // If obstacle goes off screen, remove it
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      if (score % 5 === 0) {
        gameSpeed += 0.5; // Gradually increase speed every 5 points
      }
    }
  }

  // Spawn new obstacles with a delay
  spawnTimer++;
  if (spawnTimer > spawnInterval) {
    if (Math.random() < 0.5) {
      // 50% chance to spawn an obstacle after the interval
      obstacles.push({
        x: canvas.width,
        y: canvas.height - 30, // Align obstacles to the bottom
        width: 20,
        height: Math.random() * 20 + 20, // Randomize height for variety
      });
    }
    spawnTimer = 0; // Reset the spawn timer
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set the game background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Dino
  ctx.fillStyle = 'limegreen'; // Updated for better contrast
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  // Draw obstacles
  ctx.fillStyle = 'orange'; // Updated for better contrast
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }

  // Score
  ctx.fillStyle = 'white';
  ctx.font = "16px 'Poppins', sans-serif"; // Apply Poppins font
  ctx.fillText(`Score: ${score}`, 10, 20);

  if (isGameOver) {
    // "Game Over!" Text
    ctx.fillStyle = 'red';
    ctx.font = "20px 'Poppins', sans-serif";
    const gameOverText = 'Game Over!';
    const gameOverWidth = ctx.measureText(gameOverText).width;
    ctx.fillText(gameOverText, (canvas.width - gameOverWidth) / 2, canvas.height / 2 - 20);

    // Restart Instruction Text
    ctx.fillStyle = 'white';
    ctx.font = "16px 'Poppins', sans-serif";
    const restartText = 'Press Space, Arrow Key, or Click to Restart';
    const restartWidth = ctx.measureText(restartText).width;
    ctx.fillText(restartText, (canvas.width - restartWidth) / 2, canvas.height / 2 + 10);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
