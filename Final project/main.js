//Final Project - No Title(Game like geometry dash)

/*
Could not fix issue where if there's more than 1 platform or base rectangle, the code breaks

*/


// Set up Canvas and Graphics Context
let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 1900;
cnv.height = 910;

//Event code listener
document.addEventListener("keydown", keyDownHandler);

//Square Character
let charHeight = 50;
let charWidth = 50;
let charYVal = cnv.height / 2
//Speed
let speed = 10;

//Jumping boolean
let jumping = false
//Falling boolean
let falling = false

//Jumping incrementer
let jumpDistance = 0

//Defining game characters
let blockChar = []
//Defining Obstacle arrays
let platforms = []
//Defining base platform
let baseRect = []

function startGame() {
    //Game Character
    blockChar = [{ x: cnv.width / 8, y: cnv.height / 2, w: 50, h: 50 }, { y: 0 }]

    //Base Platform
    baseRect = [
        { x: 0, y: charYVal + charHeight, w: cnv.width, h: cnv.height },
        { x: cnv.width + 700, y: 800, w: 100, h: 10}
    ]

    //Medium platforms
    platforms = [
        { x: cnv.width + 600, y: 605, w: 100, h: 10 },
        { x: cnv.width + 1000, y: 800, w: 100, h: 10}
    ]
}

//Effects array
let effects = []
//Getting random values
function createEffects() {
    for (n = 0; n < 100; n++) {
        effects.push({
            x: Math.randomDec(0, cnv.width),
            y: Math.randomDec(0, cnv.height),
            r: Math.randomDec(1, 5),
            color: randomRGB()
        })
    }

}

//Initiate the game and the effects
createEffects()
startGame()

//Animation
requestAnimationFrame(draw)

function draw() {
    //Draw
    ctx.clearRect(0, 0, cnv.width, cnv.height)


    //Effects
    for (n = 0; n < effects.length; n++) {
        //Drawing the effect
        drawEffectCircle(effects[n].x, effects[n].y, effects[n].r, effects[n].color)

        //Changing the radius
        effects[n].r -= rShrinkSpeed(n)

        //Create more effects if they're small enough
        if (effects[n].r <= 0.07) {
            effects.splice(0, effects.length)
            createEffects()
        }
    }

    //Platforms 
    for (n = 0; n < baseRect.length; n++) {

        //Drawing block character
        drawRect(blockChar[0].x, blockChar[0].y, blockChar[0].w, blockChar[0].h, "grey")


        //Drawing base platform
        drawRect(baseRect[n].x, baseRect[n].y, baseRect[n].w, baseRect[n].h, "white")


        //Drawing platforms
        drawRect(platforms[n].x, platforms[n].y, platforms[n].w, platforms[n].h, "white")

        //Change the speed
        baseRect[n].x -= speed
        platforms[n].x -= speed


        //If space is pressed
        if (jumping == true) {
            //Moves character up
            blockChar[0].y -= jumpDistance
            //After a certain distance, move character down
            if (blockChar[0].y <= blockChar[1].y - 300) {
                jumpDistance *= -1
            }
        }

        if (falling == true) {
            jumpDistance = 10;
            blockChar[0].y += jumpDistance
        }

        //If the character is on a platform, stop the jump
        if (blockChar[0].y + blockChar[0].h >= platforms[n].y && blockChar[0].x + blockChar[0].w >= platforms[n].x && blockChar[0].x <= platforms[n].x + platforms[n].w) {
            jumpDistance = 0
            jumping = false
            blockChar[1].y = blockChar[0].y
            falling = false
            //If the character is on a base platform, stop the jump
        } else if (blockChar[0].y + blockChar[0].h >= baseRect[n].y && blockChar[0].x + blockChar[0].w >= baseRect[n].x && blockChar[0].x <= baseRect[n].x + baseRect[n].w) {
            jumpDistance = 0
            jumping = false
            blockChar[1].y = blockChar[0].y
            falling = false
        }

        /*
        Could not get this working


        let shortestBasePlatDistance = shortestBasePlatformDistance()
        let shortestPlatDistance = shortestPlatformDistance()

        */

        //If the character isn't on a platform or base platform, fall
        if (blockChar[0].x >= baseRect[n].x + baseRect[n].w || blockChar[0].x + blockChar[0].w <= baseRect[n].x) {
            if (blockChar[0].x + blockChar[0].w <= platforms[n].x || blockChar[0].x >= platforms[n].x + platforms[n].w) {
                if (jumping == false) {
                    falling = true
                }
            }
        }
    }

    //If the character has fallen off the map, restart the game
    if (blockChar[0].y + blockChar[0].h >= cnv.height) {
        //Restart all the blocks
        startGame()
        
        //Reset variables
        jumping = false;
        falling = false;

        //Resetting Square Character
        let charHeight = 50;
        let charWidth = 50;
        let charYVal = cnv.height / 2
        //Speed
        let speed = 10;


    }
    //Request the function again to repeat
    requestAnimationFrame(draw)
}

//Drawing rectangles
function drawRect(x1, y1, x2, y2, color) {
    ctx.fillStyle = color
    ctx.fillRect(x1, y1, x2, y2)
}

//Key press function
function keyDownHandler(event) {
    if (event.code == "Space" && jumpDistance == 0) {
        jumpDistance = 10;
        jumping = true;
        blockChar[1].y = blockChar[0].y
    }
}

//Drawing circles for effects function
function drawEffectCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color
    ctx.fill();
}

//setting a random color
function randomRGB() {
    //Defining return variable
    let colorValues = "rgb"
    //Getting random values for the colors
    let rVal = Math.randomInt(0, 255)
    let gVal = Math.randomInt(0, 255)
    let bVal = Math.randomInt(0, 255)

    //Adding the rgb together
    colorValues = colorValues + "(" + rVal + ", " + gVal + ", " + bVal + ")"

    //Return value
    return colorValues
}

//Changing the shrinking speed
function rShrinkSpeed(index) {
    //Defining shrinkSpeed
    let shrinkSpeed = 0

    //Grabbing the specific value for the radius
    shrinkSpeed = effects[index].r / 50

    //Return shrinking value
    return shrinkSpeed
}

//Always make the character land on the platforms even if the distance between them is smaller than the increment variable for jumping
function platformCharConnector() {
    //Defining the distance between
    let distance = 0;
    //Finding the distance between and changing the jumpDistance so that it lands on top of the platform not through or above it
    for (n = 0; n < platforms.length; n++) {
        distance = blockChar[0].y + blockChar[0].h - platforms[n].y
        if (distance <= jumpingDistance) {
            jumpDistance = distance
        }
    }
}

//Always make the character land on the platforms even if the distance between them is smaller than the increment variable for jumping
function basePlatformCharConnector() {
    //Defining the distance between
    let distance = 0;
    //Finding the distance between and changing the jumpDistance so that it lands on top of the base platform not through or above it
    for (n = 0; n < baseRect.length; n++) {
        distance = blockChar[0].y + blockChar[0].h - baseRect[n].y
        if (distance <= jumpingDistance) {
            jumpDistance = distance
        }
    }
}


/*

Could not get this working



//Function to detect where the character is and always choose the closest platform so that the character doesn't fall through
function shortestPlatformDistance() {
    let shortestDistance = 0;
    let index = 0;
    //Finding the smallest value
    for (n = 0; n < platforms.length; n++) {
        shortestDistance = Math.min(...platforms[n].x)
    }
    //Finding the index of the smallest
    for (n = 0; n < platforms.length; n++) {
        if (platforms[n].x == shortestDistance) {
            index += n
        }
    }
    return platforms[index]
}

//Function to detect where the character is and always choose the closest base platform so that the character doesn't fall through
function shortestBasePlatformDistance() {
    let shortestDistance = 0;
    let index = 0;
    //Finding the smallest value
    for (n = 0; n < baseRect.length; n++) {
        shortestDistance = Math.min(...baseRect[n].x)
    }
    //Finding the index of the smallest
    for (n = 0; n < baseRect.length; n++) {
        if (baseRect[n].x == shortestDistance) {
            index += n
        }
    }
    return platforms[index]
}

*/