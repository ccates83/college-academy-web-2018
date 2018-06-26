const ONE_SECOND = 1000;
        
var canvas;
var canvasContext;
    
// Ball vars
var ballRadius = 5;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 5;
    
// User paddle vars
var userPaddleY = 250;
const USER_PADDLE_HEIGHT = 100;
const USER_PADDLE_WIDTH = 10;
        
// AI paddle vars
var cpuPaddleY = 250;
const CPU_PADDLE_HEIGHT = 100;
const CPU_PADDLE_WIDTH = 10;
        
// Score vars
var userScore = 0;
var cpuScore = 0;
const WINNING_SCORE = 3;
        
var showingWinScreen = false;
 
// This will run as soon as the file is loaded in the browser
window.onload = function() {
    //console.log("Loaded")
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    // Update the Game
    var fps = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, ONE_SECOND/fps);
    
    // Add an event listener to listen for when the mouse is clicked down to restart the game
    canvas.addEventListener('mousedown', handleMouseClick);
    
    // Add an event listener to listen for mouse movements and updating the user paddle y coordinate
    canvas.addEventListener('mousemove', 
            function(evt) {
                var mousePos = calculateMousePos(evt);
                userPaddleY = mousePos.y - (0.5 * USER_PADDLE_HEIGHT);
            });
    
}
    
// Draws the graphics in the game onto the canvas
function drawEverything() {
    // Background
    colorRect(0, 0, canvas.width, canvas.height, 'black');
            
    if(showingWinScreen) {
        if (userScore >= WINNING_SCORE) {
            canvasContext.fillStyle = 'green';
            canvasContext.fillText('You Won!', 300, 200);
        } else {
            canvasContext.fillStyle = 'red';
            canvasContext.fillText('You lost :(', 300, 200);
        }
                
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Click to play again', 300, canvas.height-100);
        return;
    }
            
    console.log('Game drawn');
    console.log('Ball coordinates: (' + ballX + ', ' + ballY + ')');
        
    // Net
    drawNet();
    // User paddle
    colorRect(0, userPaddleY, USER_PADDLE_WIDTH, USER_PADDLE_HEIGHT, 'white');
    // CPU paddle
    colorRect(canvas.width - CPU_PADDLE_WIDTH, cpuPaddleY, CPU_PADDLE_WIDTH, CPU_PADDLE_HEIGHT, 'white');
    // Draw the ball
    colorCircle(ballX, ballY, ballRadius, 'red');
            
    // Show the scores
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(userScore, 100, 100);
    canvasContext.fillText(cpuScore, canvas.width-100, 100);
    
}
    
// Moves and updates positions of every piece of the game
function moveEverything() {
    if(showingWinScreen) {
        return;
    }
            
    cpuMovement();
            
    // Handles collisions with the side walls
    if ((ballX + ballRadius) > canvas.width){ // right wall
        // If the ball collides with the CPU's paddle
        if(ballY > cpuPaddleY && 
           ballY < cpuPaddleY + CPU_PADDLE_HEIGHT) {
            ballSpeedX *= -1;
            // Ball control based on where the ball hits the paddle  closer to the edge makes the Y speed higher
            var deltaY = ballY - (cpuPaddleY+CPU_PADDLE_HEIGHT/2);
            ballSpeedY = deltaY / 3;
        } else {
            userScore++; // must be before ballReset bc win check is in ballReset
            ballReset();
        }
    }
            
    if ((ballX - ballRadius) < 0) { // left wall
        // If the ball collides with the user's paddle
        if(ballY > userPaddleY && 
           ballY < userPaddleY + USER_PADDLE_HEIGHT) {
            ballSpeedX *= -1;
            // Ball control based on where the ball hits the paddle
            var deltaY = ballY - (userPaddleY+USER_PADDLE_HEIGHT/2);
            ballSpeedY = deltaY / 3;
        } else {
            cpuScore++;
            ballReset();
        }
    }
    
    // Handles collisions with the top and bottom walls
    if((ballY + ballRadius) > canvas.height || 
       (ballY - ballRadius) < 0) {
        ballSpeedY *= -1;
    }
                
    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
}
        
// Get mouse positions
function calculateMousePos(evt) {
    // Gets the rectangle of the game canvas
    var rect = canvas.getBoundingClientRect();
    // Gets the root position in the web browser scroll
    var root = document.documentElement;
    // Calculates the X and Y on the gameCanvas element, accounting for where the gameCanvas is and if the user has scrolled
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    
    return {
        x:mouseX,
        y:mouseY
    };
}
        
// Resets the ball if it hits a side wall
function ballReset() {
    if (userScore >= WINNING_SCORE ||
       cpuScore >= WINNING_SCORE) {
        showingWinScreen = true;
    }
            
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
}

// Accounts for CPU paddle movement
function cpuMovement() {
    var cpuPaddleYCenter = cpuPaddleY + CPU_PADDLE_HEIGHT / 2;
    if(cpuPaddleYCenter < ballY - 35) {
        cpuPaddleY += 6;
    } else if (cpuPaddleYCenter > ballY + 35){
        cpuPaddleY -= 6;
    }
}
                
// Compresses drawing a rectangle into a single function
function colorRect(x, y, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(x, y, width, height);
}
        
// Compresses drawing a circle into a single function
function colorCircle(x, y, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}
        
// Draws the net in the middle of the screen
function drawNet() {
    for (var i = 0; i < canvas.height; i += 40){
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}
        
// Handles mouse click down event, resetting the game
function handleMouseClick(evt) {
    userScore = 0;
    cpuScore = 0;
    showingWinScreen = false;
}