// Don't use the default renderer so we can set the brightness of each pixel
game.pause();

const obstacleBrightness = 100;
const playerBrightness = 255;

const betterDigits: Image[] = [];

const betterZero = images.createImage(`
. . # . .
. # . # .
. # . # .
. # . # .
. . # . .
`)

const betterOne = images.createImage(`
. . # . .
. # # . .
. . # . .
. . # . .
. # # # .
`)
const betterTwo = images.createImage(`
. . # . .
. # . # .
. . . # .
. . # . .
. # # # .
`)
const betterThree = images.createImage(`
. # # . .
. . . # .
. . # # .
. . . # .
. # # . .
`)
const betterFour = images.createImage(`
. # . # .
. # . # .
. # # # .
. . . # .
. . . # .
`)
const betterFive = images.createImage(`
. # # # .
. # . . .
. # # . .
. . . # .
. # # . .
`)
const betterSix = images.createImage(`
. . # # .
. # . . .
. # # . .
. # . # .
. . # . .
`)
const betterSeven = images.createImage(`
. # # # .
. . . # .
. . # . .
. . # . .
. . # . .
`)
const betterEight = images.createImage(`
. # # # .
. # . # .
. . # . .
. # . # .
. # # # .
`)
const betterNine = images.createImage(`
. . # . .
. # . # .
. . # # .
. . . # .
. . . # .
`)

betterDigits.push(betterZero);
betterDigits.push(betterOne);
betterDigits.push(betterTwo);
betterDigits.push(betterThree);
betterDigits.push(betterFour);
betterDigits.push(betterFive);
betterDigits.push(betterSix);
betterDigits.push(betterSeven);
betterDigits.push(betterEight);
betterDigits.push(betterNine);


function betterShowNum(value = 0, interval = 500, pause = 0) {
    const digits = value.toString().split('');
    for(let i = 0; i < digits.length; i++) {
        betterDigits[parseInt(digits[i])].scrollImage(1, interval);
        basic.pause(pause);
    }
}

const emptyImg = images.createImage(`
. . . . .
. . . . .
. . . . .
. . . . .
. . . . .
`)

function scrollClear(time = 0) {
    emptyImg.scrollImage(1, time);
}

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
        scrollClear(150);
        betterShowNum(score, 150);
        
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

    // 321 countdown
    betterShowNum(321, 50, 800);

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