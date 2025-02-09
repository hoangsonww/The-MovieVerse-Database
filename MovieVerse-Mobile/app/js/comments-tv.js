let app;
let db;
let firebaseModules;

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
    const firebaseAppModule = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const firebaseFirestoreModule = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
    app = firebaseAppModule.initializeApp(firebaseConfig);
    db = firebaseFirestoreModule.getFirestore(app);
    firebaseModules = {
      collection: firebaseFirestoreModule.collection,
      addDoc: firebaseFirestoreModule.addDoc,
      getDocs: firebaseFirestoreModule.getDocs,
      query: firebaseFirestoreModule.query,
      orderBy: firebaseFirestoreModule.orderBy,
      where: firebaseFirestoreModule.where,
      Timestamp: firebaseFirestoreModule.Timestamp,
    };
    console.log('Firebase Initialized Successfully');
  } catch (error) {
    console.error('Error loading Firebase config:', error);
  }
}

loadFirebaseConfig();

async function ensureFirebase() {
  while (!db || !firebaseModules) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return { db, firebaseModules };
}

const commentForm = document.getElementById('comment-form');

commentForm.addEventListener('submit', async e => {
  e.preventDefault();
  const userName = document.getElementById('user-name').value;
  const userComment = document.getElementById('user-comment').value;
  const commentDate = new Date();
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

  try {
    const { db, firebaseModules } = await ensureFirebase();
    await firebaseModules.addDoc(firebaseModules.collection(db, 'comments'), {
      userName,
      userComment,
      commentDate,
      tvSeriesId,
    });
    commentForm.reset();
    clearCommentCache(tvSeriesId);
    fetchComments();
  } catch (error) {
    console.log('Error adding comment: ', error);
  }
});

let modal = document.getElementById('comment-modal');
let btn = document.getElementById('toggle-comment-modal');
let span = document.getElementsByClassName('close')[0];

btn.onclick = function () {
  modal.style.display = 'block';
};

span.onclick = function () {
  modal.style.display = 'none';
};

document.getElementById('post-comment-btn').onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

let currentPage = 1;
const commentsPerPage = 3;
let totalComments = 0;
let totalPages = 1;

const LOCAL_STORAGE_TV_COMMENT_KEY_PREFIX = 'movieVerseTvCommentsCache';

function getCachedComments(tvSeriesId) {
  const cachedData = localStorage.getItem(LOCAL_STORAGE_TV_COMMENT_KEY_PREFIX + tvSeriesId);
  return cachedData ? JSON.parse(cachedData) : null;
}

function updateCommentCache(tvSeriesId, comments) {
  localStorage.setItem(LOCAL_STORAGE_TV_COMMENT_KEY_PREFIX + tvSeriesId, JSON.stringify({ comments, lastUpdated: Date.now() }));
}

function clearCommentCache(tvSeriesId) {
  localStorage.removeItem(LOCAL_STORAGE_TV_COMMENT_KEY_PREFIX + tvSeriesId);
}

async function fetchComments() {
  try {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    commentsContainer.style.maxWidth = '100%';
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

    const cachedComments = getCachedComments(tvSeriesId);

    if (cachedComments && cachedComments.comments.length > 0) {
      const allComments = cachedComments.comments;
      totalComments = allComments.length;
      totalPages = Math.ceil(totalComments / commentsPerPage);
      let startIndex = (currentPage - 1) * commentsPerPage;
      let endIndex = startIndex + commentsPerPage;
      const pageComments = allComments.slice(startIndex, endIndex);
      pageComments.forEach(comment => {
        const commentDate = new Date(comment.commentDate);
        const formattedDate = formatCommentDate(commentDate);
        const formattedTime = formatAMPM(commentDate);
        const timezoneOffset = -commentDate.getTimezoneOffset() / 60;
        const utcOffset = timezoneOffset >= 0 ? `UTC+${timezoneOffset}` : `UTC${timezoneOffset}`;
        const commentElement = document.createElement('div');
        commentElement.title = `Posted at ${formattedTime} ${utcOffset}`;
        const commentStyle = `
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
          margin-bottom: 1rem;
        `;
        commentElement.style.cssText = commentStyle;
        commentElement.innerHTML = `
          <p>
            <strong>${comment.userName}</strong> on ${formattedDate}: 
            <em>${comment.userComment}</em>
          </p>
        `;
        commentsContainer.appendChild(commentElement);
      });
      document.getElementById('prev-page').disabled = currentPage <= 1;
      document.getElementById('next-page').disabled = currentPage >= totalPages;
      return;
    }

    const { db, firebaseModules } = await ensureFirebase();
    const q = firebaseModules.query(
      firebaseModules.collection(db, 'comments'),
      firebaseModules.where('tvSeriesId', '==', tvSeriesId),
      firebaseModules.orderBy('commentDate', 'desc')
    );
    const querySnapshot = await firebaseModules.getDocs(q);
    totalComments = querySnapshot.size;
    totalPages = Math.ceil(totalComments / commentsPerPage);
    let commentsData = [];
    let index = 0;
    let displayedComments = 0;
    if (querySnapshot.empty) {
      const noCommentsMsg = document.createElement('p');
      noCommentsMsg.textContent = 'No comments for this TV series yet.';
      commentsContainer.appendChild(noCommentsMsg);
    } else {
      querySnapshot.forEach(doc => {
        const comment = doc.data();
        let commentDate;
        if (comment.commentDate instanceof firebaseModules.Timestamp) {
          commentDate = comment.commentDate.toDate();
        } else if (typeof comment.commentDate === 'string') {
          commentDate = new Date(comment.commentDate);
        } else {
          console.error('Unexpected commentDate format:', comment.commentDate);
          return;
        }
        commentsData.push({
          userName: comment.userName,
          userComment: comment.userComment,
          commentDate: commentDate.toISOString(),
        });
        if (index >= (currentPage - 1) * commentsPerPage && displayedComments < commentsPerPage) {
          const formattedDate = formatCommentDate(commentDate);
          const formattedTime = formatAMPM(commentDate);
          const timezoneOffset = -commentDate.getTimezoneOffset() / 60;
          const utcOffset = timezoneOffset >= 0 ? `UTC+${timezoneOffset}` : `UTC${timezoneOffset}`;
          const commentElement = document.createElement('div');
          commentElement.title = `Posted at ${formattedTime} ${utcOffset}`;
          const commentStyle = `
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
            margin-bottom: 1rem;
          `;
          commentElement.style.cssText = commentStyle;
          commentElement.innerHTML = `
            <p>
              <strong>${comment.userName}</strong> on ${formattedDate}: 
              <em>${comment.userComment}</em>
            </p>
          `;
          commentsContainer.appendChild(commentElement);
          displayedComments++;
        }
        index++;
      });
      if (commentsData.length > 0) {
        updateCommentCache(tvSeriesId, commentsData);
      }
    }
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    if (error.code === 'resource-exhausted') {
      const noUserSelected = document.getElementById('comments-section');
      if (noUserSelected) {
        const commentControls = document.getElementById('comments-controls');
        commentControls.style.display = 'none';
        noUserSelected.innerHTML +=
          'Sorry, the comment feature is currently unavailable as our databases are currently overloaded. Please try again in a couple of hours. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!';
        noUserSelected.style.height = 'auto';
        noUserSelected.style.textAlign = 'center';
        noUserSelected.style.maxWidth = '350px';
      }
    }
  }
}

function formatCommentDate(commentDate) {
  const formattedDate = commentDate.toLocaleString('default', { month: 'short' }) + ' ' + commentDate.getDate() + 'th, ' + commentDate.getFullYear();
  return formattedDate;
}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchComments();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchComments();
  }
});

fetchComments();
