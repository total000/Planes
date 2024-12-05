import { requestNotificationPermission } from 'notifications.js';
import { addTask, deleteTask, loadTasks } from 'taskManager.js';
import { loadSettings, saveSettings as saveSettingsToStorage } from 'notificationSettings.js';
import { playNotificationSound } from 'soundManager.js';

document.addEventListener('DOMContentLoaded', () => {
  requestNotificationPermission();
  loadAndDisplayTasks();
  initializeSettings();
  initializeAnimations();

  const addTaskBtn = document.getElementById('addTask');
  const taskInput = document.getElementById('taskInput');
  const taskDateTime = document.getElementById('taskDateTime');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettings = document.getElementById('closeSettings');
  const saveSettingsBtn = document.getElementById('saveSettings');

  addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    const dateTime = taskDateTime.value;

    if (task && dateTime) {
      addTaskBtn.classList.add('animate__animated', 'animate__rubberBand');
      const taskId = await addTask(task, dateTime);
      if (taskId) {
        taskInput.value = '';
        taskDateTime.value = '';
        loadAndDisplayTasks();
        
        const settings = loadSettings();
        if (settings.sound) {
          playNotificationSound(settings.volume);
        }
      }
      setTimeout(() => {
        addTaskBtn.classList.remove('animate__animated', 'animate__rubberBand');
      }, 1000);
    } else {
      showError('Por favor completa todos los campos 🌸');
    }
  });

  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });

  closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  saveSettingsBtn.addEventListener('click', () => {
    const newSettings = {
      sound: document.getElementById('soundEnabled').checked,
      desktop: document.getElementById('desktopEnabled').checked,
      advance: parseInt(document.getElementById('advanceTime').value) || 5,
      repeat: document.getElementById('repeatEnabled').checked,
      volume: parseFloat(document.getElementById('volume').value)
    };
    
    saveSettingsToStorage(newSettings);
    settingsModal.style.display = 'none';
    
    if (newSettings.sound) {
      playNotificationSound(newSettings.volume);
    }
    
    showSuccess('¡Ajustes guardados! 💖');
  });

  window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
});

function initializeSettings() {
  const settings = loadSettings();
  
  document.getElementById('soundEnabled').checked = settings.sound;
  document.getElementById('desktopEnabled').checked = settings.desktop;
  document.getElementById('repeatEnabled').checked = settings.repeat;
  document.getElementById('volume').value = settings.volume;
  document.getElementById('advanceTime').value = settings.advance;
}

function initializeAnimations() {
  const decorations = document.querySelectorAll('.kawaii-cloud, .kawaii-star, .kawaii-heart');
  decorations.forEach((el, i) => {
    el.style.left = `${Math.random() * 90}%`;
    el.style.top = `${Math.random() * 90}%`;
    el.style.animationDelay = `${i * 0.5}s`;
  });
}

async function loadAndDisplayTasks() {
  const tasks = await loadTasks();
  const tasksList = document.getElementById('tasksList');
  tasksList.innerHTML = '';

  tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  tasks.forEach((task, index) => {
    const taskElement = createTaskElement(task);
    taskElement.style.animationDelay = `${index * 0.1}s`;
    tasksList.appendChild(taskElement);
  });
}

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task-item animate__animated animate__fadeInUp';
  
  const dateTime = new Date(task.dateTime);
  const formattedDate = dateTime.toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  div.innerHTML = `
    <div>
      <p class="task-text">${task.text}</p>
      <small class="task-date">📅 ${formattedDate}</small>
    </div>
    <button onclick="deleteTaskById('${task.id}')">Eliminar ✖️</button>
  `;

  return div;
}

function showError(message) {
  const notification = document.createElement('div');
  notification.className = 'notification animate__animated animate__fadeInUp';
  notification.style.backgroundColor = '#FF6B6B';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('animate__fadeInUp');
    notification.classList.add('animate__fadeOutDown');
    setTimeout(() => notification.remove(), 1000);
  }, 3000);
}

function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className = 'notification animate__animated animate__fadeInUp';
  notification.style.backgroundColor = '#FF1493';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('animate__fadeInUp');
    notification.classList.add('animate__fadeOutDown');
    setTimeout(() => notification.remove(), 1000);
  }, 3000);
}

window.deleteTaskById = async (taskId) => {
  if (await deleteTask(taskId)) {
    loadAndDisplayTasks();
    showSuccess('¡Tarea eliminada! 🌸');
  }
};
