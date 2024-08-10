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
  const movieId = localStorage.getItem('selectedMovieId');

  try {
    await addDoc(collection(db, 'comments'), {
      userName,
      userComment,
      commentDate,
      movieId,
    });
    commentForm.reset();
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

async function fetchComments() {
  try {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    commentsContainer.style.maxWidth = '100%';
    const movieId = localStorage.getItem('selectedMovieId');

    const q = query(collection(db, 'comments'), where('movieId', '==', movieId), orderBy('commentDate', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const cachedComments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
      totalComments = cachedComments.length;
      totalPages = Math.ceil(totalComments / commentsPerPage);

      if (totalComments === 0) {
        const noCommentsMsg = document.createElement('p');
        noCommentsMsg.textContent = 'No comments for this movie yet.';
        commentsContainer.appendChild(noCommentsMsg);
      } else {
        cachedComments.slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage).forEach(comment => {
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
      }

      document.getElementById('prev-page').disabled = currentPage <= 1;
      document.getElementById('next-page').disabled = currentPage >= totalPages;
      return;
    }

    totalComments = querySnapshot.size;
    totalPages = Math.ceil(totalComments / commentsPerPage);

    let index = 0;
    let displayedComments = 0;

    if (querySnapshot.empty) {
      const noCommentsMsg = document.createElement('p');
      noCommentsMsg.textContent = 'No comments for this movie yet.';
      commentsContainer.appendChild(noCommentsMsg);
    } else {
      const commentsArray = [];
      querySnapshot.forEach(doc => {
        const comment = doc.data();
        if (comment.commentDate instanceof Timestamp) {
          comment.commentDate = comment.commentDate.toDate();
        } else {
          comment.commentDate = new Date(comment.commentDate);
        }
        commentsArray.push(comment);
      });

      cacheCommentsToLocalStorage(commentsArray);
      commentsArray.slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage).forEach(comment => {
        const commentDate = comment.commentDate;

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
      });
    }

    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    const noCommentsMsg = document.getElementById('comments-section');
    if (noCommentsMsg) {
      noCommentsMsg.innerHTML = 'Sorry, an error occurred while fetching comments. Please try reloading.';
      noCommentsMsg.style.height = '350px';
      noCommentsMsg.style.textAlign = 'center';
      noCommentsMsg.style.maxWidth = '350px';
    }
  }
}

function cacheCommentsToLocalStorage(comments) {
  const movieId = localStorage.getItem('selectedMovieId');
  const commentsWithIsoDates = comments.map(comment => ({
    ...comment,
    commentDate: comment.commentDate.toISOString(),
  }));
  localStorage.setItem(`comments_${movieId}`, JSON.stringify(commentsWithIsoDates));
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
