import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: atob('QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw=='),
  authDomain: atob('bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t'),
  projectId: 'movieverse-app',
  storageBucket: atob('bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20='),
  messagingSenderId: atob('ODAyOTQzNzE4ODcx'),
  appId: atob('MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI='),
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function updateTriviaStats(currentUserEmail, correctAnswers, totalQuestions) {
  if (!currentUserEmail) {
    let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || {
      totalCorrect: 0,
      totalAttempted: 0,
    };
    triviaStats.totalCorrect += correctAnswers;
    triviaStats.totalAttempted += totalQuestions;
    localStorage.setItem('triviaStats', JSON.stringify(triviaStats));
  } else {
    try {
      const statsRef = doc(db, 'userTriviaStats', currentUserEmail);
      const docSnap = await getDoc(statsRef);
      let triviaStats = docSnap.exists() ? docSnap.data() : { totalCorrect: 0, totalAttempted: 0 };
      triviaStats.totalCorrect += correctAnswers;
      triviaStats.totalAttempted += totalQuestions;
      await setDoc(statsRef, triviaStats, { merge: true });
      localStorage.setItem('triviaStats', JSON.stringify(triviaStats));
    } catch (error) {
      if (error.code === 'resource-exhausted') {
        let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || {
          totalCorrect: 0,
          totalAttempted: 0,
        };
        triviaStats.totalCorrect += correctAnswers;
        triviaStats.totalAttempted += totalQuestions;
        localStorage.setItem('triviaStats', JSON.stringify(triviaStats));
      }
    }
  }
}

export async function getTriviaStats(currentUserEmail) {
  if (!currentUserEmail) {
    return (
      JSON.parse(localStorage.getItem('triviaStats')) || {
        totalCorrect: 0,
        totalAttempted: 0,
      }
    );
  } else {
    const statsRef = doc(db, 'userTriviaStats', currentUserEmail);
    try {
      const docSnap = await getDoc(statsRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No trivia stats found in Firebase for:', currentUserEmail);
        return { totalCorrect: 0, totalAttempted: 0 };
      }
    } catch (error) {
      if (error.code === 'resource-exhausted') {
        console.log('Firebase quota exceeded, fetching trivia stats from localStorage.');
        return (
          JSON.parse(localStorage.getItem('triviaStats')) || {
            totalCorrect: 0,
            totalAttempted: 0,
          }
        );
      }
    }
  }
}
