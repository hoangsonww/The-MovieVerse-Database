import { getApps, initializeApp, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

async function loadFirebaseConfig() {
  try {
    const token = localStorage.getItem('movieverseToken');
    const response = await fetch('https://api-movieverse.vercel.app/api/firebase-config', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading Firebase config:', error);
    throw error;
  }
}

const firebaseConfig = await loadFirebaseConfig();

// Initialize the default app only if not already initialized.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

console.log('Firebase Initialized Successfully');

export { app, db };
export const firebaseReady = Promise.resolve({ app, db });
