import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from 'firebase-config.js';
import { scheduleNotification } from 'notifications.js';

export async function addTask(task, dateTime) {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      text: task,
      dateTime: dateTime,
      created: new Date()
    });
    scheduleNotification(task, dateTime);
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
}

export async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

export async function loadTasks() {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}
