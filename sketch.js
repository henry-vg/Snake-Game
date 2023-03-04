let cellSize,
  bodySize,
  foodSize,
  snake = [],
  direction = 'RIGHT',
  canMove = true,
  food = new foodObject(undefined, undefined, undefined),
  points = 0,
  isGamePaused = false,
  isGameOver = false;

const numCellsX = 30,
  numCellsY = 20,
  snakeInitialLength = 3,
  snakeInitialPosition = [3, 3],
  grid = true,
  walls = true,
  speed = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cellSize = ((width / height) / (numCellsX / numCellsY) > 1) ? (3 / 4) * height / numCellsY : (3 / 4) * width / numCellsX;
  bodySize = cellSize * 0.7;
  foodSize = cellSize * 0.6;

  textAlign(CENTER);

  frameRate(speed);

  createBody(snakeInitialLength);

  food.randomize();
}

function draw() {
  background(0);

  translate((width - (numCellsX * cellSize)) / 2, (height - (numCellsY * cellSize)) / 2);

  drawField();

  moveSnake();

  drawSnake();

  food.show();

  drawPoints();

  if (isGameOver) {
    gameOver();
  }
  else if (isGamePaused) {
    gamePaused();
  }
}

function drawField() {
  strokeWeight(2);
  noFill();

  if (grid) {
    stroke(50);

    for (let i = 1; i < numCellsY; i++) //horizontals
    {
      line(0, i * cellSize, numCellsX * cellSize, i * cellSize);
    }

    for (let i = 1; i < numCellsX; i++) //horizontals
    {
      line(i * cellSize, 0, i * cellSize, numCellsY * cellSize);
    }
  }
  if (walls) {
    stroke(255);
  }
  rect(0, 0, numCellsX * cellSize, numCellsY * cellSize);
}

function bodyObject(x, y, c) {
  this.x = x;
  this.y = y;
  this.c = c;
  this.show = function () {
    stroke(255 - this.c[0], 255 - this.c[1], 255 - this.c[2]);
    strokeWeight(bodySize / 14);
    fill(this.c[0], this.c[1], this.c[2]);
    rect(this.x * cellSize + (cellSize - bodySize) / 2, this.y * cellSize + (cellSize - bodySize) / 2, bodySize, bodySize);
    //circle(cellSize * (this.x + 0.5), cellSize * (this.y + 0.5), bodySize);
  }
}

function foodObject(x, y, c) {
  this.x = x;
  this.y = y;
  this.c = c;
  this.show = function () {
    stroke(255 - this.c[0], 255 - this.c[1], 255 - this.c[2]);
    strokeWeight(foodSize / 14);
    fill(this.c[0], this.c[1], this.c[2]);
    //rect(this.x * cellSize + (cellSize - foodSize) / 2, this.y * cellSize + (cellSize - foodSize) / 2, foodSize, foodSize);
    circle(cellSize * (this.x + 0.5), cellSize * (this.y + 0.5), foodSize);
  }
  this.randomize = function () {
    this.c = [random(255), random(255), random(255)];

    let again = true,
      newX,
      newY;
    while (again) {
      again = false;
      newX = floor(random(numCellsX));
      newY = floor(random(numCellsY));

      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          again = true;
          break;
        }
      }
    }
    this.x = newX;
    this.y = newY;
  }
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    snake[i].show();
  }
}

function createBody(n) {
  if (snake.length == 0) {
    snake.push(new bodyObject(snakeInitialPosition[0], snakeInitialPosition[1], [random(255), random(255), random(255)]));
    n--;
  }
  for (let i = 0; i < n; i++) {
    snake.push(new bodyObject(snake[snake.length - 1].x, snake[snake.length - 1].y, [random(255), random(255), random(255)]));
  }
}

function moveSnake() {
  let headX = snake[0].x,
    headY = snake[0].y;

  switch (direction) {
    case 'RIGHT':
      headX++;
      break;
    case 'LEFT':
      headX--;
      break;
    case 'UP':
      headY--;
      break;
    case 'DOWN':
      headY++;
      break;
  }

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  if (walls) {
    if (headX < 0 || headX > numCellsX - 1 || headY < 0 || headY > numCellsY - 1) //walls collision
    {
      isGameOver = true;
    }
  }
  else {
    //non-walls collision
    if (headX < 0) {
      headX = numCellsX - 1;
    }
    else if (headX > numCellsX - 1) {
      headX = 0;
    }
    else if (headY < 0) {
      headY = numCellsY - 1
    }
    else if (headY > numCellsY - 1) {
      headY = 0;
    }
  }

  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x == headX && snake[i].y == headY) {
      isGameOver = true;
      break;
    }
  }

  if (!isGameOver) {
    snake[0].x = headX;
    snake[0].y = headY;

    if (snake[0].x == food.x && snake[0].y == food.y) //food collision
    {
      food.randomize();
      createBody(1);
      points += 10 + floor(points * 0.1);
    }

    canMove = true;
  }
}

function drawPoints() {
  textSize(height * (28 / 937));
  noStroke();
  fill(255);
  text(`Points: ${points}`, (numCellsX * cellSize) / 2, -(height - (numCellsY * cellSize)) / 4 + textAscent() / 2);
}

function gameOver() {
  noLoop();

  noStroke();
  fill(0, 185);
  rect(-(width - (numCellsX * cellSize)) / 2, -(height - (numCellsY * cellSize)) / 2, width, height);

  textSize(height * (56 / 937));
  fill(255);
  text('GAME OVER!', (numCellsX * cellSize) / 2, (numCellsY * cellSize) / 2 - textAscent() / 2);

  textSize(height * (28 / 937));
  text(`You scored ${points} points.\nPress space to retry.`, (numCellsX * cellSize) / 2, (numCellsY * cellSize) / 2 + textAscent());
}

function gamePaused() {
  noLoop();
  noStroke();
  fill(0, 185);
  rect(-(width - (numCellsX * cellSize)) / 2, -(height - (numCellsY * cellSize)) / 2, width, height);

  textSize(height * (56 / 937));
  fill(255);
  text('GAME PAUSED!', (numCellsX * cellSize) / 2, (numCellsY * cellSize) / 2 - textAscent() / 2);

  textSize(height * (28 / 937));
  text(`Press P to continue.`, (numCellsX * cellSize) / 2, (numCellsY * cellSize) / 2 + textAscent());
}

function keyPressed() {
  if (canMove) {
    if ((keyCode === RIGHT_ARROW || keyCode == 68) && direction != 'LEFT' && direction != 'RIGHT') {
      direction = 'RIGHT';
      canMove = false;
    }
    else if ((keyCode === LEFT_ARROW || keyCode == 65) && direction != 'RIGHT' && direction != 'LEFT') {
      direction = 'LEFT';
      canMove = false;
    }
    else if ((keyCode === UP_ARROW || keyCode == 87) && direction != 'DOWN' && direction != 'UP') {
      direction = 'UP';
      canMove = false;
    }
    else if ((keyCode === DOWN_ARROW || keyCode == 83) && direction != 'UP' && direction != 'DOWN') {
      direction = 'DOWN';
      canMove = false;
    }
  }
  if (keyCode == 32 && isGameOver) //space
  {
    snake = [];
    points = 0;
    direction = 'RIGHT';
    canMove = true;
    isGameOver = false;

    createBody(snakeInitialLength);

    food.randomize();

    loop();
  }
  else if (keyCode == 80) //p
  {
    isGamePaused = !isGamePaused;
    if (!isGamePaused) {
      loop();
    }
  }
}