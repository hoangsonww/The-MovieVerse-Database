import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { app, db } from "./firebase.js";

const commentForm = document.getElementById("comment-form");
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userName = document.getElementById("user-name").value;
  const userComment = document.getElementById("user-comment").value;
  const commentDate = new Date();
  const movieId = localStorage.getItem("selectedMovieId");

  const commentData = {
    userName,
    userComment,
    commentDate,
    movieId,
  };

  try {
    await addDoc(collection(db, "comments"), commentData);
    commentForm.reset();
    cacheComment(commentData);
    fetchComments(true); // Fetch first page of comments again after adding a new comment
  } catch (error) {
    console.log("Error adding comment: ", error);
    cacheComment(commentData);
    fetchCommentsFromLocalStorage();
  }
});

let modal = document.getElementById("comment-modal");
let btn = document.getElementById("toggle-comment-modal");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

document.getElementById("post-comment-btn").onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let currentPage = 1;
const commentsPerPage = 3;
let totalComments = 0;
let totalPages = 1;
let lastVisibleComment = null;

async function fetchComments(resetPagination = false) {
  try {
    const commentsContainer = document.getElementById("comments-container");
    if (resetPagination) {
      commentsContainer.innerHTML = "";
      currentPage = 1;
      lastVisibleComment = null;
    }

    commentsContainer.style.maxWidth = "100%";
    const movieId = localStorage.getItem("selectedMovieId");

    let q = query(
      collection(db, "comments"),
      where("movieId", "==", movieId),
      orderBy("commentDate", "desc"),
      limit(commentsPerPage),
    );

    if (lastVisibleComment) {
      q = query(q, startAfter(lastVisibleComment));
    }

    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push(doc.data());
    });

    lastVisibleComment = querySnapshot.docs[querySnapshot.docs.length - 1];

    if (resetPagination) {
      cacheCommentsToLocalStorage(comments.slice(0, 6)); // Cache up to 6 comments
    }

    displayComments(comments);

    totalComments =
      (totalComments === 0 && querySnapshot.size) || totalComments;
    totalPages = Math.ceil(totalComments / commentsPerPage);

    document.getElementById("prev-page").disabled = currentPage <= 1;
    document.getElementById("next-page").disabled =
      querySnapshot.size < commentsPerPage;
  } catch (error) {
    console.error("Error fetching comments from Firebase: ", error);
    fetchCommentsFromLocalStorage(); // Fallback to local storage
  }
}

function cacheCommentsToLocalStorage(comments) {
  const movieId = localStorage.getItem("selectedMovieId");
  localStorage.setItem(`comments_${movieId}`, JSON.stringify(comments));
}

function fetchCommentsFromLocalStorage() {
  const commentsContainer = document.getElementById("comments-container");
  commentsContainer.innerHTML = "";
  commentsContainer.style.maxWidth = "100%";
  const movieId = localStorage.getItem("selectedMovieId");
  const cachedComments =
    JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];

  if (cachedComments.length === 0) {
    const noCommentsMsg = document.createElement("p");
    noCommentsMsg.textContent = "No comments for this movie yet.";
    commentsContainer.appendChild(noCommentsMsg);
  } else {
    displayComments(cachedComments);
  }
}

function cacheComment(commentData) {
  const movieId = localStorage.getItem("selectedMovieId");
  const cachedComments =
    JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
  cachedComments.unshift(commentData); // Add new comment at the start
  if (cachedComments.length > 6) {
    cachedComments.pop(); // Limit to 6 comments
  }
  localStorage.setItem(`comments_${movieId}`, JSON.stringify(cachedComments));
}

function displayComments(comments) {
  const commentsContainer = document.getElementById("comments-container");
  let index = 0;
  let displayedComments = 0;

  comments.forEach((comment) => {
    if (
      index >= (currentPage - 1) * commentsPerPage &&
      displayedComments < commentsPerPage
    ) {
      const commentDate = new Date(comment.commentDate);
      const formattedDate = formatCommentDate(commentDate);
      const formattedTime = formatAMPM(commentDate);

      const timezoneOffset = -commentDate.getTimezoneOffset() / 60;
      const utcOffset =
        timezoneOffset >= 0 ? `UTC+${timezoneOffset}` : `UTC${timezoneOffset}`;
      const commentElement = document.createElement("div");

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

function formatCommentDate(commentDate) {
  const formattedDate =
    commentDate.toLocaleString("default", { month: "short" }) +
    " " +
    commentDate.getDate() +
    "th, " +
    commentDate.getFullYear();
  return formattedDate;
}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchComments();
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  if (lastVisibleComment) {
    currentPage++;
    fetchComments();
  }
});

fetchComments();
