// ===== SETTINGS =====
const Settings = {
  KEY: 'puzzlehave_settings',

  defaults: {
    sound: true,
    music: false,
    animation: true,
    showNumbers: false
  },

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return { ...this.defaults, ...saved };
    } catch { return { ...this.defaults }; }
  },

  save(key, value) {
    const current = this.load();
    current[key] = value;
    localStorage.setItem(this.KEY, JSON.stringify(current));
  }
};

function saveSetting(key, value) {
  Settings.save(key, value);
}
