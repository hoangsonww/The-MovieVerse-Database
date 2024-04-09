import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: atob("QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw=="),
    authDomain: atob("bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t"),
    projectId: "movieverse-app",
    storageBucket: atob("bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20="),
    messagingSenderId: atob("ODAyOTQzNzE4ODcx"),
    appId: atob("MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=")
};

initializeApp(firebaseConfig);
const db = getFirestore();

const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
let selectedUserEmail = null;

const messagesDiv = document.getElementById('messages');
const userListDiv = document.getElementById('userList');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', async () => {
    const text = messageInput.value.trim();
    if (text && selectedUserEmail) {
        try {
            await addDoc(collection(db, "messages"), {
                sender: currentUserEmail,
                recipient: selectedUserEmail,
                message: text,
                timestamp: serverTimestamp()
            });
            messageInput.value = '';

            const userElement = document.querySelector(`.user[data-email="${selectedUserEmail}"]`);
            if (userElement) {
                userListDiv.prepend(userElement);
            }
        }
        catch (error) {
            console.error("Error adding message: ", error);
        }
    }
});

document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendButton.click();
    }
});

function formatMessage(message, isCurrentUser, timestamp) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = isCurrentUser ? `You: ${message}` : `${selectedUserEmail}: ${message}`;

    // Ensure the timestamp is correctly handled
    if (timestamp && timestamp.toDate) {
        messageElement.dataset.timestamp = timestamp.toDate().toISOString();
    } else {
        console.log('Timestamp is not in the expected format:', timestamp);
        messageElement.dataset.timestamp = 'Unknown time';
    }

    messageElement.classList.add(isCurrentUser ? 'my-message' : 'other-message');
    messageElement.addEventListener('mouseover', showTooltip);
    messageElement.addEventListener('click', showTooltip);

    return messageElement;
}

function showTooltip(event) {
    const messageElement = event.target.closest('.message');
    const timestampString = messageElement.dataset.timestamp;

    const date = new Date(timestampString);
    const tooltipText = isNaN(date.getTime()) ? 'Unknown time' : date.toLocaleString('default', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);

    const rect = messageElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const leftPosition = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${rect.top - tooltipRect.height - 5}px`;
    tooltip.style.left = `${Math.max(leftPosition, 0) - 10}px`;

    function removeTooltip() {
        tooltip.remove();
    }
    messageElement.addEventListener('mouseout', removeTooltip);
    setTimeout(removeTooltip, 5000);
}

const chatSection = document.getElementById('chatSection');
const noUserSelected = document.getElementById('noUserSelected');

chatSection.style.display = 'none';
noUserSelected.style.display = 'flex';

async function loadMessages(userEmail) {
    selectedUserEmail = userEmail;
    messagesDiv.innerHTML = '';

    chatSection.style.display = 'flex';
    noUserSelected.style.display = 'none';

    const userEmailDisplay = document.getElementById('userEmailDisplay');
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `Chatting with: ${selectedUserEmail}`;
    }

    document.querySelectorAll('.user').forEach(user => user.classList.remove('selected'));
    const selectedUser = document.querySelector(`.user[data-email="${selectedUserEmail}"]`);
    if (selectedUser) {
        selectedUser.classList.add('selected');
    }

    const messagesQuery = query(
        collection(db, "messages"),
        orderBy("timestamp"),
        where("sender", "in", [currentUserEmail, selectedUserEmail]),
        where("recipient", "in", [currentUserEmail, selectedUserEmail])
    );

    onSnapshot(messagesQuery, (snapshot) => {
        messagesDiv.innerHTML = '';
        snapshot.docs.forEach((doc) => {
            const messageData = doc.data();
            const isCurrentUser = messageData.sender === currentUserEmail;
            const timestamp = messageData.timestamp;
            const messageElement = formatMessage(messageData.message, isCurrentUser, timestamp);
            messagesDiv.appendChild(messageElement);
        });

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

function setupSearchListeners() {
    const searchUserInput = document.getElementById('searchUserInput');

    searchUserInput.addEventListener('input', () => {
        const searchText = searchUserInput.value.trim();
        if (searchText) {
            performSearch(searchText);
        }
        else {
            document.getElementById('searchUserResults').style.display = 'none';
        }
    });
}

async function performSearch(searchText) {
    const searchUserResults = document.getElementById('searchUserResults');
    showSpinner();

    const userQuery = query(
        collection(db, 'MovieVerseUsers'),
        where('email', '>=', searchText),
        orderBy('email'),
        limit(10)
    );
    const querySnapshot = await getDocs(userQuery);

    searchUserResults.innerHTML = '';

    if (querySnapshot.empty) {
        searchUserResults.innerHTML = `<div style="text-align: center; font-weight: bold">No User with Email "${searchText}" found</div>`;
        searchUserResults.style.display = 'block';
    }
    else {
        searchUserResults.style.display = 'block';
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const userDiv = document.createElement('div');
            userDiv.className = 'user-search-result';
            userDiv.style.cursor = 'pointer';
            userDiv.addEventListener('click', () => loadMessages(user.email));

            const img = document.createElement('img');
            img.src = user.profileImage || '../../images/user-default.png';
            img.style.width = '33%';
            img.style.borderRadius = '8px';
            userDiv.appendChild(img);

            const textDiv = document.createElement('div');
            textDiv.style.width = '67%';
            textDiv.style.textAlign = 'left';
            textDiv.innerHTML = `<strong style="text-align: left">${user.email}</strong><p style="text-align: left; margin-top: 5px">${user.bio || ''}</p>`;
            userDiv.appendChild(textDiv);

            searchUserResults.appendChild(userDiv);
        });
    }

    hideSpinner();
}

async function loadUserList() {
    const isMobile = window.innerWidth <= 767;
    const userLimit = isMobile ? 5 : 10;

    const recentMessagesQuery = query(collection(db, "messages"), where("sender", "==", currentUserEmail), orderBy("timestamp", "desc"), limit(userLimit));
    const recentMessagesSnapshot = await getDocs(recentMessagesQuery);

    let recentContacts = new Set();
    recentMessagesSnapshot.forEach(doc => {
        const data = doc.data();
        recentContacts.add(data.recipient === currentUserEmail ? data.sender : data.recipient);
    });

    const allUsersQuery = query(collection(db, "MovieVerseUsers"), limit(10));
    const allUsersSnapshot = await getDocs(allUsersQuery);

    let users = [];
    allUsersSnapshot.forEach(doc => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
    });

    users.sort((a, b) => {
        let aIndex = recentContacts.has(a.email) ? Array.from(recentContacts).indexOf(a.email) : Infinity;
        let bIndex = recentContacts.has(b.email) ? Array.from(recentContacts).indexOf(b.email) : Infinity;
        return aIndex - bIndex;
    });

    userListDiv.innerHTML = '';
    users.slice(0, 10).forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.setAttribute('data-email', user.email);
        userElement.onclick = () => {
            selectedUserEmail = user.email;
            loadMessages(user.email);
            document.querySelectorAll('.user').forEach(user => user.classList.remove('selected'));
            userElement.classList.add('selected');
        };

        const img = document.createElement('img');
        img.src = user.profileImage || '../../images/user-default.png';
        img.style.width = '50px';
        img.style.borderRadius = '25px';
        img.style.marginRight = '10px';
        userElement.appendChild(img);

        const emailDiv = document.createElement('div');
        emailDiv.textContent = user.email;
        userElement.appendChild(emailDiv);

        if (recentContacts.has(user.email)) {
            const dot = document.createElement('div');
            dot.classList.add('orange-dot');
            userElement.appendChild(dot);
        }

        userListDiv.appendChild(userElement);
    });
}

loadUserList();
setupSearchListeners();

onSnapshot(collection(db, "messages"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
            loadUserList();
        }
    });
});

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}