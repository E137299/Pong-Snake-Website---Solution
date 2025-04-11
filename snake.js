const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

// Define canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const squareSize = 20;
const numRows = canvasHeight / squareSize;
const numCols = canvasWidth / squareSize;

// --- Draw Checkerboard (ONCE, outside gameLoop) ---
function drawBoard() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const color = (row + col) % 2 === 0 ? 'DarkGrey' : 'Grey';
            ctx.fillStyle = color;
            ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
    }
}

class Apple {
    constructor() {
        this.x = parseInt(Math.random() * 20) * 20 + 10;
        this.y = parseInt(Math.random() * 20) * 20 + 10;
        this.radius = 20 / 2;
    }

    draw() {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    relocate() {
        this.x = parseInt(Math.random() * 20) * 20 + 10; // Corrected max range for apple
        this.y = parseInt(Math.random() * 20) * 20 + 10; // Corrected max range for apple.
    }
}

class Head {
    constructor(upKey, rightKey, downKey, leftKey) {
        this.x = 200;
        this.y = 200;
        this.width = 20;
        this.height = 20;
        this.speed = 20;
        this.upPressed = false;
        this.rightPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.upKey = upKey;
        this.rightKey = rightKey;
        this.downKey = downKey;
        this.leftKey = leftKey;
        this.direction = 0; // 0: right, 1: down, 2: left, 3: up  Initialize direction
        this.ateApple = false;
    }

    draw() {
        ctx.fillStyle = 'DarkMagenta';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.upPressed && this.direction != 1) {
            this.direction = 3;
        } else if (this.downPressed && this.direction != 3) {
            this.direction = 1;
        } else if (this.leftPressed && this.direction != 0) {
            this.direction = 2;
        } else if (this.rightPressed && this.direction != 2) {
            this.direction = 0;
        }

        switch (this.direction) {
            case 0: // right
                this.x += this.speed;
                break;
            case 1: // down
                this.y += this.speed;
                break;
            case 2: // left
                this.x -= this.speed;
                break;
            case 3: // up
                this.y -= this.speed;
                break;
        }

        // Keep snake within bounds
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));

        //check for apple collision
        if (Math.abs(this.x - apple.x + 10) < this.width && Math.abs(this.y - apple.y + 10) < this.height) {
            this.ateApple = true;
        }
    }
}

class Segment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = 'Magenta';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(obj) {
        this.x = obj.x;
        this.y = obj.y;
    }
}

const apple = new Apple();
const snake = [new Head("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft")]; // Snake is an array, starts with the head.

let gameSpeed = 200;
let lastTime = 0;

// --- Event Listeners for Keyboard Input ---
document.addEventListener('keydown', (event) => {
    if (event.key === snake[0].upKey) {
        snake[0].upPressed = true;
        snake[0].downPressed = false;
        snake[0].leftPressed = false;
        snake[0].rightPressed = false;
    } else if (event.key === snake[0].downKey) {
        snake[0].downPressed = true;
        snake[0].upPressed = false;
        snake[0].leftPressed = false;
        snake[0].rightPressed = false;
    } else if (event.key === snake[0].leftKey) {
        snake[0].leftPressed = true;
        snake[0].upPressed = false;
        snake[0].downPressed = false;
        snake[0].rightPressed = false;
    } else if (event.key === snake[0].rightKey) {
        snake[0].rightPressed = true;
        snake[0].upPressed = false;
        snake[0].downPressed = false;
        snake[0].leftPressed = false;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === snake[0].upKey) {
        snake[0].upPressed = false;
    } else if (event.key === snake[0].downKey) {
        snake[0].downPressed = false;
    } else if (event.key === snake[0].leftKey) {
        snake[0].leftPressed = false;
    } else if (event.key === snake[0].rightKey) {
        snake[0].rightPressed = false;
    }
});

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= gameSpeed) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBoard();
        apple.draw();

        //update snake
        let previousX = snake[0].x;
        let previousY = snake[0].y;
        snake[0].update();

        for (let i = 1; i < snake.length; i++) {
            let tempX = snake[i].x;
            let tempY = snake[i].y;
            snake[i].update({ x: previousX, y: previousY });
            previousX = tempX;
            previousY = tempY;
            snake[i].draw();
        }
        snake[0].draw();  //redraw head.

        // Check for apple collision
        if (snake[0].ateApple) {
            snake.push(new Segment(previousX, previousY)); // Add a new segment
            snake[0].ateApple = false; // Reset the flag
            apple.relocate(); // Move the apple
        }

        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}

drawBoard(); //draw once
gameLoop(0); // Start the loop, pass in currentTime
