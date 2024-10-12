const grid = document.querySelector('#game');
const scoreDisplay = document.querySelector('#score');
let score = 0;
const width = 10;
let squares = [];

// Create the grid
function createGrid() {
  for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    square.classList.add('cell');
    grid.appendChild(square);
    squares.push(square);
  }
  
  // Create "invisible" bottom row (to detect when pieces hit the bottom)
  for (let i = 0; i < 10; i++) {
    const square = document.createElement('div');
    square.classList.add('bottom');
    grid.appendChild(square);
    squares.push(square);  // These extra squares will prevent tetrominos from falling out of the grid
  }
}

createGrid();

// The Tetrominoes shapes
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1]
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
let currentRotation = 0;

// Randomly select a Tetromino and its rotation
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

// Draw the Tetromino
function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('active');
  });
}

// Undraw the Tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('active');
  });
}

// Move Tetromino down
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Freeze the Tetromino
function freeze() {
  if (current.some(index => squares[currentPosition + index + width].classList.contains('filled') || 
    squares[currentPosition + index + width].classList.contains('bottom'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('filled'));
    // Start a new Tetromino falling
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    addScore();
    gameOver();
  }
}

// Move Tetromino left
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
  if (!isAtLeftEdge) currentPosition -= 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('filled'))) {
    currentPosition += 1;
  }
  draw();
}

// Move Tetromino right
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
  if (!isAtRightEdge) currentPosition += 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('filled'))) {
    currentPosition -= 1;
  }
  draw();
}

// Rotate the Tetromino
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  draw();
}

// Show score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
    if (row.every(index => squares[index].classList.contains('filled'))) {
      score += 10;
      scoreDisplay.innerHTML = 'Score: ' + score;
      row.forEach(index => {
        squares[index].classList.remove('filled');
        squares[index].classList.remove('active');
      });
      const removedSquares = squares.splice(i, width);
      squares = removedSquares.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
}

// Game over
function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains('filled'))) {
    scoreDisplay.innerHTML = 'Game Over! Final Score: ' + score;
    clearInterval(timerId);
  }
}

// Controls
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

document.addEventListener('keydown', control);

// Initial draw of the Tetromino
draw();

// Set timer for automatic moving down
let timerId = setInterval(moveDown, 1000);


