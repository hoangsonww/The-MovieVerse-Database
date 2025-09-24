import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { app, db } from './firebase.js';

function showCommentToast(message, kind = 'remove') {
  const toast = document.createElement('div');
  toast.className = `notification-toast ${kind}`;
  toast.innerHTML = `
    <span class="notification-icon"><i class="fas ${kind === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i></span>
    <span class="notification-message">${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', async e => {
  e.preventDefault();
  const nameEl = document.getElementById('user-name');
  const commentEl = document.getElementById('user-comment');
  const userName = (nameEl.value || '').trim();
  const userComment = (commentEl.value || '').trim();
  const commentDate = new Date();
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

  if (!userName || !userComment) {
    showCommentToast('Please enter a nickname and a comment.', 'remove');
    if (!userName) nameEl.focus(); else commentEl.focus();
    return;
  }

  const submitBtn = document.getElementById('post-comment-btn');
  submitBtn.disabled = true;

  try {
    await addDoc(collection(db, 'comments'), {
      userName,
      userComment,
      commentDate,
      tvSeriesId,
    });
    commentForm.reset();
    fetchComments();
    if (modal) modal.style.display = 'none';
    showCommentToast('Comment posted!', 'success');
  } catch (error) {
    console.log('Error adding comment: ', error);
    showCommentToast('Failed to post comment. Please try again.', 'remove');
  } finally {
    submitBtn.disabled = false;
  }
});

let modal = document.getElementById('comment-modal');
let btn = document.getElementById('toggle-comment-modal');

btn.onclick = function () {
  modal.style.display = 'block';
};

const cancelBtn = document.getElementById('cancel-comment-btn');
if (cancelBtn) {
  cancelBtn.onclick = function () {
    modal.style.display = 'none';
  };
}

// Close modal only after successful submit (handled in submit listener)

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
    const movieId = localStorage.getItem('selectedTvSeriesId');

    const q = query(collection(db, 'comments'), where('tvSeriesId', '==', movieId), orderBy('commentDate', 'desc'));
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
          const commentDate = comment.commentDate.toDate();

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
    console.error('Error fetching user list: ', error);
    if (error.code === 'resource-exhausted') {
      const noUserSelected = document.getElementById('comments-section');
      if (noUserSelected) {
        noUserSelected.innerHTML =
          "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
        noUserSelected.style.height = '350px';
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
