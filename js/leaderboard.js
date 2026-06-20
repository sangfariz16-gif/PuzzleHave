// ===== LEADERBOARD =====
const Leaderboard = {
  KEY: 'puzzlehave_scores',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch { return {}; }
  },

  getBySize(size) {
    const all = this.getAll();
    return (all[size] || []).sort((a, b) => b.score - a.score).slice(0, 10);
  },

  add(entry) {
    const all = this.getAll();
    if (!all[entry.size]) all[entry.size] = [];
    all[entry.size].push(entry);
    all[entry.size].sort((a, b) => b.score - a.score);
    if (all[entry.size].length > 20) all[entry.size] = all[entry.size].slice(0, 20);
    localStorage.setItem(this.KEY, JSON.stringify(all));
  },

  clear() {
    localStorage.removeItem(this.KEY);
  }
};

function showLeaderboard(btn, size) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  selectedSize = size;
  const list = Leaderboard.getBySize(size);
  const container = document.getElementById('leaderboardContent');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<div class="lb-empty">Belum ada skor untuk ukuran ini.<br>Mainkan dan jadilah yang pertama! 🏆</div>';
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  container.innerHTML = list.map((entry, i) => `
    <div class="lb-item">
      <div class="lb-rank">${medals[i] || '#' + (i + 1)}</div>
      <div class="lb-info">
        <div class="lb-name">${escapeHtml(entry.name)}</div>
        <div class="lb-detail">⏱️ ${formatTime(entry.time)} &bull; 👣 ${entry.moves} langkah &bull; 📅 ${entry.date || '-'}</div>
      </div>
      <div class="lb-score">${entry.score.toLocaleString()}</div>
    </div>
  `).join('');
}

function clearLeaderboard() {
  if (confirm('Hapus semua skor leaderboard?')) {
    Leaderboard.clear();
    showLeaderboard(null, selectedSize);
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
