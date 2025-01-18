const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fit screen
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Ship properties
let ship = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 60,
  width: 30,
  height: 30,
  speed: 5,
};

// Game variables
let leftPressed = false;
let rightPressed = false;
let bullets = [];
let enemies = [];
let enemySpeed = 0.75;
let score = 0;
let highScore = localStorage.getItem("highScoreSpaceShooter") || 0;
let isGameOver = false;
let lives = 10;

// Listen for key presses
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === " ") {
    e.preventDefault();

    if (isGameOver) {
      resetGame();
    } else {
      shoot();
    }
  }
  if (isGameOver && e.key === "Enter") {
    resetGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

// Tap or click to shoot or restart
canvas.addEventListener("click", () => {
  if (isGameOver) {
    resetGame();
  } else {
    shoot();
  }
});

// Shoot bullets
function shoot() {
  bullets.push({
    x: ship.x + ship.width / 2 - 2,
    y: ship.y,
    width: 4,
    height: 10,
    speed: 5,
  });
}

// Create a new enemy
function createEnemy() {
  let x = Math.random() * (canvas.width - 30);
  enemies.push({ x, y: 0, width: 30, height: 30 });
}

// Reset the game
function resetGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScoreSpaceShooter", highScore);
  }
  ship.x = canvas.width / 2 - 15;
  bullets = [];
  enemies = [];
  score = 0;
  lives = 10;
  isGameOver = false;
}

// Update game state
function update() {
  if (isGameOver) return;

  // Move ship
  if (leftPressed && ship.x > 0) {
    ship.x -= ship.speed;
  } else if (rightPressed && ship.x + ship.width < canvas.width) {
    ship.x += ship.speed;
  }

  // Move bullets
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;

    // Remove bullets if off-screen
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }

  // Move enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemySpeed;

    // Check collision with ship
    if (
      ship.x < enemies[i].x + enemies[i].width &&
      ship.x + ship.width > enemies[i].x &&
      ship.y < enemies[i].y + enemies[i].height &&
      ship.y + ship.height > enemies[i].y
    ) {
      // Lose a life, remove that enemy, check for game over
      lives--;
      enemies.splice(i, 1);
      i--;

      if (lives <= 0) {
        isGameOver = true;
      }
      continue; // Skip the rest of this loop iteration
    }

    // If enemy goes off-screen (the bottom)
    if (enemies[i].y > canvas.height) {
      // Lose a life, remove that enemy, check for game over
      lives--;
      enemies.splice(i, 1);
      i--;

      if (lives <= 0) {
        isGameOver = true;
      }
      continue;
    }
  }

  // Bullet-enemy collision
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (
        bullets[i].x < enemies[j].x + enemies[j].width &&
        bullets[i].x + bullets[i].width > enemies[j].x &&
        bullets[i].y < enemies[j].y + enemies[j].height &&
        bullets[i].height + bullets[i].y > enemies[j].y
      ) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++;
        i--;
        break;
      }
    }
  }

  // Spawn enemies randomly (adjust spawn rate as needed)
  if (Math.random() < 0.01) {
    createEnemy();
  }
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ship
  ctx.fillStyle = "cyan";
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

  // Draw bullets
  ctx.fillStyle = "yellow";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw enemies
  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Draw score and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Poppins, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);

  // Draw lives
  ctx.fillText(`Lives: ${lives}`, 10, 90);

  // Game over message
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "white";
    ctx.font = "18px Poppins, sans-serif";
    ctx.fillText(
      "Press Space, Enter, or Tap to Restart",
      canvas.width / 2,
      canvas.height / 2 + 20,
    );
  }
}

// Control buttons
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const shootButton = document.getElementById("shootButton");

// Add event listeners for control buttons
leftButton.addEventListener("mousedown", () => (leftPressed = true));
leftButton.addEventListener("mouseup", () => (leftPressed = false));
leftButton.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent scrolling
  leftPressed = true;
});
leftButton.addEventListener("touchend", () => (leftPressed = false));

rightButton.addEventListener("mousedown", () => (rightPressed = true));
rightButton.addEventListener("mouseup", () => (rightPressed = false));
rightButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  rightPressed = true;
});
rightButton.addEventListener("touchend", () => (rightPressed = false));

shootButton.addEventListener("click", () => {
  if (!isGameOver) shoot();
});

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
