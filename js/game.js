// ===== GAME STATE =====
const Game = {
  size: 3,
  tiles: [],
  emptyIndex: 0,
  moves: 0,
  seconds: 0,
  timer: null,
  imageId: 'sunset',
  imageCanvas: null,
  solved: false,
  settings: {},

  init(size, imageId) {
    this.size = size;
    this.imageId = imageId;
    this.moves = 0;
    this.seconds = 0;
    this.solved = false;
    clearInterval(this.timer);

    // Load settings
    this.settings = Settings.load();

    // Generate solved state
    const total = size * size;
    this.tiles = Array.from({ length: total }, (_, i) => i);
    this.emptyIndex = total - 1;

    // Render the source image
    this.renderSourceImage();

    // Shuffle
    this.shuffle();

    // Render board
    this.render();
    this.renderPreview();
    this.renderFullPreview();

    // Start timer
    this.startTimer();

    // Update stats
    this.updateStats();
  },

  renderSourceImage() {
    const imgDef = PUZZLE_IMAGES.find(img => img.id === this.imageId);
    if (!imgDef) return;
    const size = 600;
    this.imageCanvas = document.createElement('canvas');
    this.imageCanvas.width = size;
    this.imageCanvas.height = size;
    const ctx = this.imageCanvas.getContext('2d');
    imgDef.draw(ctx, size, size);
  },

  renderPreview() {
    const canvas = document.getElementById('previewCanvas');
    if (!canvas || !this.imageCanvas) return;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.imageCanvas, 0, 0, canvas.width, canvas.height);
  },

  renderFullPreview() {
    const canvas = document.getElementById('fullPreviewCanvas');
    if (!canvas || !this.imageCanvas) return;
    const size = Math.min(400, window.innerWidth * 0.85);
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.imageCanvas, 0, 0, size, size);
  },

  shuffle() {
    const total = this.size * this.size;
    // Fisher-Yates shuffle then fix parity
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
    this.emptyIndex = this.tiles.indexOf(total - 1);

    // Ensure solvable
    if (!this.isSolvable()) {
      // Swap first two non-empty tiles to fix parity
      if (this.tiles[0] !== total - 1 && this.tiles[1] !== total - 1) {
        [this.tiles[0], this.tiles[1]] = [this.tiles[1], this.tiles[0]];
      } else {
        [this.tiles[2], this.tiles[3]] = [this.tiles[3], this.tiles[2]];
      }
    }

    // Make sure it's not already solved
    let isSolved = true;
    for (let i = 0; i < total; i++) {
      if (this.tiles[i] !== i) { isSolved = false; break; }
    }
    if (isSolved) this.shuffle();
  },

  isSolvable() {
    const size = this.size;
    const total = size * size;
    let inversions = 0;
    const flat = this.tiles.filter(t => t !== total - 1);
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        if (flat[i] > flat[j]) inversions++;
      }
    }
    if (size % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const emptyRow = Math.floor(this.emptyIndex / size);
      const fromBottom = size - emptyRow;
      return (fromBottom % 2 === 1) === (inversions % 2 === 0);
    }
  },

  render() {
    const board = document.getElementById('puzzleBoard');
    if (!board) return;
    const size = this.size;
    const total = size * size;
    const boardSize = Math.min(window.innerWidth * 0.92, 480);
    const tileSize = Math.floor((boardSize - 12 - (size - 1) * 3) / size);

    board.style.gridTemplateColumns = `repeat(${size}, ${tileSize}px)`;
    board.innerHTML = '';

    this.tiles.forEach((tileVal, idx) => {
      const tile = document.createElement('div');
      tile.className = 'puzzle-tile' + (tileVal === total - 1 ? ' empty' : '');
      tile.style.width = tileSize + 'px';
      tile.style.height = tileSize + 'px';
      tile.dataset.index = idx;

      if (tileVal !== total - 1 && this.imageCanvas) {
        const c = document.createElement('canvas');
        c.width = tileSize; c.height = tileSize;
        const ctx = c.getContext('2d');
        const col = tileVal % size;
        const row = Math.floor(tileVal / size);
        const srcSize = this.imageCanvas.width;
        const srcTile = srcSize / size;
        ctx.drawImage(
          this.imageCanvas,
          col * srcTile, row * srcTile, srcTile, srcTile,
          0, 0, tileSize, tileSize
        );
        tile.appendChild(c);

        if (this.settings.showNumbers) {
          const num = document.createElement('div');
          num.className = 'tile-number';
          num.textContent = tileVal + 1;
          tile.appendChild(num);
        }
      }

      tile.addEventListener('click', () => this.clickTile(idx));
      board.appendChild(tile);
    });
  },

  clickTile(idx) {
    if (this.solved) return;
    const size = this.size;
    const emptyIdx = this.emptyIndex;

    // Check adjacency
    const col = idx % size, row = Math.floor(idx / size);
    const ecol = emptyIdx % size, erow = Math.floor(emptyIdx / size);
    const adjacent =
      (Math.abs(col - ecol) === 1 && row === erow) ||
      (Math.abs(row - erow) === 1 && col === ecol);

    if (!adjacent) return;

    // Swap
    [this.tiles[idx], this.tiles[emptyIdx]] = [this.tiles[emptyIdx], this.tiles[idx]];
    this.emptyIndex = idx;
    this.moves++;

    // Play sound
    if (this.settings.sound) this.playClick();

    // Animation
    if (this.settings.animation) {
      const board = document.getElementById('puzzleBoard');
      const tileEl = board.children[emptyIdx]; // the moved tile is now at old emptyIndex
      if (tileEl) {
        tileEl.classList.add('just-moved');
        setTimeout(() => tileEl.classList.remove('just-moved'), 200);
      }
    }

    this.render();
    this.updateStats();
    this.removeHint();

    // Check win
    if (this.checkWin()) {
      this.onWin();
    }
  },

  checkWin() {
    const total = this.size * this.size;
    return this.tiles.every((t, i) => t === i);
  },

  onWin() {
    this.solved = true;
    clearInterval(this.timer);
    const score = this.calcScore();

    // Update win screen
    document.getElementById('winTime').textContent = this.formatTime(this.seconds);
    document.getElementById('winMoves').textContent = this.moves;
    document.getElementById('winScore').textContent = score;
    document.getElementById('winRating').textContent = this.getRating(score);

    // Confetti
    this.showConfetti();

    setTimeout(() => showScreen('screen-win'), 800);
  },

  calcScore() {
    const size = this.size;
    const base = size === 3 ? 1000 : size === 4 ? 3000 : 6000;
    const timePenalty = Math.min(this.seconds * 2, base * 0.7);
    const movePenalty = Math.min(this.moves * 3, base * 0.5);
    return Math.max(100, Math.round(base - timePenalty - movePenalty));
  },

  getRating(score) {
    const size = this.size;
    const thresholds = size === 3 ? [700, 400] : size === 4 ? [2000, 1200] : [4000, 2500];
    if (score >= thresholds[0]) return '⭐⭐⭐';
    if (score >= thresholds[1]) return '⭐⭐';
    return '⭐';
  },

  formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  },

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.seconds++;
      this.updateStats();
    }, 1000);
  },

  updateStats() {
    const timerEl = document.getElementById('timer');
    const movesEl = document.getElementById('moveCount');
    const scoreEl = document.getElementById('scoreDisplay');
    if (timerEl) timerEl.textContent = this.formatTime(this.seconds);
    if (movesEl) movesEl.textContent = this.moves;
    if (scoreEl) scoreEl.textContent = this.calcScore();
  },

  playClick() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 400 + Math.random() * 200;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  },

  playWin() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      });
    } catch(e) {}
  },

  showConfetti() {
    if (this.settings.sound) this.playWin();
    const colors = ['#6c63ff','#ff6584','#43e97b','#f9ca24','#00cec9','#fd79a8'];
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        piece.style.width = (8 + Math.random() * 8) + 'px';
        piece.style.height = piece.style.width;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 3500);
      }, Math.random() * 800);
    }
  },

  removeHint() {
    document.querySelectorAll('.puzzle-tile.hint').forEach(t => t.classList.remove('hint'));
  },

  hint() {
    this.removeHint();
    const board = document.getElementById('puzzleBoard');
    if (!board) return;
    const size = this.size;
    const emptyIdx = this.emptyIndex;
    const ecol = emptyIdx % size, erow = Math.floor(emptyIdx / size);

    // Find adjacent moveable tiles
    const moves = [];
    if (ecol > 0) moves.push(emptyIdx - 1);
    if (ecol < size - 1) moves.push(emptyIdx + 1);
    if (erow > 0) moves.push(emptyIdx - size);
    if (erow < size - 1) moves.push(emptyIdx + size);

    // Highlight the one closest to correct position
    let best = null, bestDist = Infinity;
    moves.forEach(idx => {
      const tileVal = this.tiles[idx];
      const targetCol = tileVal % size, targetRow = Math.floor(tileVal / size);
      const curCol = idx % size, curRow = Math.floor(idx / size);
      const dist = Math.abs(targetCol - curCol) + Math.abs(targetRow - curRow);
      if (dist < bestDist) { bestDist = dist; best = idx; }
    });

    if (best !== null && board.children[best]) {
      board.children[best].classList.add('hint');
      setTimeout(() => {
        if (board.children[best]) board.children[best].classList.remove('hint');
      }, 2000);
    }
  }
};
