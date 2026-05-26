
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let timeLeft = 30;
// Game state
let gameOver = false;

let net = {
    x: 100,
    y: 100,
    radius: 35
};

let fishes = [];
let bubbles = [];

// Creating the fish
for(let i = 0; i < 10; i++){

    fishes.push({

        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - 100),
        size: 20 + Math.random() * 20,
        speed: 2 + Math.random() * 3,
        color: getRandomColor()
    });
}
// Creating the bubbles
for(let i = 0; i < 20; i++){

    bubbles.push({

        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 3 + Math.random() * 5,
        speed: 1 + Math.random() * 2
    });
}

// Countdown timer
setInterval(function(){

    if(!gameOver){

        timeLeft--;

        if(timeLeft <= 0){

            gameOver = true;
        }
    }

}, 1000);

//  fish color
function getRandomColor(){
    const colors = ["orange", "yellow", "pink", "red", "purple"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// this is to move the net
canvas.addEventListener("mousemove", function(event){

    // APPLICATION STAGE
    // For user input
    const rect = canvas.getBoundingClientRect();

    net.x = event.clientX - rect.left;
    net.y = event.clientY - rect.top;
});

function drawFish(fish){

    // RASTERIZATION STAGE

    ctx.fillStyle = fish.color;

    ctx.beginPath();

    ctx.ellipse(
        fish.x,
        fish.y,
        fish.size,
        fish.size / 2,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(fish.x - fish.size, fish.y);
    ctx.lineTo(fish.x - fish.size - 20, fish.y - 15);
    ctx.lineTo(fish.x - fish.size - 20, fish.y + 15);
    ctx.fill();
}

function drawBubbles(){

    // RASTERIZATION STAGE
    ctx.fillStyle = "white";

    for(let bubble of bubbles){

        ctx.beginPath();
        ctx.arc(
            bubble.x,
            bubble.y,
            bubble.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

function moveBubbles(){

    // GEOMETRY STAGE
    for(let bubble of bubbles){

        bubble.y -= bubble.speed;

        if(bubble.y < 0){
            bubble.y = canvas.height;
            bubble.x = Math.random() * canvas.width;
        }
    }
}

function drawNet(){

    // RASTERIZATION STAGE
    ctx.strokeStyle = "brown";
    ctx.lineWidth = 4;

    // Circle
    ctx.beginPath();
    ctx.arc(net.x, net.y, net.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Handle
    ctx.beginPath();
    ctx.moveTo(net.x, net.y);
    ctx.lineTo(net.x - 30, net.y + 50);
    ctx.stroke();
}

function moveFish(){

    // GEOMETRY STAGE

    for(let fish of fishes){

        fish.x += fish.speed;

        if(fish.x > canvas.width + 50){

            fish.x = -50;

            fish.y = Math.random() * (canvas.height - 100);
        }
    }
}

function catchFish(){

    // APPLICATION STAGE
    // Collision detection and scoring

    for(let fish of fishes){

        if(

            net.x > fish.x - fish.size &&
            net.x < fish.x + fish.size &&

            net.y > fish.y - fish.size &&
            net.y < fish.y + fish.size

        ){

            score++;
            fish.x = -50;
            fish.y = Math.random() * (canvas.height - 100);
        }
    }
}
// Draw score and timer
function drawText(){

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 40);
    ctx.fillText("Time: " + timeLeft, 20, 80);
}


// Draw plants
function drawPlants(){

    ctx.fillStyle = "green";
    for(let i = 0; i < canvas.width; i += 100){
        ctx.fillRect(i, 430, 15, 70);
    }
}

function drawGameOver(){

    ctx.fillStyle = "black";
    ctx.font = "60px Arial";
    ctx.fillText("GAME OVER", 250, 220);
    ctx.font = "40px Arial";
    ctx.fillText("Final Score: " + score, 300, 300);
}


// Main game loop
function gameLoop(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(!gameOver){

        drawBubbles();
        moveBubbles();
        drawPlants();
        for(let fish of fishes){

            drawFish(fish);
        }

        drawNet();
        drawText();
        moveFish();
        catchFish();

    }else{

        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();