// ===== MAIN INIT =====
window.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  const savedTheme = localStorage.getItem('puzzlehave_theme') || 'default';
  if (savedTheme !== 'default') {
    document.body.className = `theme-${savedTheme}`;
  }

  // Show menu
  showScreen('screen-menu');

  // Close peek overlay on click
  const peekOverlay = document.getElementById('peekOverlay');
  if (peekOverlay) {
    peekOverlay.addEventListener('click', () => {
      if (!document.getElementById('peekOverlay').classList.contains('hidden')) {
        togglePeek();
      }
    });
  }

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (currentScreen !== 'screen-game' || Game.solved) return;
    const size = Game.size;
    const emptyIdx = Game.emptyIndex;
    let targetIdx = -1;

    switch(e.key) {
      case 'ArrowUp':    targetIdx = emptyIdx + size; break;
      case 'ArrowDown':  targetIdx = emptyIdx - size; break;
      case 'ArrowLeft':  targetIdx = emptyIdx + 1;    break;
      case 'ArrowRight': targetIdx = emptyIdx - 1;    break;
    }

    if (targetIdx >= 0 && targetIdx < size * size) {
      Game.clickTile(targetIdx);
    }
  });

  console.log('🧩 PuzzleHave loaded!');
});
