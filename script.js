// Navigation to show/hide sections
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Show only the selected section
    document.querySelectorAll('.section').forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.add('active-section');
      } else {
        sec.classList.remove('active-section');
      }
    });
  });
});

// === COOKIE CLICKER ===
const cookieClickerHTML = `
  <button id="cookie-btn">Click me!</button>
  <p>Cookies: <span id="cookie-count">0</span></p>
  <button id="buy-cursor">Buy Cursor (Cost: <span id="cursor-cost">10</span>)</button>
  <p>Cursors Owned: <span id="cursor-count">0</span></p>
`;

const cookieContainer = document.getElementById('cookie-clicker-container');
cookieContainer.innerHTML = cookieClickerHTML;

let cookies = 0;
let cursors = 0;
let cursorCost = 10;

const cookieBtn = document.getElementById('cookie-btn');
const cookieCount = document.getElementById('cookie-count');
const buyCursorBtn = document.getElementById('buy-cursor');
const cursorCount = document.getElementById('cursor-count');
const cursorCostSpan = document.getElementById('cursor-cost');

cookieBtn.addEventListener('click', () => {
  cookies++;
  cookieCount.textContent = cookies;
});

buyCursorBtn.addEventListener('click', () => {
  if (cookies >= cursorCost) {
    cookies -= cursorCost;
    cursors++;
    cursorCost = Math.floor(cursorCost * 1.2);
    cursorCount.textContent = cursors;
    cursorCostSpan.textContent = cursorCost;
    cookieCount.textContent = cookies;
  }
});

setInterval(() => {
  cookies += cursors;
  cookieCount.textContent = cookies;
}, 1000);

// === HANGMAN ===
const hangmanHTML = `
  <h3>Select Category</h3>
  <select id="category-select">
    <option value="animals">Animals</option>
    <option value="fruits">Fruits</option>
    <option value="countries">Countries</option>
  </select>
  <button id="start-game-btn">Start Game</button>

  <div id="word-display" style="font-size: 24px; margin: 15px 0;"></div>
  <canvas id="hangman-canvas" width="400" height="400" style="border:1px solid #ff0000; background:#000;"></canvas>

  <div id="letters-container" style="margin-top: 15px;"></div>
  <p id="message" style="color: #ff0000; font-weight: bold;"></p>
`;

const hangmanContainer = document.getElementById('hangman-container');
hangmanContainer.innerHTML = hangmanHTML;

(function() {
  const words = {
    animals: ["elephant", "giraffe", "tiger", "dog", "cat"],
    fruits: ["apple", "banana", "cherry", "date", "fig"],
    countries: ["brazil", "canada", "france", "india", "japan"]
  };

  const categorySelect = document.getElementById('category-select');
  const startGameBtn = document.getElementById('start-game-btn');
  const wordDisplay = document.getElementById('word-display');
  const lettersContainer = document.getElementById('letters-container');
  const message = document.getElementById('message');
  const canvas = document.getElementById('hangman-canvas');
  const ctx = canvas.getContext('2d');

  let selectedWord = '';
  let guessedLetters = [];
  let wrongGuesses = 0;

  function drawHangman(wrongGuesses) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 5;

    // Base
    ctx.beginPath();
    ctx.moveTo(50, 350);
    ctx.lineTo(350, 350);
    ctx.stroke();

    // Pole
    ctx.beginPath();
    ctx.moveTo(100, 350);
    ctx.lineTo(100, 50);
    ctx.stroke();

    // Beam
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(250, 50);
    ctx.stroke();

    // Rope
    ctx.beginPath();
    ctx.moveTo(250, 50);
    ctx.lineTo(250, 100);
    ctx.stroke();

    if (wrongGuesses > 0) {
      // Head
      ctx.beginPath();
      ctx.arc(250, 130, 30, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (wrongGuesses > 1) {
      // Body
      ctx.beginPath();
      ctx.moveTo(250, 160);
      ctx.lineTo(250, 250);
      ctx.stroke();
    }
    if (wrongGuesses > 2) {
      // Left arm
      ctx.beginPath();
      ctx.moveTo(250, 180);
      ctx.lineTo(200, 220);
      ctx.stroke();
    }
    if (wrongGuesses > 3) {
      // Right arm
      ctx.beginPath();
      ctx.moveTo(250, 180);
      ctx.lineTo(300, 220);
      ctx.stroke();
    }
    if (wrongGuesses > 4) {
      // Left leg
      ctx.beginPath();
      ctx.moveTo(250, 250);
      ctx.lineTo(200, 300);
      ctx.stroke();
    }
    if (wrongGuesses > 5) {
      // Right leg
      ctx.beginPath();
      ctx.moveTo(250, 250);
      ctx.lineTo(300, 300);
      ctx.stroke();
    }
  }

  function updateWordDisplay() {
    let display = '';
    for (let char of selectedWord) {
      if (char === ' ') {
        display += '  ';
      } else if (guessedLetters.includes(char)) {
        display += char + ' ';
      } else {
        display += '_ ';
      }
    }
    wordDisplay.textContent = display.trim();
  }

  function createLetterButtons() {
    lettersContainer.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const button = document.createElement('button');
      button.textContent = letter;
      button.classList.add('letter-btn');
      button.style.margin = '3px';
      button.style.padding = '5px 8px';
      button.style.backgroundColor = '#000';
      button.style.color = '#ff0000';
      button.style.border = '1px solid #ff0000';
      button.style.cursor = 'pointer';
      button.addEventListener('click', () => {
        handleGuess(letter.toLowerCase());
        button.disabled = true;
      });
      lettersContainer.appendChild(button);
    }
  }

  function handleGuess(letter) {
    if (selectedWord.includes(letter)) {
      guessedLetters.push(letter);
      updateWordDisplay();
      checkWin();
    } else {
      wrongGuesses++;
      drawHangman(wrongGuesses);
      if (wrongGuesses >= 6) {
        message.textContent = `Game Over! The word was "${selectedWord}"`;
        disableAllButtons();
      }
    }
  }

  function checkWin() {
    let won = true;
    for (let char of selectedWord) {
      if (char !== ' ' && !guessedLetters.includes(char)) {
        won = false;
        break;
      }
    }
    if (won) {
      message.textContent = 'You won!';
      disableAllButtons();
    }
  }

  function disableAllButtons() {
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
  }

  startGameBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    selectedWord = words[category][Math.floor(Math.random() * words[category].length)];
    guessedLetters = [];
    wrongGuesses = 0;
    message.textContent = '';
    updateWordDisplay();
    createLetterButtons();
    drawHangman(wrongGuesses);
  });
})();

// === PONG ===
const DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

const rounds = [5, 5, 3, 3, 2];
const colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];

const Ball = {
  new: function (incrementedSpeed) {
    return {
      width: 18,
      height: 18,
      x: 0,
      y: 0,
      moveX: DIRECTION.IDLE,
      moveY: DIRECTION.IDLE,
      speed: 6 + incrementedSpeed,
      _incrementedSpeed: incrementedSpeed,
      ctx: null,
      canvas: null,

      reset: function () {
        this.x = (this.canvas.width / 2) - (this.width / 2);
        this.y = (this.canvas.height / 2) - (this.height / 2);
        this.moveY = DIRECTION.IDLE;
        this.moveX = DIRECTION.IDLE;
        this.speed = 6 + this._incrementedSpeed;
      },

      update: function (paddle1, paddle2, game) {
        this.x += (this.moveX === DIRECTION.LEFT) ? -this.speed : (this.moveX === DIRECTION.RIGHT) ? this.speed : 0;
        this.y += (this.moveY === DIRECTION.UP) ? -this.speed : (this.moveY === DIRECTION.DOWN) ? this.speed : 0;

        if (this.y <= 0) {
          this.moveY = DIRECTION.DOWN;
        }

        if (this.y + this.height >= this.canvas.height) {
          this.moveY = DIRECTION.UP;
        }

        if (this.x <= 0) {
          game.player2.score++;
          game.scoreElem2.textContent = game.player2.score;
          this.reset();
          game.checkScore();
        }

        if (this.x + this.width >= this.canvas.width) {
          game.player1.score++;
          game.scoreElem1.textContent = game.player1.score;
          this.reset();
          game.checkScore();
        }

        if (this.collide(paddle1)) {
          this.moveX = DIRECTION.RIGHT;
          const collidePoint = (this.y + this.height / 2) - (paddle1.y + paddle1.height / 2);
          const collideNorm = collidePoint / (paddle1.height / 2);
          const bounceAngle = collideNorm * Math.PI / 4;
          this.speed += 0.1;

          this.moveY = (bounceAngle < 0) ? DIRECTION.UP : DIRECTION.DOWN;
        }

        if (this.collide(paddle2)) {
          this.moveX = DIRECTION.LEFT;
          const collidePoint = (this.y + this.height / 2) - (paddle2.y + paddle2.height / 2);
          const collideNorm = collidePoint / (paddle2.height / 2);
          const bounceAngle = collideNorm * Math.PI / 4;
          this.speed += 0.1;

          this.moveY = (bounceAngle < 0) ? DIRECTION.UP : DIRECTION.DOWN;
        }
      },

      collide: function (paddle) {
        return this.x < paddle.x + paddle.width &&
               this.x + this.width > paddle.x &&
               this.y < paddle.y + paddle.height &&
               this.y + this.height > paddle.y;
      },

      render: function () {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };
  }
};

const Paddle = {
  new: function (x, y, width, height, canvas) {
    return {
      x,
      y,
      width,
      height,
      score: 0,
      speed: 8,
      move: DIRECTION.IDLE,
      ctx: null,
      canvas,

      update: function () {
        if (this.move === DIRECTION.UP && this.y > 0) {
          this.y -= this.speed;
        } else if (this.move === DIRECTION.DOWN && this.y + this.height < this.canvas.height) {
          this.y += this.speed;
        }
      },

      render: function () {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };
  }
};

const Game = {
  new: function (canvas, scoreElem1, scoreElem2) {
    return {
      canvas,
      ctx: canvas.getContext('2d'),
      player1: null,
      player2: null,
      ball: null,
      scoreElem1,
      scoreElem2,
      isRunning: false,

      init: function () {
        this.player1 = Paddle.new(10, (this.canvas.height / 2) - 50, 15, 100, this.canvas);
        this.player2 = Paddle.new(this.canvas.width - 25, (this.canvas.height / 2) - 50, 15, 100, this.canvas);

        this.player1.ctx = this.ctx;
        this.player2.ctx = this.ctx;

        this.ball = Ball.new(0);
        this.ball.ctx = this.ctx;
        this.ball.canvas = this.canvas;

        this.player1.score = 0;
        this.player2.score = 0;

        this.scoreElem1.textContent = '0';
        this.scoreElem2.textContent = '0';

        this.isRunning = true;

        this.ball.reset();

        this.start();
      },

      start: function () {
        if (!this.isRunning) return;
        this.update();
        this.render();
        requestAnimationFrame(this.start.bind(this));
      },

      update: function () {
        this.player1.update();
        this.player2.update();
        this.ball.update(this.player1, this.player2, this);
      },

      render: function () {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();

        this.player1.render();
        this.player2.render();
        this.ball.render();
      },

      checkScore: function () {
        if (this.player1.score >= 5) {
          alert('Player 1 Wins!');
          this.isRunning = false;
          this.init();
        }
        if (this.player2.score >= 5) {
          alert('Player 2 Wins!');
          this.isRunning = false;
          this.init();
        }
      }
    };
  }
};

// Setup Pong game inside pong-container
(function () {
  const pongContainer = document.getElementById('pong-container');
  pongContainer.innerHTML = `
    <canvas id="pong-canvas" width="600" height="400" style="border:1px solid #ff0000; background:#000;"></canvas>
    <div style="color:#ff0000; display:flex; justify-content:space-between; margin-top:10px; font-size:18px;">
      <div>Player 1 Score: <span id="score1">0</span></div>
      <div>Player 2 Score: <span id="score2">0</span></div>
    </div>
    <p style="color:#ff0000; margin-top:10px;">Controls: Player 1 (W/S), Player 2 (Arrow Up/Arrow Down)</p>
  `;

  const canvas = document.getElementById('pong-canvas');
  const score1 = document.getElementById('score1');
  const score2 = document.getElementById('score2');

  const game = Game.new(canvas, score1, score2);
  game.init();

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'w':
      case 'W':
        game.player1.move = DIRECTION.UP;
        break;
      case 's':
      case 'S':
        game.player1.move = DIRECTION.DOWN;
        break;
      case 'ArrowUp':
        game.player2.move = DIRECTION.UP;
        break;
      case 'ArrowDown':
        game.player2.move = DIRECTION.DOWN;
        break;
    }
  });

  document.addEventListener('keyup', e => {
    switch (e.key) {
      case 'w':
      case 'W':
        if (game.player1.move === DIRECTION.UP) game.player1.move = DIRECTION.IDLE;
        break;
      case 's':
      case 'S':
        if (game.player1.move === DIRECTION.DOWN) game.player1.move = DIRECTION.IDLE;
        break;
      case 'ArrowUp':
        if (game.player2.move === DIRECTION.UP) game.player2.move = DIRECTION.IDLE;
        break;
      case 'ArrowDown':
        if (game.player2.move === DIRECTION.DOWN) game.player2.move = DIRECTION.IDLE;
        break;
    }
  });
})();
