import { app, db } from './firebase.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// No need to load config here—use the imported instance!

async function animateLoadingDots() {
  const loadingTextElement = document.querySelector('#myModal p');
  let dots = '';
  while (document.getElementById('myModal').classList.contains('modal-visible')) {
    loadingTextElement.textContent = `Loading chats${dots}`;
    dots = dots.length < 3 ? dots + '.' : '.';
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

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
    localStorage.setItem('triviaTotalAttempted', 0);
    localStorage.setItem('triviaTotalCorrect', 0);
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
        localStorage.setItem('triviaTotalAttempted', docSnap.data().totalAttempted);
        localStorage.setItem('triviaTotalCorrect', docSnap.data().totalCorrect);
        return docSnap.data();
      } else {
        console.log('No trivia stats found in Firebase for:', currentUserEmail);
        localStorage.setItem('triviaTotalAttempted', 0);
        localStorage.setItem('triviaTotalCorrect', 0);
        return { totalCorrect: 0, totalAttempted: 0 };
      }
    } catch (error) {
      if (error.code === 'resource-exhausted') {
        console.log('Firebase quota exceeded, fetching trivia stats from localStorage.');
        localStorage.setItem('triviaTotalAttempted', 0);
        localStorage.setItem('triviaTotalCorrect', 0);
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

document.addEventListener('DOMContentLoaded', async () => {
  await getTriviaStats(localStorage.getItem('movieverseUserEmail'));
});

export { animateLoadingDots };
