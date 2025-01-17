import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const code1 = 'QUl6YVN5RE' + 'w2a1FuU2ZV' + 'ZDhVdDhIR' + 'nJwS3Vpdn' + 'F6MXhkW' + 'G03aw==';

const code2 = 'bW92aWV2' + 'ZXJzZS1' + 'hcHAuZm' + 'lyZWJhc2' + 'VhcHAu' + 'Y29t';

const code3 = 'bW92aWV2' + 'ZXJzZS1hc' + 'HAuYXBwc' + '3BvdC' + '5jb20=';

const code4 = 'ODAyOTQz' + 'NzE4ODcx';

const code5 = 'MTo4MDI' + '5NDM3MTg' + '4NzE6d2V' + 'iOjQ4YmM' + '5MTZjYz' + 'k5ZTI3M' + 'jQyMTI' + '3OTI=';

async function animateLoadingDots() {
  const loadingTextElement = document.querySelector('#myModal p');
  let dots = '';

  while (document.getElementById('myModal').classList.contains('modal-visible')) {
    loadingTextElement.textContent = `Loading chats${dots}`;
    dots = dots.length < 3 ? dots + '.' : '.';
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

const firebaseConfig = {
  apiKey: atob(code1),
  authDomain: atob(code2),
  projectId: 'movieverse-app',
  storageBucket: atob(code3),
  messagingSenderId: atob(code4),
  appId: atob(code5),
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
