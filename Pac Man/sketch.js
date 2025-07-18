let maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,3,2,2,2,2,2,1],
  [1,2,1,2,2,1,3,1,1,1,1,2,1,1,2,1,1,1,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,1,1,1,2,2,1,1,1,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,1,2,2,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,2,2,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1,1,1,1,2,1,2,2,2,2,2,2,2,2,1,2,1],
  [1,1,1,1,1,1,1,1,1,1,2,1,2,2,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [2,2,2,2,2,2,3,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [1,1,1,1,1,1,1,1,1,1,2,1,2,2,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,2,1,2,1],
  [1,2,1,2,2,2,2,1,2,1,1,1,2,2,1,1,1,2,1,2,2,2,2,1,2,1,2,1],
  [1,2,1,1,1,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,3,2,1,2,1,2,1,1,1,1,2,1,2,1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,2,3,2,2,4,2,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacRow = 1;
let pacCol = 1;
let bullet = null;
let direction = "RIGHT";
let titleSize = 20;
let gameState = "start";
let gunImage = [];
let guns = [
  {row: 16, col: 10, img: null}
];
let ghostImages = [];
let ghosts = [
  { row: 1, col: 20, img: null, stunned: false, stunTimer: 0 },
  { row: 1, col: 26, img: null, stunned: false, stunTimer: 0 },
  { row: 15, col: 5, img: null, stunned: false, stunTimer: 0 },
  { row: 10, col: 20, img: null, stunned: false, stunTimer: 0 }
];
let PacGun = false;

function preload() {
  for (let i = 0; i < 1; i++) {
    gunImage.push(loadImage(`gun/gun.png`));
  }
  for (let i = 1; i <= 4; i++) {
    ghostImages.push(loadImage(`Images/ghost${i}.png`));
  }
}

function setup() {
  createCanvas(maze[0].length * titleSize, maze.length * titleSize);
  frameRate(10);
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].img = ghostImages[i];
  }
  for (let i = 0; i < guns.length; i++) {
    guns[i].img = gunImage[i];
  }
}

function draw() {
  background(0);
  if (gameState === "start") return showStartScreen();
  if (gameState === "won") return showGameWon();
  if (gameState === "over") return showGameOver();
  if (gameState === "paused") return GamePaused();
  drawMazeAndDots();

  if (frameCount % 5 === 0) {
    movePacman();
    for (let ghost of ghosts) moveGhost(ghost);
  }

  drawPacman();
  drawGhosts();
  traps();

  if (bullet !== null) {
    moveAndDrawBullet();
  }
}

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
        }
      }
    }
  }
  if (maze[pacRow][pacCol] === 2) maze[pacRow][pacCol] = 0;
  if (dotsLeft === 0) gameState = "won";
}

function drawPacman() {
  fill(255, 255, 0);
  let x = pacCol * titleSize + titleSize / 2;
  let y = pacRow * titleSize + titleSize / 2;
  push();
  translate(x, y);
  rotate(getRotationAngle(direction));
  arc(0, 0, 18, 18, radians(45), radians(315), PIE);
  pop();
}

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

function drawGun() {
  for (let i = guns.length - 1; i >= 0; i--) {
    let gun = guns[i];
    image(gun.img, gun.col * titleSize, gun.row * titleSize, titleSize, titleSize);
    if (gun.row === pacRow && gun.col === pacCol) {
      guns.splice(i, 1);
      PacGun = true;  // fixed assignment here
    }
  }
}

function movePacman() {
  let nextRow = pacRow;
  let nextCol = pacCol;
  if (direction === "UP") nextRow--;
  else if (direction === "DOWN") nextRow++;
  else if (direction === "LEFT") nextCol--;
  else if (direction === "RIGHT") nextCol++;

  if (nextCol < 0) nextCol = maze[0].length - 1;
  if (nextCol >= maze[0].length) nextCol = 0;

  if (maze[nextRow][nextCol] !== 1) {
    pacRow = nextRow;
    pacCol = nextCol;
  }
}

function keyPressed() {
  if (gameState !== "playing") return;
  if (keyCode === UP_ARROW && direction !== "DOWN") direction = "UP";
  else if (keyCode === DOWN_ARROW) direction = "DOWN";// changes the direction pacman is facing to up
  else if (keyCode === LEFT_ARROW) direction = "LEFT";// changes the direction pacman is facing to left
  else if (keyCode === RIGHT_ARROW) direction = "RIGHT";// changes the direction pacman is facing to right
  else if (keyCode === 32 && bullet === null && PacGun) {
    fireBullet();
  }// shoots a bullet
}

function mousePressed() {
  if (gameState === "start") gameState = "playing"; 
}

function moveGhost(ghost) {
  if (ghost.stunned) {
    ghost.stunTimer--;
    if (ghost.stunTimer <= 0) {
      ghost.stunned = false;
    }
    return;
  }

  let dirs = [ { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 } ];
  for (let i = 0; i < 10; i++) {
    let d = random(dirs);
    let newRow = ghost.row + d.r;
    let newCol = ghost.col + d.c;
    if (newCol < 0) newCol = maze[0].length - 1;
    if (newCol >= maze[0].length) newCol = 0;
    if (maze[newRow][newCol] !== 1) {
      ghost.row = newRow;
      ghost.col = newCol;
      break;
    }
  }
}

function getRotationAngle(dir) {
  if (dir === "UP") return -HALF_PI;
  if (dir === "DOWN") return HALF_PI;
  if (dir === "LEFT") return PI;
  return 0;
}

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

function showGameOver() {
  background(0);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2);
}

function showGameWon() {
  background(0);
  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("YOU WIN!", width / 2, height / 2);
}

function traps() {
  if (maze[pacRow][pacCol] === 3) gameState = "over";
}

function fireBullet() {
  bullet = {
    row: pacRow,
    col: pacCol,
    dir: direction,
    speed: 15, // 15x speed
    px: pacCol * titleSize,
    py: pacRow * titleSize
  }
  
}

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
      return; // return here so no further drawing or access after bullet null
    }
  }

  // Draw bullet
  push();
  fill(255, 0, 0);
  noStroke();
  translate(bullet.px + titleSize / 2, bullet.py + titleSize / 2);
  rotate(getRotationAngle(bullet.dir));
  arc(0, 0, 12, 6, 0, PI, PIE);
  pop();
}
function GamePaused() {
  background(0);
  fill(255, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("Game Paused", width / 2, height / 2 - 40);
  textSize(20);
  fill(255);
  text("press esc to continue game", width / 2, height / 2 + 20);
}


