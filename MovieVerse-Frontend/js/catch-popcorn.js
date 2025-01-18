const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adjust canvas to fit the screen
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let bucket = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 40,
  width: 50,
  height: 20,
  speed: 5,
};

let popcorns = [];
let score = 0;
let highScore = localStorage.getItem("highScoreBucketGame") || 0;
let lives = 10;
let isGameOver = false;

// Control bucket with arrow keys / touch
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;

  if (
    isGameOver &&
    (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
  ) {
    resetGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
});

// Touch to move bucket
canvas.addEventListener("touchmove", (e) => {
  let touch = e.touches[0];
  let rect = canvas.getBoundingClientRect();
  bucket.x = touch.clientX - rect.left - bucket.width / 2;
});

// Touch or click to reset
canvas.addEventListener("click", () => {
  if (isGameOver) {
    resetGame();
  }
});

// Spawn popcorn
function spawnPopcorn() {
  let xPos = Math.random() * (canvas.width - 15);
  popcorns.push({
    x: xPos,
    y: 0,
    width: 15,
    height: 15,
    vy: 1.5 + Math.random(),
  });
}

// Reset game
function resetGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScoreBucketGame", highScore);
  }
  bucket.x = canvas.width / 2 - 25;
  popcorns = [];
  score = 0;
  lives = 10;
  isGameOver = false;
}

function update() {
  if (isGameOver) return;

  // Move bucket
  if (rightPressed && bucket.x + bucket.width < canvas.width) {
    bucket.x += bucket.speed;
  } else if (leftPressed && bucket.x > 0) {
    bucket.x -= bucket.speed;
  }

  // Update popcorns
  for (let i = 0; i < popcorns.length; i++) {
    let pop = popcorns[i];
    pop.y += pop.vy;

    // Check for catch
    if (
      pop.x < bucket.x + bucket.width &&
      pop.x + pop.width > bucket.x &&
      pop.y + pop.height > bucket.y &&
      pop.y < bucket.y + bucket.height
    ) {
      score++;
      popcorns.splice(i, 1);
      i--;
      continue;
    }

    // If popcorn falls off screen
    if (pop.y > canvas.height) {
      lives--;
      popcorns.splice(i, 1);
      i--;
      if (lives <= 0) {
        isGameOver = true;
      }
    }
  }

  // Randomly spawn popcorn (reduced spawn rate for less difficulty)
  if (Math.random() < 0.01) {
    spawnPopcorn();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bucket
  ctx.fillStyle = "blue";
  ctx.fillRect(bucket.x, bucket.y, bucket.width, bucket.height);

  // Draw popcorn
  ctx.fillStyle = "yellow";
  for (let pop of popcorns) {
    ctx.fillRect(pop.x, pop.y, pop.width, pop.height);
  }

  // Score and lives (always visible)
  ctx.fillStyle = "white";
  ctx.font = "16px Poppins, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, Math.min(20, canvas.height - 10));
  ctx.fillText(
    `High Score: ${highScore}`,
    10,
    Math.min(40, canvas.height - 10),
  ); // Display high score
  ctx.fillText(`Lives: ${lives}`, 10, Math.min(60, canvas.height - 10));

  // Game Over message
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "24px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "white";
    ctx.font = "16px Poppins, sans-serif";
    ctx.fillText(
      "Press Enter, Space, or Tap to Restart",
      canvas.width / 2,
      canvas.height / 2 + 20,
    );
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Button elements
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Event listeners for buttons
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

loop();
