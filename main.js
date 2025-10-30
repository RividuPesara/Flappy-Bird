//board

let board;
let boardWidth =360;
let boardHeight =640;
let context;

//bird
let birdWidth =90;
let birdHeight =90;
let birdX=boardWidth/8;
let birdY =boardHeight/2;
let birdImage

// Bird animation variables
let birdFrame = 0;       // Current frame
let birdFrameCount = 4;  // Total frames in sprite
let birdFrameWidth = 64; // Width of one single frame in sprite
let birdFrameHeight = 64; // Height of one single frame in sprite
let frameDelay = 5;      // Number of updates before switching frame
let frameDelayCounter = 0;


//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight =512;
let pipeX=boardWidth;
let pipeY =0;

let topPipeImage;
let bottomPipeImage;

//physics
let velocityX =-2;  //pipes left speed
let velocityY= 0; //jump speed
let gravity=0.4;

let gameOver = false;
let score=0;


let bird = {
    x:birdX,
    y:birdY,
    width : birdWidth,
    height: birdHeight,
    hitbox: {
    offsetX: 20,                  
    offsetY: 20,                   
    width: birdWidth - 40,      
    height: birdHeight - 40       
    }
}

window.onload =function(){
    board = document.getElementById('board');
    board.height= boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    //Load image
    birdImage = new Image()
    birdImage.src = "./img/fly.png";

    topPipeImage=new Image();
    topPipeImage.src ="./img/toppipe.png";

    bottomPipeImage=new Image();
    bottomPipeImage.src ="./img/bottompipe.png";
    

    requestAnimationFrame(update);
    setInterval(placePipes,1500); //placing pipes 1.5 seconds
    document.addEventListener("keydown",moveBird);

}

function update(){
    if (gameOver){
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);

    //bird drawing
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity limit from going to the top

    //match hitbox position to the current one
    bird.hitbox.x = bird.x + bird.hitbox.offsetX;
    bird.hitbox.y = bird.y + bird.hitbox.offsetY;

    //bird animation frame handling
    frameDelayCounter++;
    if (frameDelayCounter >= frameDelay) {
        birdFrame = (birdFrame + 1) % birdFrameCount;
        frameDelayCounter = 0;
    }

    //draw bird frame
    context.drawImage(
        birdImage,
        birdFrame * birdFrameWidth, 0,       
        birdFrameWidth, birdFrameHeight,     
        bird.x, bird.y,                       
        bird.width, bird.height               
    );

    if (bird.y>board.height){
        gameOver=true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x+pipe.width){
            score+=0.5
            pipe.passed=true
        }
        if (detectCollision(bird,pipe)){
            gameOver=true;
        }
    }

    //memory
    while (pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift(); //this is used to remove the first element of the array
    }

    //score
    context.fillStyle='white';
    context.font='45px sans-serif';
    context.fillText(score,5,45);

    if (gameOver){
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", 70, 320);
    }
}

function placePipes(){
    if (gameOver){
        return;
    }

    let randomPipeY =pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace = board.height / 4

    let topPipe ={
        img: topPipeImage,
        x:pipeX,
        y: randomPipeY,
        width : pipeWidth,
        height:pipeHeight,

        passed:false
    }

    let bottomPipe ={
        img:bottomPipeImage,
        x:boardWidth,
        y:randomPipeY+pipeHeight+openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
        // Jump
        if (!gameOver) {
            velocityY = -6;
        } else {
            // Restart game
            bird.y = birdY;
            velocityY = 0;
            pipeArray = [];
            score = 0;
            gameOver = false;

            // Restart update loop
            requestAnimationFrame(update);
        }
    }
}


function detectCollision(bird, pipe) {
    //shrink bird rectangle by 20 pixels on each side
    let shrink = 20;

    return (
        bird.x + shrink + bird.width - shrink * 2 > pipe.x &&
        bird.x + shrink < pipe.x + pipe.width &&
        bird.y + shrink + bird.height - shrink * 2 > pipe.y &&
        bird.y + shrink < pipe.y + pipe.height
    );
}

