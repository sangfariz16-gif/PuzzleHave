// ===== UI FUNCTIONS =====

let currentScreen = 'screen-menu';
let selectedImage = 'sunset';
let selectedSize = 3;
let tutorialSlide = 0;
const TOTAL_SLIDES = 5;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  currentScreen = id;

  // Init screen-specific content
  if (id === 'screen-category') initCategoryScreen();
  if (id === 'screen-leaderboard') showLeaderboard(null, selectedSize);
  if (id === 'screen-tutorial') initTutorial();
  if (id === 'screen-settings') initSettings();
}

function initCategoryScreen() {
  renderImageGrid();
}

function renderImageGrid() {
  const grid = document.getElementById('imageGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PUZZLE_IMAGES.forEach(img => {
    const card = document.createElement('div');
    card.className = 'image-card' + (img.id === selectedImage ? ' selected' : '');
    card.onclick = () => selectImage(img.id);

    // Draw thumbnail
    const canvas = document.createElement('canvas');
    canvas.width = 110; canvas.height = 110;
    const ctx = canvas.getContext('2d');
    img.draw(ctx, 110, 110);
    card.appendChild(canvas);

    const label = document.createElement('div');
    label.className = 'image-card-label';
    label.textContent = img.name;
    card.appendChild(label);

    const badge = document.createElement('div');
    badge.className = 'selected-badge';
    badge.textContent = '✓';
    card.appendChild(badge);

    grid.appendChild(card);
  });
}

function selectImage(id) {
  selectedImage = id;
  document.querySelectorAll('.image-card').forEach(card => card.classList.remove('selected'));
  const cards = document.querySelectorAll('.image-card');
  const idx = PUZZLE_IMAGES.findIndex(img => img.id === id);
  if (cards[idx]) cards[idx].classList.add('selected');
}

function selectDifficulty(btn, size) {
  selectedSize = size;
  document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function startGame() {
  showScreen('screen-game');
  Game.init(selectedSize, selectedImage);
}

function quitGame() {
  clearInterval(Game.timer);
  showScreen('screen-menu');
}

function shuffleBoard() {
  Game.moves = 0;
  Game.seconds = 0;
  Game.solved = false;
  clearInterval(Game.timer);
  Game.shuffle();
  Game.render();
  Game.startTimer();
  Game.updateStats();
}

function hintMove() {
  Game.hint();
}

let peeking = false;
function togglePeek() {
  const overlay = document.getElementById('peekOverlay');
  if (!overlay) return;
  peeking = !peeking;
  overlay.classList.toggle('hidden', !peeking);
  if (peeking) {
    Game.renderFullPreview();
    const btn = document.getElementById('peekBtn');
    if (btn) btn.textContent = '🙈 Sembunyikan';
    // Auto close after 3 seconds
    setTimeout(() => {
      if (peeking) togglePeek();
    }, 3000);
  } else {
    const btn = document.getElementById('peekBtn');
    if (btn) btn.textContent = '👁️ Lihat Asli';
  }
}

function playAgain() {
  showScreen('screen-game');
  Game.init(selectedSize, selectedImage);
}

// ===== TUTORIAL =====
function initTutorial() {
  tutorialSlide = 0;
  renderTutorialSlide();
  renderDots();
}

function renderTutorialSlide() {
  document.querySelectorAll('.tutorial-slide').forEach((s, i) => {
    s.classList.toggle('active', i === tutorialSlide);
  });
  document.getElementById('prevBtn').disabled = tutorialSlide === 0;
  const nextBtn = document.getElementById('nextBtn');
  if (tutorialSlide === TOTAL_SLIDES - 1) {
    nextBtn.textContent = '🎮 Mulai Bermain!';
    nextBtn.onclick = () => showScreen('screen-category');
  } else {
    nextBtn.textContent = 'Selanjutnya →';
    nextBtn.onclick = nextSlide;
  }
  renderDots();
}

function renderDots() {
  const container = document.getElementById('slideDots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === tutorialSlide ? ' active' : '');
    dot.onclick = () => { tutorialSlide = i; renderTutorialSlide(); };
    container.appendChild(dot);
  }
}

function nextSlide() {
  if (tutorialSlide < TOTAL_SLIDES - 1) {
    tutorialSlide++;
    renderTutorialSlide();
  }
}

function prevSlide() {
  if (tutorialSlide > 0) {
    tutorialSlide--;
    renderTutorialSlide();
  }
}

// ===== WIN SCREEN =====
function saveScore() {
  const name = document.getElementById('playerName').value.trim() || 'Anonymous';
  const score = Game.calcScore();
  const time = Game.seconds;
  const moves = Game.moves;
  const size = Game.size;
  Leaderboard.add({ name, score, time, moves, size, date: new Date().toLocaleDateString('id-ID') });
  showScreen('screen-leaderboard');
  showLeaderboard(null, size);
}

// Theme toggle
function setTheme(btn, theme) {
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.body.className = theme === 'default' ? '' : `theme-${theme}`;
  localStorage.setItem('puzzlehave_theme', theme);
}

function initSettings() {
  const s = Settings.load();
  document.getElementById('soundToggle').checked = s.sound !== false;
  document.getElementById('musicToggle').checked = s.music === true;
  document.getElementById('animToggle').checked = s.animation !== false;
  document.getElementById('numbersToggle').checked = s.showNumbers === true;

  // Load theme
  const savedTheme = localStorage.getItem('puzzlehave_theme') || 'default';
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === savedTheme);
  });
}
