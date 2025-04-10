// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Define canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// --- Paddle Class ---
class Paddle {
    constructor(x, y, width, height, speed, upKey, downKey) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.upPressed = false;
        this.downPressed = false;
        this.upKey = upKey;
        this.downKey = downKey;
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.upPressed) {
            this.y -= this.speed;
        }
        if (this.downPressed) {
            this.y += this.speed;
        }
        // Keep paddle within the bounds of the canvas
        this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
    }
}

// --- Create Paddle Instances ---
const paddleHeight = 100;
const paddleWidth = 10;
const paddleSpeed = 5;

const player1 = new Paddle(
    10,
    (canvasHeight - paddleHeight) / 2,
    paddleWidth,
    paddleHeight,
    paddleSpeed,
    'w',
    's'
);

const player2 = new Paddle(
    canvasWidth - paddleWidth - 10,
    (canvasHeight - paddleHeight) / 2,
    paddleWidth,
    paddleHeight,
    paddleSpeed,
    'ArrowUp',
    'ArrowDown'
);

// --- Ball ---
// Ball properties
let ballRadius = 10;
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;

// --- Scoring ---
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// --- Event Listeners for Keyboard Input ---
document.addEventListener('keydown', (event) => {
    if (event.key === player1.upKey) {
        player1.upPressed = true;
    } else if (event.key === player1.downKey) {
        player1.downPressed = true;
    }

    if (event.key === player2.upKey) {
        player2.upPressed = true;
    } else if (event.key === player2.downKey) {
        player2.downPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === player1.upKey) {
        player1.upPressed = false;
    } else if (event.key === player1.downKey) {
        player1.downPressed = false;
    }

    if (event.key === player2.upKey) {
        player2.upPressed = false;
    } else if (event.key === player2.downKey) {
        player2.downPressed = false;
    }
});

// --- Game Loop ---
function gameLoop() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 2. Draw game elements
    player1.draw();
    player2.draw();
    drawBall();
    drawScore();

    // 3. Update game state
    player1.update();
    player2.update();
    updateBallPosition();
    checkPaddleCollision();
    checkWallCollision();

    // 4. Request the next frame
    requestAnimationFrame(gameLoop);
}

// --- Drawing Functions (Ball and Score remain the same) ---
function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#eee';
    ctx.fillText(scorePlayer1, canvasWidth / 4, 30);
    ctx.fillText(scorePlayer2, 3 * canvasWidth / 4, 30);
}

// --- Update Functions (Ball and Collision remain the same) ---
function updateBallPosition() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function checkPaddleCollision() {
    // Collision with Player 1's paddle
    if (ballX - ballRadius < player1.x + player1.width &&
        ballY + ballRadius > player1.y &&
        ballY - ballRadius < player1.y + player1.height) {
        ballSpeedX = -ballSpeedX;
    }

    // Collision with Player 2's paddle
    if (ballX + ballRadius > player2.x &&
        ballY + ballRadius > player2.y &&
        ballY - ballRadius < player2.y + player2.height) {
        ballSpeedX = -ballSpeedX;
    }
}

function checkWallCollision() {
    // Top and bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
        ballSpeedY = -ballSpeedY;
    }

    // Scoring (ball goes out of bounds)
    if (ballX - ballRadius < 0) {
        scorePlayer2++;
        resetBall();
    } else if (ballX + ballRadius > canvasWidth) {
        scorePlayer1++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() * 4) - 2;
}

// --- Start the Game Loop ---
gameLoop();