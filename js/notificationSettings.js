export const defaultSettings = {
  sound: true,
  desktop: true,
  advance: 5, // minutes before task
  repeat: true,
  volume: 0.8
};

export function loadSettings() {
  const saved = localStorage.getItem('notificationSettings');
  return saved ? JSON.parse(saved) : defaultSettings;
}

export function saveSettings(settings) {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
}