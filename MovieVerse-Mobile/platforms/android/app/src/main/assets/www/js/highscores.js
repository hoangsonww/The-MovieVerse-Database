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

function translateFBC(value) {
  return atob(value);
}

function getFBConfig1() {
  const fbConfig1 = 'QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw==';
  return translateFBC(fbConfig1);
}

function getFBConfig2() {
  const fbConfig2 = 'bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t';
  return translateFBC(fbConfig2);
}

function getFBConfig3() {
  const fbConfig3 = 'bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20=';
  return translateFBC(fbConfig3);
}

function getFBConfig4() {
  const fbConfig4 = 'ODAyOTQzNzE4ODcx';
  return translateFBC(fbConfig4);
}

function getFBConfig5() {
  const fbConfig5 = 'MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=';
  return translateFBC(fbConfig5);
}

const firebaseConfig = {
  apiKey: getFBConfig1(),
  authDomain: getFBConfig2(),
  projectId: 'movieverse-app',
  storageBucket: getFBConfig3(),
  messagingSenderId: getFBConfig4(),
  appId: getFBConfig5(),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const games = ['BouncingStar', 'BucketGame', 'DinosaurJump', 'FlappyBird', 'SpaceShooter', 'StackGame'];

// Fetch user's high scores from Firebase and update local storage
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

// Get local storage high scores
function getLocalHighScores() {
  return games.reduce((scores, game) => {
    const key = `highScore${game}`;
    const score = localStorage.getItem(key);
    if (score) scores[game] = parseFloat(score);
    return scores;
  }, {});
}

// Upload high scores to Firebase
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
      // Add new document for the user if no record exists
      await setDoc(doc(collectionRef), {
        email: userEmail,
        score: currentScore,
      });
    } else {
      // Update existing score if the new score is higher
      const userHighScoreDoc = snapshot.docs[0];
      if (userHighScoreDoc.data().score < currentScore) {
        await updateDoc(userHighScoreDoc.ref, { score: currentScore });
      }
    }
  }

  hideSpinner();
}

// Fetch leaderboards
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

// Render leaderboard table
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

// Handle search functionality
function handleSearch(event, originalData, gameKey) {
  showSpinner();
  const query = event.target.value.toLowerCase();
  const filteredData = originalData.filter(entry => entry.email.toLowerCase().includes(query));
  updateLeaderboard(gameKey, filteredData);
  hideSpinner();
}

// Paginate leaderboard
function paginateLeaderboard(data, page, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

// Update leaderboard display
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

// Initialize leaderboards
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
    } else {
      gameTitle = gameKey;
    }

    const container = document.createElement('div');
    leaderboardsContainer.appendChild(container); // Attach container to DOM first
    renderLeaderboard(container, gameTitle, data, gameKey); // Render after attaching
    localStorage.setItem(`leaderboardData${gameKey}`, JSON.stringify(data));
    updateLeaderboard(gameKey, data); // Safely update after rendering
  }

  hideSpinner();
}

// Sync high scores, upload local scores, and initialize leaderboards
syncHighScores().then(uploadHighScores).then(initializeLeaderboards);
