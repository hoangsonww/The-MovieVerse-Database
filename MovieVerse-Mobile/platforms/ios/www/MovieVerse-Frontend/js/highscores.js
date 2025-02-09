import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

let app;
let db;

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
    const firebaseConfig = await response.json();
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase Initialized Successfully');
  } catch (error) {
    console.error('Error loading Firebase config:', error);
  }
}

await loadFirebaseConfig();

const games = ['BouncingStar', 'BucketGame', 'DinosaurJump', 'FlappyBird', 'SpaceShooter', 'StackGame'];

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

async function syncHighScores() {
  showSpinner();
  const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  if (!userEmail) return;
  for (const game of games) {
    const collectionRef = collection(db, `highScores${game}`);
    const gameQuery = query(collectionRef, where('email', '==', userEmail));
    const snapshot = await getDocs(gameQuery);
    if (!snapshot.empty) {
      const firebaseScore = snapshot.docs[0].data().score;
      const localKey = `highScore${game}`;
      const localScore = parseFloat(localStorage.getItem(localKey)) || 0;
      if (firebaseScore > localScore) {
        localStorage.setItem(localKey, firebaseScore.toString());
      }
    }
  }
  hideSpinner();
}

function getLocalHighScores() {
  return games.reduce((scores, game) => {
    const key = `highScore${game}`;
    const score = localStorage.getItem(key);
    if (score) scores[game] = parseFloat(score);
    return scores;
  }, {});
}

async function uploadHighScores() {
  showSpinner();
  const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  if (!userEmail) return;
  const localScores = getLocalHighScores();
  for (const game of games) {
    const collectionRef = collection(db, `highScores${game}`);
    const gameQuery = query(collectionRef, where('email', '==', userEmail));
    const snapshot = await getDocs(gameQuery);
    const currentScore = localScores[game] || 0;
    if (snapshot.empty) {
      await setDoc(doc(collectionRef), {
        email: userEmail,
        score: currentScore,
      });
    } else {
      const userHighScoreDoc = snapshot.docs[0];
      if (userHighScoreDoc.data().score < currentScore) {
        await updateDoc(userHighScoreDoc.ref, { score: currentScore });
      }
    }
  }
  hideSpinner();
}

async function fetchLeaderboards() {
  showSpinner();
  const leaderboards = {};
  for (const game of games) {
    const collectionRef = collection(db, `highScores${game}`);
    const gameQuery = query(collectionRef, orderBy('score', 'desc'));
    const snapshot = await getDocs(gameQuery);
    leaderboards[game] = snapshot.docs.map(doc => ({
      email: doc.data().email,
      score: doc.data().score,
    }));
  }
  hideSpinner();
  return leaderboards;
}

function renderLeaderboard(container, title, data, gameKey) {
  showSpinner();
  container.innerHTML = `
    <div class="leaderboard" style="animation: fadeIn 1.5s ease-in-out">
      <h2>${title}</h2>
      <input type="text" placeholder="Search for a User..." id="search-${gameKey}" data-game="${gameKey}">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody id="${gameKey}-tbody"></tbody>
      </table>
      <div class="pagination" id="${gameKey}-pagination"></div>
    </div>
  `;
  document.getElementById(`search-${gameKey}`).addEventListener('input', e => handleSearch(e, data, gameKey));
  hideSpinner();
}

function handleSearch(event, originalData, gameKey) {
  showSpinner();
  const queryStr = event.target.value.toLowerCase();
  const filteredData = originalData.filter(entry => entry.email.toLowerCase().includes(queryStr));
  updateLeaderboard(gameKey, filteredData);
  hideSpinner();
}

function paginateLeaderboard(data, page, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

function updateLeaderboard(gameKey, data, page = 1) {
  showSpinner();
  const tbody = document.getElementById(`${gameKey}-tbody`);
  const pagination = document.getElementById(`${gameKey}-pagination`);
  if (!tbody || !pagination) return;
  const pageSize = 10;
  const paginatedData = paginateLeaderboard(data, page, pageSize);
  tbody.innerHTML = paginatedData
    .map(
      (entry, index) => `
      <tr>
        <td>${index + 1 + (page - 1) * pageSize}</td>
        <td>${entry.email}</td>
        <td>${entry.score}</td>
      </tr>`
    )
    .join('');
  const totalPages = Math.ceil(data.length / pageSize);
  pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    return `<button class="${pageNumber === page ? 'active' : ''}" onclick="updateLeaderboard('${gameKey}', ${JSON.stringify(
      data
    )}, ${pageNumber})">${pageNumber}</button>`;
  }).join('');
  hideSpinner();
}

async function initializeLeaderboards() {
  showSpinner();
  const leaderboardsContainer = document.getElementById('leaderboards-container');
  const leaderboards = await fetchLeaderboards();
  leaderboardsContainer.innerHTML = '';
  for (const [gameKey, data] of Object.entries(leaderboards)) {
    let gameTitle = gameKey;
    if (gameKey === 'BouncingStar') {
      gameTitle = 'Falling Star';
    } else if (gameKey === 'BucketGame') {
      gameTitle = 'Catch the Popcorn';
    } else if (gameKey === 'DinosaurJump') {
      gameTitle = 'Dinosaur Jump';
    } else if (gameKey === 'FlappyBird') {
      gameTitle = 'Flappy Bird';
    } else if (gameKey === 'SpaceShooter') {
      gameTitle = 'Space Invaders';
    } else if (gameKey === 'StackGame') {
      gameTitle = 'Stack the Blocks';
    }
    const container = document.createElement('div');
    leaderboardsContainer.appendChild(container);
    renderLeaderboard(container, gameTitle, data, gameKey);
    localStorage.setItem(`leaderboardData${gameKey}`, JSON.stringify(data));
    updateLeaderboard(gameKey, data);
  }
  hideSpinner();
}

syncHighScores().then(uploadHighScores).then(initializeLeaderboards);
