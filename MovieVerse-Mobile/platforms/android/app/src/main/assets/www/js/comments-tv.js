import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { app, db } from './firebase.js';

const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', async e => {
  e.preventDefault();
  const userName = document.getElementById('user-name').value;
  const userComment = document.getElementById('user-comment').value;
  const commentDate = new Date().toISOString();
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

  const commentData = {
    userName,
    userComment,
    commentDate,
    tvSeriesId,
  };

  try {
    await addDoc(collection(db, 'comments'), commentData);
    commentForm.reset();
    cacheComment(commentData);
    fetchComments();
  } catch (error) {
    console.log('Error adding comment: ', error);
    cacheComment(commentData);
    fetchCommentsFromLocalStorage();
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

async function fetchComments() {
  try {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    commentsContainer.style.maxWidth = '100%';
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

    const q = query(collection(db, 'comments'), where('tvSeriesId', '==', tvSeriesId), orderBy('commentDate', 'desc'));
    const querySnapshot = await getDocs(q);

    const comments = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.commentDate instanceof Timestamp) {
        data.commentDate = data.commentDate.toDate();
      } else {
        data.commentDate = new Date(data.commentDate);
      }
      comments.push(data);
    });

    cacheCommentsToLocalStorage(comments.slice(0, 6));
    displayComments(comments);
  } catch (error) {
    console.error('Error fetching comments from Firebase: ', error);
    fetchCommentsFromLocalStorage();
  }
}

function cacheCommentsToLocalStorage(comments) {
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
  const commentsWithIsoDates = comments.map(comment => ({
    ...comment,
    commentDate: comment.commentDate.toISOString(),
  }));
  localStorage.setItem(`comments_${tvSeriesId}`, JSON.stringify(commentsWithIsoDates));
}

function fetchCommentsFromLocalStorage() {
  const commentsContainer = document.getElementById('comments-container');
  commentsContainer.innerHTML = '';
  commentsContainer.style.maxWidth = '100%';
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
  const cachedComments = JSON.parse(localStorage.getItem(`comments_${tvSeriesId}`)) || [];

  if (cachedComments.length === 0) {
    const noCommentsMsg = document.createElement('p');
    noCommentsMsg.textContent = 'No comments for this TV series yet.';
    commentsContainer.appendChild(noCommentsMsg);
  } else {
    displayComments(cachedComments);
  }
}

function cacheComment(commentData) {
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
  const cachedComments = JSON.parse(localStorage.getItem(`comments_${tvSeriesId}`)) || [];
  cachedComments.unshift(commentData);
  if (cachedComments.length > 6) {
    cachedComments.pop();
  }
  localStorage.setItem(`comments_${tvSeriesId}`, JSON.stringify(cachedComments));
}

function displayComments(comments) {
  const commentsContainer = document.getElementById('comments-container');
  commentsContainer.innerHTML = '';
  let index = 0;
  let displayedComments = 0;

  comments.forEach(comment => {
    if (index >= (currentPage - 1) * commentsPerPage && displayedComments < commentsPerPage) {
      const commentDate = new Date(comment.commentDate);
      if (isNaN(commentDate)) {
        console.error('Invalid date format:', comment.commentDate);
        return;
      }
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

  totalComments = comments.length;
  totalPages = Math.ceil(totalComments / commentsPerPage);

  document.getElementById('prev-page').disabled = currentPage <= 1;
  document.getElementById('next-page').disabled = currentPage >= totalPages;
}

function formatCommentDate(commentDate) {
  if (!(commentDate instanceof Date) || isNaN(commentDate)) {
    return 'Invalid Date';
  }
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
