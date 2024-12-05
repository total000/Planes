import { loadSettings } from './notificationSettings.js';
import { playNotificationSound } from './soundManager.js';

export function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission();
  }
}

export function showNotification(title, body) {
  const settings = loadSettings();
  
  if (settings.sound) {
    playNotificationSound(settings.volume);
  }

  if (settings.desktop && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/kawaii-icon.png',
      badge: '/kawaii-badge.png',
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export function scheduleNotification(task, dateTime) {
  const settings = loadSettings();
  const taskTime = new Date(dateTime).getTime();
  
  // Schedule advance notification
  if (settings.advance > 0) {
    const advanceTime = taskTime - (settings.advance * 60 * 1000);
    const now = new Date().getTime();
    
    if (advanceTime > now) {
      setTimeout(() => {
        showNotification('Upcoming Task! 🎀', `${task} starts in ${settings.advance} minutes!`);
      }, advanceTime - now);
    }
  }

  // Schedule main notification
  const mainDelay = taskTime - new Date().getTime();
  if (mainDelay > 0) {
    setTimeout(() => {
      showNotification('Task Time! 🌸', `Time for: ${task}`);
      
      // Schedule repeat notifications if enabled
      if (settings.repeat) {
        const repeatInterval = 5 * 60 * 1000; // 5 minutes
        const maxRepeats = 3;
        let repeatCount = 0;
        
        const repeatNotification = setInterval(() => {
          repeatCount++;
          if (repeatCount < maxRepeats) {
            showNotification('Reminder! 💖', `Don't forget: ${task}`);
          } else {
            clearInterval(repeatNotification);
          }
        }, repeatInterval);
      }
    }, mainDelay);
  }
}