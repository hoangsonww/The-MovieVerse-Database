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
  const commentDate = new Date();
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

  try {
    await addDoc(collection(db, 'comments'), {
      userName,
      userComment,
      commentDate,
      tvSeriesId,
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
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

    const q = query(collection(db, 'comments'), where('tvSeriesId', '==', tvSeriesId), orderBy('commentDate', 'desc'));
    const querySnapshot = await getDocs(q);

    totalComments = querySnapshot.size;
    totalPages = Math.ceil(totalComments / commentsPerPage);

    let index = 0;
    let displayedComments = 0;

    if (querySnapshot.empty) {
      const noCommentsMsg = document.createElement('p');
      noCommentsMsg.textContent = 'No comments for this TV series yet.';
      commentsContainer.appendChild(noCommentsMsg);
    } else {
      querySnapshot.forEach(doc => {
        if (index >= (currentPage - 1) * commentsPerPage && displayedComments < commentsPerPage) {
          const comment = doc.data();

          let commentDate;
          if (comment.commentDate instanceof Timestamp) {
            commentDate = comment.commentDate.toDate();
          } else if (typeof comment.commentDate === 'string') {
            commentDate = new Date(comment.commentDate);
          } else {
            console.error('Unexpected commentDate format:', comment.commentDate);
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
      hideSpinner();
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
