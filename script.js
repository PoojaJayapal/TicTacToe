let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = false;
let player1Name = '', player2Name = '';
let isAI = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const statusDiv = document.getElementById('status');
const popupDiv = document.getElementById('popup');
const gameDiv = document.getElementById('game');
const opponentSelect = document.getElementById('opponent');
const playerInputs = document.getElementById('playerInputs');
const player2Input = document.getElementById('player2');

opponentSelect.addEventListener('change', function() {
  isAI = this.value === 'ai';
  playerInputs.style.display = 'block';
  player2Input.style.display = isAI ? 'none' : 'block';
});

function startGame() {
  board.fill('');
  currentPlayer = 'X';
  gameActive = true;
  initializeBoard();

  player1Name = document.getElementById('player1').value || 'Player 1';
  player2Name = isAI ? 'AI' : (document.getElementById('player2').value || 'Player 2');

  statusDiv.innerText = `${player1Name} (X) vs ${player2Name} (O)`;
  popupDiv.style.display = 'none';
  gameDiv.style.display = 'block';

  if (isAI && currentPlayer === 'O') {
    setTimeout(makeAIMove, 500);
  }
}

function initializeBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  boardDiv.style.gridTemplateColumns = `repeat(3, 1fr)`;

  board.forEach((_, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.onclick = () => handleClick(i);
    boardDiv.appendChild(cell);
  });
}

function handleClick(index) {
  if (!gameActive || board[index]) return;
  
  board[index] = currentPlayer;
  updateBoard();
  if (checkResult()) return;
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  
  if (isAI && currentPlayer === 'O') {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  if (!gameActive) return;

  let moveIndex = bestMove();
  board[moveIndex] = 'O';
  updateBoard();
  checkResult();
  currentPlayer = 'X';
}

function bestMove() {
  for (let [a, b, c] of winningCombinations) {
    if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
    if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
    if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
  }

  for (let [a, b, c] of winningCombinations) {
    if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
    if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
    if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
  }

  const emptyCells = board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function updateBoard() {
  const boardDiv = document.getElementById('board');
  board.forEach((mark, i) => boardDiv.children[i].innerText = mark);
}

function checkResult() {
  for (let [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      let winner = board[a] === 'X' ? player1Name : player2Name;
      statusDiv.innerText = `${winner} Wins! 🎉`;
      askToContinue();
      return true;
    }
  }

  if (!board.includes('')) {
    statusDiv.innerText = "It's a Draw! 🤝";
    gameActive = false;
    askToContinue();
    return true;
  }

  return false;
}

function askToContinue() {
  setTimeout(() => {
    if (confirm("Do you want to play again?")) {
      resetGame();
    } else {
      popupDiv.style.display = 'flex';
      gameDiv.style.display = 'none';
    }
  }, 500);
}

function resetGame() {
  gameActive = true;
  board.fill('');
  currentPlayer = 'X';
  statusDiv.innerText = '';
  initializeBoard();
}
