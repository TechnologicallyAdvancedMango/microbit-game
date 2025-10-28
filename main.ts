// Don't use the default renderer so we can set the brightness of each pixel
game.pause();

const obstacleBrightness = 100;
const playerBrightness = 255;

const emptyImg = images.createImage(`
. . . . .
. . . . .
. . . . .
. . . . .
. . . . .
`);

function moveObstacles () {
    for (let i = 0; i <= obstacles.length - 1; i++) {
        const thisObst = obstacles[i];
        // Remove this obstacle if it's at the bottom
        if (thisObst.get(LedSpriteProperty.Y) >= 4) {
            obstacles.splice(obstacles.indexOf(thisObst), 1);
        } else {
            // Otherwise, move this obstacle down
            thisObst.change(LedSpriteProperty.Y, 1);
        }
        
    }
}


let player: game.LedSprite;

let obstacles: game.LedSprite[] = [];

function spawnObstacle(x = 2) {
    const thisObst = game.createSprite(x, 0);
    obstacles.push(thisObst);
}

function drawObstacles() {
    for(let i = 0; i < obstacles.length; i++) {
        const thisObst = obstacles[i];
        const thisX = thisObst.get(LedSpriteProperty.X);
        const thisY = thisObst.get(LedSpriteProperty.Y);

        led.plotBrightness(thisX, thisY, obstacleBrightness);
    }
}

function drawPlayer() {
    led.plotBrightness(player.get(LedSpriteProperty.X), player.get(LedSpriteProperty.Y), playerBrightness);
}


function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const thisObst = obstacles[i];

        if (thisObst.isTouching(player)) {
            dead = true;
        }
    }
}

function die() {
    serial.writeLine("dead");
    basic.clearScreen();

    while(dead) {
        if (input.logoIsPressed()) main();
        basic.showNumber(score);
        basic.clearScreen();
        basic.pause(1000);
    }
}


let dead = false
let score = 0;
// Main loop
function main() {
    // Game setup
    dead = false;
    player = game.createSprite(2, 3);
    obstacles = [];
    score = 0;

    // Left
    input.onButtonPressed(Button.A, function () {
        player.change(LedSpriteProperty.X, -1);
    })
    // Right
    input.onButtonPressed(Button.B, function () {
        player.change(LedSpriteProperty.X, 1);
    })

    while(!dead) {
        basic.clearScreen();
        moveObstacles();

        // 33% chance to spawn obstacle
        if (Math.random() < 0.33) {
            spawnObstacle(Math.floor(Math.random() * 5));
        }

        // Check collision and return early if dead
        checkCollision();
        if(dead) {
            die();
            return;
        }

        drawObstacles();
        drawPlayer();

        score++;
        basic.pause(300);
    }
}
main();