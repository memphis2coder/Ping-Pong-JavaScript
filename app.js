// change the background color of the body
document.getElementById('body').style.backgroundColor = "lightGrey";

// select the canvas
const cvs = document.getElementById('pong');
// context of the canvas
const ctx = cvs.getContext("2d");

// create the user paddle OBJECT
const user = {
    x: 0,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: 'white',
    score: 0
}

// create the computer paddle OBJECT
const com = {
    x: cvs.width - 10,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: 'white',
    score: 0
}

// create the ball OBJECT
const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "white"
}

// create the net OBJECT
const net = {
    x: cvs.width / 2,
    y: 0,
    width: 2,
    height: 10,
    color: 'white'
}

// draw net FUNCTION
function drawNet() {
    for (let i = 0; i <= cvs.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}

// draw rectangle FUNCTION
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h)
};

// draw circle FUNCTION
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
};

// draw text FUNCTION
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px Sans-serif";
    ctx.fillText(text, x, y)
};

// render function to render the game
function render() {
    // clear the canvas first
    drawRect(0, 0, cvs.width, cvs.height, 'black');

    // draw the net
    drawNet();

    // draw score
    drawText(user.score, cvs.width / 4, cvs.height / 5, "white");
    drawText(com.score, 3 * cvs.width / 4, cvs.height / 5, "white");

    // draw the user and computer paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control the user paddle FUNCTION;
cvs.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height / 2;
}

// collision detection, b=ball, p=player FUNCTION
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    // if these conditions are true that means their is a collision
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// reset ball FUNCTION
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// update will take care of the logic FUNCTION
function update() {

    // update the score
    if (ball.x - ball.radius < 0) {
        // computer wins
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > cvs.width) {
        // user wins
        user.score++;
        resetBall();
    }

    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // computer AI to control the com paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

    // if the ball hits the bottom or top it should bounce
    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // determine which player is hitting the ball
    let player = (ball.x + ball.radius < cvs.width / 2) ? user : com;

    if (collision(ball, player)) {
        // where the ball hit the player
        let collidePoint = (ball.y - (player.y + player.height / 2));

        // normalization
        collidePoint = collidePoint / (player.height / 2);

        // calculate angle in Radian
        let angleRad = collidePoint * Math.PI / 4;

        // X direction of the ball when its hit
        let direction = (ball.x + ball.radius < cvs.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // every time the ball hits a paddle, we increase the speed
        ball.speed += 0.1;


    }
}

// game init FUNCTION
function game() {
    update();
    render();
}

// loop frames per sec
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);

