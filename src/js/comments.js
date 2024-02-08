import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL6kQnSfUdD8Ut8HFrp9kuivqz1xdXm7k",
    authDomain: "movieverse-app.firebaseapp.com",
    projectId: "movieverse-app",
    storageBucket: "movieverse-app.appspot.com",
    messagingSenderId: "802943718871",
    appId: "1:802943718871:web:48bc916cc99e2724212792"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const commentForm = document.getElementById("comment-form");
commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = document.getElementById("user-name").value;
    const userComment = document.getElementById("user-comment").value;
    const commentDate = new Date();
    const movieId = localStorage.getItem("selectedMovieId");

    try {
        await addDoc(collection(db, "comments"), {
            userName,
            userComment,
            commentDate,
            movieId
        });
        commentForm.reset();
        fetchComments();
    }
    catch (error) {
        console.error("Error adding comment: ", error);
    }
});

var modal = document.getElementById("comment-modal");
var btn = document.getElementById("toggle-comment-modal");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

document.getElementById("post-comment-btn").onclick = function() {
    modal.style.display = "none";

}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


let currentPage = 1;
const commentsPerPage = 3;
let totalComments = 0;
let totalPages = 1;

async function fetchComments() {
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.innerHTML = '';
    const movieId = localStorage.getItem("selectedMovieId");

    const q = query(collection(db, "comments"), where("movieId", "==", movieId), orderBy("commentDate", "desc"));
    const querySnapshot = await getDocs(q);

    totalComments = querySnapshot.size;
    totalPages = Math.ceil(totalComments / commentsPerPage);

    let index = 0;
    let displayedComments = 0;

    if (querySnapshot.empty) {
        // If there are no comments, display a message
        const noCommentsMsg = document.createElement("p");
        noCommentsMsg.textContent = "No comments for this movie yet.";
        commentsContainer.appendChild(noCommentsMsg);
    } else {
        querySnapshot.forEach((doc) => {
            if (index >= (currentPage - 1) * commentsPerPage && displayedComments < commentsPerPage) {
                const comment = doc.data();
                const commentDate = comment.commentDate.toDate();
                const timezoneOffset = -commentDate.getTimezoneOffset() / 60;
                const utcOffset = timezoneOffset >= 0 ? `(UTC+${timezoneOffset})` : `(UTC${timezoneOffset})`;
                const formattedDate = formatCommentDate(commentDate) + ` ${utcOffset}`;

                const commentElement = document.createElement("div");
                commentElement.innerHTML = `<p><strong>${comment.userName}</strong> at ${formattedDate} commented: <em>${comment.userComment}</em></p>`;
                commentsContainer.appendChild(commentElement);
                displayedComments++;
            }
            index++;
        });
    }

    document.getElementById("prev-page").disabled = currentPage <= 1;
    document.getElementById("next-page").disabled = currentPage >= totalPages;
}

function formatCommentDate(commentDate) {
    const formattedDate = commentDate.toLocaleString('default', { month: 'short' }) + " " +
        commentDate.getDate() + "th, " +
        commentDate.getFullYear() + " at " +
        formatAMPM(commentDate);
    return formattedDate;
}

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchComments();
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchComments();
    }
});

fetchComments();
