const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adjust canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Star properties
let star = {
  x: 100,
  y: 100,
  radius: 20,
  velocityY: 0,
  gravity: 0.25,
  jumpForce: -6,
};

// Game variables
let score = 0;
let highScore = localStorage.getItem("highScoreBouncingStar") || 0;
let isGameOver = false;
let startTime = null;

// Initialize the star position for a fresh game
function resetGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScoreBouncingStar", highScore);
  }
  star.x = 100;
  star.y = 100;
  star.velocityY = 0;
  score = 0;
  startTime = performance.now();
  isGameOver = false;
}

// Listen for key presses to jump or restart the game
document.addEventListener("keydown", (e) => {
  e.preventDefault();

  if (isGameOver && (e.key === " " || e.key === "Enter")) {
    resetGame();
    return;
  }
  if (!isGameOver && e.key === " ") {
    star.velocityY = star.jumpForce;
  }
});

// Touch or click to jump or restart
canvas.addEventListener("click", () => {
  if (isGameOver) {
    resetGame();
  } else {
    star.velocityY = star.jumpForce;
  }
});

function update() {
  if (isGameOver) return;

  // Gravity effect
  star.velocityY += star.gravity;
  star.y += star.velocityY;

  // If star hits top or bottom, game over
  if (star.y - star.radius <= 0 || star.y + star.radius >= canvas.height) {
    isGameOver = true;
    return;
  }

  // Update score based on elapsed time
  const elapsedMs = performance.now() - startTime;
  const elapsedSec = elapsedMs / 1000;
  score = parseFloat(elapsedSec.toFixed(1));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw star
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw score and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Poppins, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);

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

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start the first game
resetGame();
loop();
