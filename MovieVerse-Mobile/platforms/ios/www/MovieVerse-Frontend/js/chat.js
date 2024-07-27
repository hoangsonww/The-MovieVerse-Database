import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, startAfter, getDocs, query, where, orderBy, onSnapshot, documentId, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.getElementById('main');
    const isLoggedIn = localStorage.getItem('isSignedIn');

    if (!isLoggedIn || isLoggedIn !== 'true') {
        mainElement.style.display = 'none';

        const signInMessage = document.createElement('div');
        signInMessage.innerHTML = '<h3 style="color: white; text-align: center;">You must be signed in to access MovieVerse chat services.</h3>';
        signInMessage.style.display = 'flex';
        signInMessage.style.justifyContent = 'center';
        signInMessage.style.alignItems = 'center';
        signInMessage.style.height = '100vh';
        signInMessage.style.borderRadius = '12px';
        signInMessage.style.margin = '10px auto';
        signInMessage.style.marginRight = '20px';
        signInMessage.style.marginLeft = '20px';
        signInMessage.style.marginBottom = '20px';
        signInMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        document.getElementById('footer').style.display = 'none';

        const adContainer2 = document.getElementById('ad-container2');
        if (adContainer2) {
            document.body.insertBefore(signInMessage, adContainer2);
        }
        else {
            document.body.appendChild(signInMessage);
        }
    }
    else {
        mainElement.style.display = '';
        loadUserList();
        setupSearchListeners();
    }
});

async function animateLoadingDots() {
    const loadingTextElement = document.querySelector('#myModal p');
    let dots = "";

    while (document.getElementById('myModal').classList.contains('modal-visible')) {
        loadingTextElement.textContent = `Loading chats${dots}`;
        dots = (dots.length < 3) ? dots + "." : ".";
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

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
                timestamp: serverTimestamp(),
                readBy: [currentUserEmail]
            });
            messageInput.value = '';

            const userElement = document.querySelector(`.user[data-email="${selectedUserEmail}"]`);

            if (!userElement) {
                const newUserElement = await createUserElement(selectedUserEmail);
                userListDiv.prepend(newUserElement);
                selectUser(newUserElement);
            }
            else {
                userListDiv.prepend(userElement);
                selectUser(userElement);
            }
        }
        catch (error) {
            console.error("Error adding message: ", error);
        }
    }
});

async function createUserElement(email) {
    const userElement = document.createElement('div');
    userElement.classList.add('user');
    userElement.setAttribute('data-email', email);
    userElement.addEventListener('click', () => loadMessages(email));

    const profileQuery = query(collection(db, 'profiles'), where('__name__', '==', email));
    const profileSnapshot = await getDocs(profileQuery);
    let imageUrl = '../../images/user-default.png';

    if (!profileSnapshot.empty) {
        const profileData = profileSnapshot.docs[0].data();
        imageUrl = profileData.profileImage || imageUrl;
    }

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '50px';
    img.style.borderRadius = '25px';
    img.style.marginRight = '10px';
    userElement.appendChild(img);

    const emailDiv = document.createElement('div');
    emailDiv.textContent = email;
    userElement.appendChild(emailDiv);

    return userElement;
}

function selectUser(userElement) {
    if (previouslySelectedUserElement) {
        previouslySelectedUserElement.classList.remove('selected');
        previouslySelectedUserElement.style.backgroundColor = '';
    }
    userElement.classList.add('selected');
    userElement.style.backgroundColor = '#ff8623';
    previouslySelectedUserElement = userElement;
}

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

    if (timestamp && timestamp.toDate) {
        messageElement.dataset.timestamp = timestamp.toDate().toISOString();
    }
    else {
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
    tooltip.style.left = `${Math.max(leftPosition, 0) - 12}px`;

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

            if (!isCurrentUser && (!messageData.readBy || !messageData.readBy.includes(currentUserEmail))) {
                updateReadStatus(doc.id);
            }
        });

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

async function updateReadStatus(messageId) {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, {
        readBy: arrayUnion(currentUserEmail)
    });
}

let searchDebounceTimeout;
let lastVisible = null;
const initialFetchLimit = 5;
const maxTotalFetch = 20;

function setupSearchListeners() {
    const searchUserInput = document.getElementById('searchUserInput');
    const searchUserResults = document.getElementById('searchUserResults');

    searchUserInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimeout);
        const searchText = searchUserInput.value.trim();

        if (searchText) {
            searchDebounceTimeout = setTimeout(() => {
                lastVisible = null;
                performSearch(searchText, true);
            }, 300);
        }
        else {
            searchUserResults.innerHTML = '';
            searchUserResults.style.display = 'none';
        }
    });
}

async function performSearch(searchText, isNewSearch = false) {
    const searchUserResults = document.getElementById('searchUserResults');

    try {
        showSpinner();
        animateLoadingDots();

        let userQuery = query(
            collection(db, 'MovieVerseUsers'),
            where('email', '>=', searchText),
            where('email', '<=', searchText + '\uf8ff'),
            orderBy('email'),
            limit(initialFetchLimit)
        );

        if (!isNewSearch && lastVisible) {
            userQuery = query(userQuery, startAfter(lastVisible));
        }

        const querySnapshot = await getDocs(userQuery);

        if (isNewSearch) {
            searchUserResults.innerHTML = '';
        }

        if (!querySnapshot.empty) {
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        }

        for (const doc of querySnapshot.docs) {
            const user = doc.data();
            const userDiv = document.createElement('div');
            userDiv.className = 'user-search-result';
            userDiv.style.cursor = 'pointer';
            userDiv.addEventListener('click', () => loadMessages(user.email));

            const profileQuery = query(collection(db, 'profiles'), where('__name__', '==', user.email));
            const profileSnapshot = await getDocs(profileQuery);
            let imageUrl = '../../images/user-default.png';
            if (!profileSnapshot.empty) {
                const profileData = profileSnapshot.docs[0].data();
                imageUrl = profileData.profileImage || imageUrl;
            }

            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.width = '33%';
            img.style.borderRadius = '8px';
            userDiv.appendChild(img);

            const textDiv = document.createElement('div');
            textDiv.style.width = '67%';
            textDiv.style.textAlign = 'left';
            textDiv.innerHTML = `<strong>${user.email}</strong><p>${user.bio || ''}</p>`;
            userDiv.appendChild(textDiv);

            searchUserResults.appendChild(userDiv);
        }

        searchUserResults.style.display = 'block';
        hideSpinner();

        if (isNewSearch || !querySnapshot.empty && querySnapshot.size === initialFetchLimit) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.textContent = 'Load More';
            loadMoreButton.id = 'loadMoreButton';
            loadMoreButton.style.marginBottom = '20px';
            loadMoreButton.addEventListener('click', () => performSearch(searchText));
            searchUserResults.appendChild(loadMoreButton);

            if (searchUserResults.children.length >= maxTotalFetch) {
                loadMoreButton.style.display = 'none';
            }
        }
    }
    catch (error) {
        console.error("Error fetching user list: ", error);
        if (error.code === 'resource-exhausted') {
            const noUserSelected = document.getElementById('noUserSelected');
            if (noUserSelected) {
                noUserSelected.textContent = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
                noUserSelected.style.margin = '25px auto';
            }
            hideSpinner();
        }
    }
}

let previouslySelectedUserElement = null;

async function loadUserList() {
    try {
        showSpinner();
        animateLoadingDots();

        const userLimit = 5;
        const messageLimit = 30;

        const sentMessagesQuery = query(
            collection(db, "messages"),
            orderBy("timestamp", "desc"),
            where("sender", "==", currentUserEmail),
            limit(messageLimit)
        );
        const receivedMessagesQuery = query(
            collection(db, "messages"),
            orderBy("timestamp", "desc"),
            where("recipient", "==", currentUserEmail),
            limit(messageLimit)
        );

        const [sentMessagesSnapshot, receivedMessagesSnapshot] = await Promise.all([
            getDocs(sentMessagesQuery),
            getDocs(receivedMessagesQuery)
        ]);

        let userEmails = new Set();
        sentMessagesSnapshot.forEach(doc => userEmails.add(doc.data().recipient));
        receivedMessagesSnapshot.forEach(doc => userEmails.add(doc.data().sender));

        let users = [];
        for (let email of userEmails) {
            if (email) {
                const userQuery = query(collection(db, "MovieVerseUsers"), where("email", "==", email));
                const userSnapshot = await getDocs(userQuery);
                userSnapshot.forEach(doc => {
                    let userData = doc.data();
                    if (userData.email) {
                        users.push(userData);
                    }
                });
            }
        }

        users.sort((a, b) => {
            const aLastMessage = [...sentMessagesSnapshot.docs, ...receivedMessagesSnapshot.docs].find(doc => doc.data().sender === a.email || doc.data().recipient === a.email);
            const bLastMessage = [...sentMessagesSnapshot.docs, ...receivedMessagesSnapshot.docs].find(doc => doc.data().sender === b.email || doc.data().recipient === b.email);
            return (bLastMessage?.data().timestamp.toDate() || 0) - (aLastMessage?.data().timestamp.toDate() || 0);
        });

        users = users.slice(0, userLimit);

        userListDiv.innerHTML = '';
        for (const user of users) {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.setAttribute('data-email', user.email);
            userElement.onclick = () => {
                if (previouslySelectedUserElement) {
                    previouslySelectedUserElement.classList.remove('selected');
                    previouslySelectedUserElement.style.backgroundColor = '';
                }
                selectedUserEmail = user.email;
                loadMessages(user.email);
                document.querySelectorAll('.user').forEach(u => u.classList.remove('selected'));
                userElement.classList.add('selected');
                userElement.style.backgroundColor = '#ff8623';
                previouslySelectedUserElement = userElement;
            };

            const profileQuery = query(collection(db, 'profiles'), where('__name__', '==', user.email));
            const profileSnapshot = await getDocs(profileQuery);
            let imageUrl = '../../images/user-default.png';
            if (!profileSnapshot.empty) {
                const profileData = profileSnapshot.docs[0].data();
                imageUrl = profileData.profileImage || imageUrl;
            }

            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.width = '50px';
            img.style.borderRadius = '25px';
            img.style.marginRight = '10px';
            userElement.appendChild(img);

            const emailDiv = document.createElement('div');
            emailDiv.textContent = user.email;
            userElement.appendChild(emailDiv);

            userListDiv.appendChild(userElement);
        }

        hideSpinner();
    }
    catch (error) {
        console.error("Error fetching user list: ", error);
        if (error.code === 'resource-exhausted') {
            const noUserSelected = document.getElementById('noUserSelected');
            if (noUserSelected) {
                noUserSelected.textContent = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
            }
            hideSpinner();
        }
    }
}

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}
