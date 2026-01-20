let container;
let containerWidth = 360;
let containerHeight = 620;
let context;

let ivanHeight = 50;
let ivanWidth = 36;
let ivanX = containerWidth/8;
let ivanY = containerHeight/2;

let ivan = {
    x : ivanX,
    y : ivanY,
    width : ivanWidth,
    height : ivanHeight
}

let obsArray = [];
let obsWidth = 64;
let obsHeight = 512;
let obsX = containerWidth;
let obsY = 0;

let topObs;
let bottomObs;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let points = 0;

let ivanBird = new Image();

window.onload = function() {
    container = document.getElementById("container");
    container.height = containerHeight;
    container.width = containerWidth;
    context = container.getContext("2d");
    
    ivanBird.src = "ivanbird.png";
    ivanBird.onload = function () {
        context.drawImage(ivanBird, ivan.x, ivan.y, ivan.width, ivan.height);
    }
    
    topObs = new Image();
    topObs.src = "topobs.png";
    
    bottomObs = new Image();
    bottomObs.src = "bottomobs.png";
    
    requestAnimationFrame(update);
    setInterval(placeObs, 1500);
}

function update () {
    requestAnimationFrame(update);
    if (gameOver) {
        context.fillStyle = "white";
        context.textAlign = "center";
        context.font = "24px 'Press Start 2P'";
        context.fillText("GAME OVER", container.width / 2, container.height / 2);
        return;
    }

    context.clearRect(0, 0, container.width, container.height);
    
    velocityY += gravity;
    ivan.y = Math.max(ivan.y + velocityY, 0);
    context.drawImage(ivanBird, ivan.x, ivan.y, ivan.width, ivan.height);
    
    if (ivan.y > container.height) {
        gameOver = true;
    }
    
    for (let i = 0; i < obsArray.length; i++) {
        let obs = obsArray[i];
        obs.x += velocityX;
        context.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);
        
        if (!obs.passed && ivan.x > obs.x + obs.width) {
            points += 0.5;
            obs.passed = true;
        }
        
        if (objHit(ivan, obs)) {
            gameOver = true;
        }
    }
    
    while (obsArray.length > 0 && obsArray[0].x < -obsWidth) {
        obsArray.shift();
    }
    
    context.fillStyle = "white";
    context.textAlign = "left";
    context.font = "20px 'Press Start 2P'";
    context.fillText(Math.floor(points), 10, 30);
}

function placeObs() {
    if (gameOver) {
        return;
    }
    let ranObsY = obsY - obsHeight/4 - Math.random()*(obsHeight/2);
    let startUp = container.height/4;
    let topObstacle = {
        img: topObs,
        x: obsX,
        y: ranObsY,
        width: obsWidth,
        height: obsHeight,
        passed: false
    }
    
    obsArray.push(topObstacle);
    
    let bottomObstacle = {
        img: bottomObs,
        x: obsX,
        y: ranObsY + obsHeight + startUp,
        width: obsWidth,
        height: obsHeight,
        passed: false
    }
    obsArray.push(bottomObstacle);
}

function moveBird() {
    if (gameOver) {
        ivan.y = ivanY;
        velocityY = 0;
        obsArray = [];
        points = 0;
        gameOver = false;
        return;
    }
    velocityY = -6;
}

document.addEventListener("touchstart", moveBird);
document.addEventListener("click", moveBird);

function objHit(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}