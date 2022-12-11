const pitch = document.getElementById('pitch');
const ctx = pitch.getContext("2d");
const width = pitch.width;
const height = pitch.height; 
let single = document.getElementById('sp');
let multi = document.getElementById('mp'); 
let menu = document.getElementById('menu'); 
let scoreBoard = document.getElementById('score');
let direction = 1;

let paddle_one = {
    width: 10,
    height: 32,
    x: 0,
    y: (height / 2) - 16,
    score: 0,
};

let paddle_two = {
    width: 10,
    height: 32,
    x: width - 10,
    y: (height / 2) - 16,
    score: 0,
    speed: 0.08,
};

let ball = {
    width: 4,
    height: 4,
    x: width/2 - 2,
    y: (height / 2) - 2, 
    direction_x: -1,
    direction_y: 0,
    speed: 2,
};

const net = {
    width: 2,
    height: 8,
    x: (width-2) / 2,
    y: 0
}

function easymode(){
    menu.style.visibility = 'hidden';
    pitch.style.visibility = 'visible'; 
    scoreBoard.style.visibility = 'visible';
    setInterval(game, 20);
    pitch.addEventListener('mousemove',move);
};

function normalmode(){
    menu.style.visibility = 'hidden';
    pitch.style.visibility = 'visible';
    scoreBoard.style.visibility = 'visible';
    paddle_two.speed = 0.15;
    setInterval(game, 20);
    pitch.addEventListener('mousemove',move);
};

function goatmode(){
    menu.style.visibility = 'hidden';
    pitch.style.visibility = 'visible';
    scoreBoard.style.visibility = 'visible';
    paddle_two.speed = 0.5;
    setInterval(game, 20);
    pitch.addEventListener('mousemove',move);
};

// function used to draw the paddles and ball
function draw(rect){
    ctx.fillStyle = "white";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
};


//draw a net in the middle of the canvas
function drawNet() {
    for(let i = 0; i < height; i+=18)
    { 
        ctx.fillStyle = "white";
        ctx.fillRect(net.x, net.y + i, net.width, net.height);
    }    
}

// actual game function that calls a function to update the position of all the elements and than refresh the canvas
function game(){
    update();
    refresh();
}; 

//refresh the canvas redrawing paddles, ball and Net 
function refresh(){
        clearScreen();
        drawNet();
        draw(paddle_one);
        draw(paddle_two);
        draw(ball);
}; 

// update the ball position
function update(){
    //increment the ball x and y based on them direction
    ball.x += ball.direction_x;
    ball.y += ball.direction_y;

    if (ball.x <= 0) //if the ball exits or tuch the left side of the canvas increment the COM score
    {   
        updateScore(paddle_two);
    }
    else if (ball.x + ball.width >= width) ////if the ball exits or tuch the right side of the canvas increment the Player score
    {
        updateScore(paddle_one);
    }
    /*if the ball hits the top or the bottom of the canvas and the Y direction isn`t inverted yet,
     invert the Y direction of the ball.
    */
    if ((((ball.y + ball.height) >= pitch.height) && ball.direction_y > 0) || (ball.y <= 0 && ball.direction_y < 0)){ 
    ball.direction_y *= -1;
    }

    //detect witch side of the field the ball is and select the relative player
    let player = (ball.x < pitch.width/2) ? paddle_one : paddle_two;

    //call a the function on the player selected
    if(checkcollision(ball, player)){

        /*calculate which direction the ball should go base on where it hits the paddle
        if hits the center the ball will go streight while if hits the very top will follow a 45 degrees angle*/

        let collisionPoint = (ball.y + ball.height/2) - (player.y + player.height/2);
        collisionPoint = collisionPoint / (player.height / 2); 
        let angle = collisionPoint * Math.PI / 4;



        direction = (ball.x < pitch.width/2) ? 1 : -1;

        ball.direction_x = direction * ball.speed * Math.cos(angle);
        ball.direction_y = ball.speed * Math.sin(angle);
        
        //increment the ball speed every time it hits the paddle
        ball.speed += 0.2;
    }

    moveCom(); 
    
};

// Check if the ball hits the paddle
function checkcollision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y;
    b.bottom = b.y + b.height;
    b.left = b.x;
    b.right = b.x + b.width;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top  //return true if hitted
};

//clear the canvas redrawing it 
function clearScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    drawNet();
};

// move the paddle_one based on the mouse Y
function move(evt){
    let rect = pitch.getBoundingClientRect();
    if((evt.clientY-rect.top) > 0 && (evt.clientY-rect.top) < pitch.height)
    { 
        paddle_one.y = evt.clientY - rect.top - paddle_one.height/2;
    }    
};

// move the paddle_two trying to keep the center of the ball allying with the center of the paddle
function moveCom(){
    if((ball.y + (ball.height/2)) != (paddle_two.y + (paddle_two.height/2)))
    {
        paddle_two.y += ((ball.y + (ball.height/2)) - (paddle_two.y + (paddle_two.height/2))) * paddle_two.speed
    }
};

//increment the ball x and ball y
function moveBall(){
    ball.x += (ball.direction_x * ball.speed);
    ball.y += (ball.direction_y * ball,speed);
};

//update the scoreboard
function updateScore(p) {
    reset();
    p.score++;
    scoreBoard.innerHTML = `${paddle_one.score} : ${paddle_two.score}`;
}

//reset ball X,Y speed and direction after a GOAL
function reset() {
    ball.x = (width / 2) - (ball.width / 2);
    ball.y = (height / 2) - (ball.height / 2);
    ball.speed = 2;
    
    ball.direction_y = 0;
    ball.direction_x = direction;
}
