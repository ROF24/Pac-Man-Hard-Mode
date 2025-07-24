/* 
1 = wall
2 = Dot
3 = Traps
4 = Gun
5 = Locks
6 = Arrow Shooter
*/

// Setting up variables
let randomMovement = false;
let randomMovementTimer = 0;
let lastArrowTime = 0;
let maze;
let pacRow = 1;
let pacCol = 1;
let ArrowCol, ArrowRow;
let bullet = null;
let direction = "RIGHT";
let titleSize;
let gameState = "start";
let gunImage = [];
let guns = [];
let levelWin = 0;
let ghostImages = [];
let ghosts = [
  { name: "Blinky", row: 1, col: 20, img: ghostImages[0], stunned: false, stunTimer: 0 },
  { name: "Pinky", row: 1, col: 26, img: ghostImages[1], stunned: false, stunTimer: 0 },
  { name: "Inky", row: 15, col: 5, img: ghostImages[2], stunned: false, stunTimer: 0 },
  { name: "Clyde", row: 10, col: 20, img: ghostImages[3], stunned: false, stunTimer: 0 }
];
let PacGun = false;
const AudioofGun = new Audio("gun/gun.wav");
const AudioofBullet = new Audio("gun/shot.mp3");
const AudioofScream = new Audio("gun/scream1.mp3");
const AudioofMusic = new Audio("Music/Music.mp3");
const AudioofOver = new Audio("Music/Over.mp3");
const AudioofWin = new Audio("Music/Win.mp3");
const AudioofMove = new Audio("Music/move.mp3");
let ArrowImg;
let arrows = [];
let arrowsShooterImage = null;
let arrowsShooter = [];
//Loading the first level
if (levelWin === 0) {
  // Level 1
  maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,3,2,2,2,2,2,1],
  [1,2,1,2,2,1,3,1,1,1,1,2,1,1,2,1,1,1,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,1,1,1,2,2,1,1,1,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1,1,1,1,2,1,2,2,2,2,2,2,2,2,1,2,1],
  [1,1,1,1,1,1,1,1,1,1,2,1,4,2,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [2,2,2,2,2,2,3,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [1,1,1,1,1,1,1,1,1,1,2,1,5,5,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,2,1,2,1],
  [1,2,1,2,2,2,2,1,2,1,1,1,2,2,1,1,1,2,1,2,2,2,2,1,2,1,2,1],
  [1,2,1,1,1,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,3,2,1,2,1,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
}

//Image Load
function preload() {
  for (let i = 0; i < 1; i++) {
    gunImage.push(loadImage(`gun/gun.png`));
  }
  for (let i = 1; i <= 4; i++) {
    ghostImages.push(loadImage(`Images/ghost${i}.png`));
  }
  ArrowImg = loadImage("Images/arrow.png");
}

// Setup
function setup() {
  // Adjust size based on screen width
  titleSize = calculateTitleSize();
  createCanvas(maze[0].length * titleSize, maze.length * titleSize);
  frameRate(10);
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].img = ghostImages[i];
  }
  guns = [];
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 4) {
        guns.push({ row, col, img: gunImage[0] });
      }
    }
  }
  arrowsShooterImage = loadImage("Images/arrowsShooter.png");
}

// Start
function draw() {
  background(0);
  if (gameState === "start") return showStartScreen();
  if (gameState === "level1won") return showlevel1Won();
  if (gameState === "over") return showGameOver();
  drawMazeAndDots();
  AudioofMusic.play();

  if (frameCount % 5 === 0) {
    movePacman();
    for (let ghost of ghosts) moveGhost(ghost);
  }

  drawPacman();
  drawGhosts();
  traps();
  
if (frameCount % 150 === 0) {
  randomMovement = true;
  randomMovementTimer = 90; // lasts for 3 seconds
}

if (randomMovement) {
  randomMovementTimer--;
  if (randomMovementTimer <= 0) {
    randomMovement = false;
  }
}
if (gameState === "playing" && levelWin == 1 && frameCount - lastArrowTime > 40) {
  for (let shooter of arrowsShooter) {
    fireArrow(shooter);
  }
  lastArrowTime = frameCount;
}
if (arrows.length > 0) moveAndDrawArrows();
if (bullet !== null) moveAndDrawBullet();
}

// Drawing your surroundings
function drawMazeAndDots() {
  let dotsLeft = 0;
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      let x = col * titleSize;
      let y = row * titleSize;
      if (maze[row][col] === 1) {
        fill(0, 0, 255);
        rect(x, y, titleSize, titleSize);
      } else {
        fill(0);
        rect(x, y, titleSize, titleSize);
        if (maze[row][col] === 2) {
          fill(255);
          ellipse(x + titleSize / 2, y + titleSize / 2, 6);
          dotsLeft++;
        } else if (maze[row][col] === 3) {
          fill(255, 0, 0);
          rect(x, y, titleSize, titleSize);
        } else if (maze[row][col] === 4) {
          drawGun();
        } else if (maze[row][col] === 5) {
            fill(255, 200, 0); // lock background
            rect(x, y, titleSize, titleSize);
          
            // Draw lock shackle (circle)
            fill(0);
            ellipse(x + titleSize / 2, y + titleSize * 0.35, titleSize * 0.5, titleSize * 0.5);
          
            // Draw lock body (triangle)
            fill(0);
            triangle(
              x + titleSize * 0.5, y + titleSize * 0.55,  // top (tip)
              x + titleSize * 0.3, y + titleSize * 0.9,   // bottom-left
              x + titleSize * 0.7, y + titleSize * 0.9    // bottom-right
            );
            setTimeout(() => {
            maze[row][col] = 0;  
          }, 3000);//delete the locks after 30 seconds
        
          } else if (maze[row][col] === 6) {
             image(arrowsShooterImage, x, y, titleSize, titleSize);
          }
          
      }
    }
  } 
  //Win Condition
  if (maze[pacRow][pacCol] === 2) maze[pacRow][pacCol] = 0;
  if (dotsLeft === 0) {
    gameState = "level1won";
    levelWin ++;
  }
}

// Drawing the player
function drawPacman() {
  fill(255, 255, 0);
  let x = pacCol * titleSize + titleSize / 2;
  let y = pacRow * titleSize + titleSize / 2;
  push();
  translate(x, y);
  rotate(getRotationAngle(direction));
  arc(0, 0, titleSize - 7, titleSize - 7, radians(45), radians(315), PIE);
  pop();
}

// Drawing the ghosts
function drawGhosts() {
  for (let ghost of ghosts) {
    if (ghost.stunned) {
      tint(0, 0, 255); // Blue tint for stunned ghosts
    } else {
      noTint();
    }
    image(ghost.img, ghost.col * titleSize, ghost.row * titleSize, titleSize, titleSize);
    noTint();

    if (ghost.row === pacRow && ghost.col === pacCol && !ghost.stunned) {
      gameState = "over";
    }
  }
}

// Drawing the... weapon. Ruben, 
function drawGun() {
  for (let i = guns.length - 1; i >= 0; i--) {
    let gun = guns[i];
    image(gun.img, gun.col * titleSize, gun.row * titleSize, titleSize, titleSize);
    if (gun.row === pacRow && gun.col === pacCol) {
      guns.splice(i, 1);
      PacGun = true; 
      AudioofGun.play(); // SHOTGUN
    }
  }
}

// Player movement
function movePacman() {
  let nextRow = pacRow;
  let nextCol = pacCol;
  if (direction === "UP") nextRow--;
  else if (direction === "DOWN") nextRow++;
  else if (direction === "LEFT") nextCol--;
  else if (direction === "RIGHT") nextCol++;

  if (nextCol < 0) nextCol = maze[0].length - 1;
  if (nextCol >= maze[0].length) nextCol = 0;

  if (maze[nextRow][nextCol] !== 1 && maze[nextRow][nextCol] !== 5) {
    pacRow = nextRow;
    pacCol = nextCol;
    
    for (let ghost of ghosts) {
      if (ghost.row === pacRow && ghost.col === pacCol && !ghost.stunned) {
        gameState = "over";
      }
    }
  }
}

// Key Detection
function keyPressed() {
  if (gameState !== "playing") return;
  if (keyCode === UP_ARROW || keyCode === 87) direction = "UP";
  else if (keyCode === DOWN_ARROW || keyCode === 83) direction = "DOWN";// changes the direction pacman is facing to up
  else if (keyCode === LEFT_ARROW || keyCode === 65) direction = "LEFT";// changes the direction pacman is facing to left
  else if (keyCode === RIGHT_ARROW || keyCode === 68) direction = "RIGHT";// changes the direction pacman is facing to right
  else if (keyCode === 32 && bullet === null && PacGun) {
    fireBullet();
    AudioofBullet.play(); // plays the sound when the bullet is fired
  }// shoots a bullet
}

// Mouse uses
function mousePressed() {
  if (gameState === "start") gameState = "playing"; 
  if (gameState === "level1won" && level1Win && level2Win == "notstarted" || PacGun) {
    level2Win = false;
    level1Win = true;
    PacGun = false;
    gameState = "playing";
    resetLevel();
  }
  if(gameState === "over") {
    gameState = "playing";
    PacGun = false;
    resetLevel();
  }
}

// Ghost movement
function moveGhost(ghost) {
  if (randomMovement) {
  moveGhostRandomly(ghost);
  return;
  }
  if (ghost.stunned) {
    ghost.stunTimer--;
    if (ghost.stunTimer <= 0) {
      ghost.stunned = false;
    }
    return;
  }

  let target = getTargetTile(ghost);
  let bestDir = null;
  let minDist = Infinity;

  let dirs = [
    { r: -1, c: 0, name: "UP" },
    { r: 1, c: 0, name: "DOWN" },
    { r: 0, c: -1, name: "LEFT" },
    { r: 0, c: 1, name: "RIGHT" }
  ];

  for (let d of dirs) {
    let newRow = ghost.row + d.r;
    let newCol = ghost.col + d.c;

    if (newCol < 0) newCol = maze[0].length - 1;
    if (newCol >= maze[0].length) newCol = 0;

    if (maze[newRow][newCol] !== 1 && maze[newRow][newCol] !== 5) {
      let dist = abs(newRow - target.row) + abs(newCol - target.col); // Manhattan distance
      if (dist < minDist) {
        minDist = dist;
        bestDir = d;
      }
    }
  }

  if (bestDir) {
    ghost.row += bestDir.r;
    ghost.col += bestDir.c;
  }
}

// Rotation Angle
function getRotationAngle(dir) {
  if (dir === "UP") return -HALF_PI;
  if (dir === "DOWN") return HALF_PI;
  if (dir === "LEFT") return PI;
  return 0;
}

// Start Screen
function showStartScreen() {
  background(0);
  fill(255, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("PAC-MAN", width / 2, height / 2 - 40);
  textSize(20);
  fill(255);
  text("Click to Start", width / 2, height / 2 + 20);
}

// This shows the game over
function showGameOver() {
  background(0);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(20);
  fill(255);
  text("Click to Restart", width / 2, height / 2 + 20);
  AudioofMusic.pause();
  AudioofMusic.currentTime = 0;
  AudioofOver.play();
  setTimeout(() => {
    AudioofOver.pause();
  }, 2000);
  arrows = []; // Clear arrows
}

// Shows you won Level 1
function showlevel1Won() {
  background(0);
  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("YOU WIN!", width / 2, height / 2 - 40);
  textSize(20);
  fill(255);
  text("Click to Play Level 2", width / 2, height / 2  + 20);
  AudioofMusic.pause();
  AudioofMusic.currentTime = 0;
  AudioofWin.play();
  setTimeout(() => {
    AudioofWin.pause();
  }, 3000);
}

// Mischevious, devious, malicious traps
function traps() {
  if (maze[pacRow][pacCol] === 3) gameState = "over";
}

//Bang bang bang! Fires a bullet
function fireBullet() {
  bullet = {
    row: pacRow,
    col: pacCol,
    dir: direction,
    speed: 30, // 15x speed
    px: pacCol * titleSize,
    py: pacRow * titleSize
  }
  
}

// What controls the movement of the bullet
function moveAndDrawBullet() {
  if (!bullet) return; // <-- EARLY EXIT if no bullet (null or undefined)

  // Move bullet
  let dx = 0, dy = 0;
  if (bullet.dir === "UP") dy = -bullet.speed;
  else if (bullet.dir === "DOWN") dy = bullet.speed;
  else if (bullet.dir === "LEFT") dx = -bullet.speed;
  else if (bullet.dir === "RIGHT") dx = bullet.speed;

  bullet.px += dx;
  bullet.py += dy;

  let col = floor(bullet.px / titleSize);
  let row = floor(bullet.py / titleSize);

  // Bullet hits wall or out of bounds
  if (
    row < 0 || row >= maze.length ||
    col < 0 || col >= maze[0].length ||
    maze[row][col] === 1
  ) {
    bullet = null;
    return;  // return immediately here too
  } 


  // Check for ghost collision
  for (let ghost of ghosts) {
    if (ghost.row === row && ghost.col === col && !ghost.stunned) {
      ghost.stunned = true;
      ghost.stunTimer = 10;
      bullet = null;
      AudioofScream.play(); // Play scream sound when ghost is hit
      return; // return here so no further drawing or access after bullet null
    }
  }

  // Draw bullet
  push();
  fill(255, 0, 0);
  noStroke();
  translate(bullet.px + titleSize / 2, bullet.py + titleSize / 2);
  rotate(getRotationAngle(bullet.dir));
  arc(0, 0, titleSize / 2, titleSize / 4, 0, PI, PIE);
  pop();
}
//Level Drawing
function resetLevel() {
  if (levelWin == 0) {
    maze = [ // Level 1
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,3,2,2,2,2,2,1],
  [1,2,1,2,2,1,3,1,1,1,1,2,1,1,2,1,1,1,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,1,1,1,2,2,1,1,1,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1,1,1,1,2,1,2,2,2,2,2,2,2,2,1,2,1],
  [1,1,1,1,1,1,1,1,1,1,2,1,4,2,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [2,2,2,2,2,2,3,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [1,1,1,1,1,1,1,1,1,1,2,1,5,5,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,2,1,2,1],
  [1,2,1,2,2,2,2,1,2,1,1,1,2,2,1,1,1,2,1,2,2,2,2,1,2,1,2,1],
  [1,2,1,1,1,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,3,2,1,2,1,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    pacRow = 1;
    pacCol = 1;
    direction = "RIGHT";
    PacGun = false;
   guns = [];
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    if (maze[row][col] === 4) {
      guns.push({ row, col, img: gunImage[0] });
    }
  }
}
    ghosts = [
      { row: 1, col: 20, img: ghostImages[0], stunned: false, stunTimer: 0 },
      { row: 1, col: 26, img: ghostImages[1], stunned: false, stunTimer: 0 },
      { row: 15, col: 5, img: ghostImages[2], stunned: false, stunTimer: 0 },
      { row: 10, col: 20, img: ghostImages[3], stunned: false, stunTimer: 0 }
    ];
  } 
  else if (levelWin == 1) {
    maze = [ // Level 2
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,3,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1],
  [1,2,2,2,3,2,2,1,2,2,2,1,2,2,2,1,2,2,2,3,2,2,2,1,2,2,2,1],
  [1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
  [1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1],
  [1,2,2,2,1,2,2,2,1,2,2,2,2,3,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
  [1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,2,2,2,3,2,2,3,2,2,1,2,2,2,2,2,1,2,2,2,1],
  [1,2,2,2,3,2,2,2,2,3,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
  [1,2,3,2,3,2,2,3,2,3,2,2,2,3,3,3,2,3,2,3,2,3,3,2,3,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
    arrowsShooter = [];
    pacRow = 1;
    pacCol = 1;
    direction = "RIGHT";
    PacGun = false;
   guns = [];
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    if (maze[row][col] === 4) {
      guns.push({ row, col, img: gunImage[0] });
    } else if (maze[row][col] === 6) {
      arrowsShooter.push({ row, col, img: arrowsShooterImage, dir: "LEFT" });
      ArrowCol = col;
      ArrowRow = row; // sets the position of the arrow shooter
    }
  }
}
    ghosts = [
      { row: 1, col: 20, img: ghostImages[0], stunned: false, stunTimer: 0 },
      { row: 1, col: 26, img: ghostImages[1], stunned: false, stunTimer: 0 },
      { row: 15, col: 5, img: ghostImages[2], stunned: false, stunTimer: 0 },
      { row: 10, col: 20, img: ghostImages[3], stunned: false, stunTimer: 0 }
    ];
  }
  else if (levelWin == 2) {
    maze [ // Level 3 (Make sure to make t)
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,3,2,2,2,2,2,1],
      [1,2,1,1,1,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1,2,1],
      [1,2,2,2,3,2,2,1,2,2,2,1,2,2,2,1,2,2,2,3,2,2,2,1,2,2,2,1],
      [1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
      [1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1],
      [1,2,2,2,1,2,2,2,1,2,2,2,2,3,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
      [1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
      [1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,1,2,2,2,3,2,2,3,2,2,1,2,2,2,2,2,1,2,2,2,1],
      [1,2,2,2,3,2,2,2,2,3,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
      [1,2,3,2,3,2,2,3,2,3,2,2,2,3,3,3,2,3,2,3,2,3,3,2,3,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    arrowsShooter = [];
    pacRow = 1;
    pacCol = 1;
    direction = "RIGHT";
    PacGun = false;
   guns = [];
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    if (maze[row][col] === 4) {
      guns.push({ row, col, img: gunImage[0] });
    } else if (maze[row][col] === 6) {
      arrowsShooter.push({ row, col, img: arrowsShooterImage, dir: "LEFT" });
      ArrowCol = col;
      ArrowRow = row; // sets the position of the arrow shooter
    }
  }
}
    ghosts = [
      { row: 1, col: 20, img: ghostImages[0], stunned: false, stunTimer: 0 },
      { row: 1, col: 26, img: ghostImages[1], stunned: false, stunTimer: 0 },
      { row: 15, col: 5, img: ghostImages[2], stunned: false, stunTimer: 0 },
      { row: 10, col: 20, img: ghostImages[3], stunned: false, stunTimer: 0 }
    ];
     bullet = null;
  }
}
// Fires the dreaded arrow of death
function fireArrow(shooter) {
  let ax = shooter.col * titleSize;
  let ay = shooter.row * titleSize;
  arrows.push({
    row: shooter.row,
    col: shooter.col,
    ax,
    ay,
    direction: "LEFT",
    speed: 30 // Speed of the arrow
  });
}
// Moves the dreaded arrows of dread
function moveAndDrawArrows() {
  for (let i = arrows.length - 1; i >= 0; i--) {
    let arrow = arrows[i];

    if (arrow.direction === "LEFT") arrow.ax -= arrow.speed;
    else if (arrow.direction === "RIGHT") arrow.ax += arrow.speed;
    else if (arrow.direction === "UP") arrow.ay -= arrow.speed;
    else if (arrow.direction === "DOWN") arrow.ay += arrow.speed;

    // Remove if off-screen
    if (arrow.ax < 0 || arrow.ay < 0 || arrow.ax > width || arrow.ay > height) {
      arrows.splice(i, 1);
    } else {
      let arrowWidth = titleSize * 2;
      let arrowHeight = titleSize * 2;
      image(ArrowImg, arrow.ax + (titleSize - arrowWidth) / 2, arrow.ay + (titleSize - arrowHeight) / 2, arrowWidth, arrowHeight);
    }
    let arrowCol = Math.floor(arrow.ax / titleSize);
    let arrowRow = Math.floor(arrow.ay / titleSize);
    if (arrowCol === pacCol && arrowRow === pacRow) {
      gameState = "over"; // If arrow hits Pacman, game over
    }
  }
}
function getTargetTile(ghost) {
  if (ghost.name === "Blinky") {
    // Chase Pac-Man directly
    return { row: pacRow, col: pacCol };
  } else if (ghost.name === "Pinky") {
    // 4 tiles ahead of Pac-Man
    let offset = 4;
    let targetRow = pacRow;
    let targetCol = pacCol;
    if (direction === "UP") targetRow -= offset;
    else if (direction === "DOWN") targetRow += offset;
    else if (direction === "LEFT") targetCol -= offset;
    else if (direction === "RIGHT") targetCol += offset;

    // Clamp to bounds
    targetRow = constrain(targetRow, 0, maze.length - 1);
    targetCol = constrain(targetCol, 0, maze[0].length - 1);
    return { row: targetRow, col: targetCol };
  }
  // Default behavior
  return { row: pacRow, col: pacCol };
}
function moveGhostRandomly(ghost) {
  let dirs = [
    { r: -1, c: 0 }, // UP
    { r: 1, c: 0 },  // DOWN
    { r: 0, c: -1 }, // LEFT
    { r: 0, c: 1 }   // RIGHT
  ];

  let validMoves = [];

  for (let d of dirs) {
    let newRow = ghost.row + d.r;
    let newCol = ghost.col + d.c;

    if (newCol < 0) newCol = maze[0].length - 1;
    if (newCol >= maze[0].length) newCol = 0;

    if (maze[newRow][newCol] !== 1) {
      validMoves.push(d);
    }
  }

  if (validMoves.length > 0) {
    let move = random(validMoves);
    ghost.row += move.r;
    ghost.col += move.c;
  }
}
function calculateTitleSize() {
  // Leave a little margin (optional)
  let maxWidth = windowWidth * 0.98;
  let maxHeight = windowHeight * 0.98;
  let tileW = Math.floor(maxWidth / maze[0].length);
  let tileH = Math.floor(maxHeight / maze.length);
  // Pick the smaller so the whole maze fits
  return min(tileW, tileH, 43); // 43 is your max tile size for desktop
}
function windowResized() {
  titleSize = calculateTitleSize();
  resizeCanvas(maze[0].length * titleSize, maze.length * titleSize);
}
