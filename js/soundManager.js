import { Howl } from 'howler';

const notificationSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'],
  volume: 0.8
});

export function playNotificationSound(volume = 0.8) {
  notificationSound.volume(volume);
  notificationSound.play();
}