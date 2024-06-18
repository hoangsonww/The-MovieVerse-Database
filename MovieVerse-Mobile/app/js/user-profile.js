import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, query, collection, where, getDocs, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAverageMovieRating } from './ratings-module.js';
import { getTriviaStats } from './triviaModule.js';

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

function translateFBC(value) {
    return atob(value);
}

function getFBConfig1() {
    const fbConfig1 = "QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw==";
    return translateFBC(fbConfig1);
}

function getFBConfig2() {
    const fbConfig2 = "bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t";
    return translateFBC(fbConfig2);
}

function getFBConfig3() {
    const fbConfig3 = "bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20=";
    return translateFBC(fbConfig3);
}

function getFBConfig4() {
    const fbConfig4 = "ODAyOTQzNzE4ODcx";
    return translateFBC(fbConfig4);
}

function getFBConfig5() {
    const fbConfig5 = "MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=";
    return translateFBC(fbConfig5);
}

const firebaseConfig = {
    apiKey: getFBConfig1(),
    authDomain: getFBConfig2(),
    projectId: "movieverse-app",
    storageBucket: getFBConfig3(),
    messagingSenderId: getFBConfig4(),
    appId: getFBConfig5()
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    handleProfileDisplay();
    setupEventListeners();
    setupSearchListeners();
});

function updateProgressCircles(movieRating, triviaScore) {
    const movieRatingPercent = movieRating;
    const triviaScorePercent = triviaScore;

    setProgress(document.getElementById('avgMovieRatingCircle'), document.getElementById('avgMovieRatingText'), movieRatingPercent);
    setProgress(document.getElementById('avgTriviaScoreCircle'), document.getElementById('avgTriviaScoreText'), triviaScorePercent);
}

function setProgress(circle, text, percent) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.transition = 'none';
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    circle.getBoundingClientRect();

    setTimeout(() => {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.transition = 'stroke-dashoffset 0.6s ease-out, stroke 0.6s ease';
        circle.style.strokeDashoffset = offset;
        circle.style.setProperty('--progress-color', percent > 50 ? '#4CAF50' : '#2196F3');
        text.textContent = `${Math.round(percent)}%`;
        text.style.opacity = 1;
    }, 10);
}

function handleProfileDisplay() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const signInPrompt = document.getElementById('signInPrompt');
    const viewMyProfileBtn = document.getElementById('viewMyProfileBtn');
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.style.display = 'none';

    showSpinner();

    if (isSignedIn && userEmail) {
        loadProfile(userEmail);
        viewMyProfileBtn.disabled = false;
        viewMyProfileBtn.style.display = 'block';
    }
    else {
        welcomeMessage.textContent = 'Please sign in to view your profile';
        signInPrompt.style.display = 'block';
        viewMyProfileBtn.disabled = true;
        viewMyProfileBtn.style.display = 'none';
    }

    document.getElementById('viewMyProfileBtn').addEventListener('click', () => {
        loadCurrentUserProfile();
    });

    function loadCurrentUserProfile() {
        const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
        if (currentUserEmail) {
            loadProfile(currentUserEmail);
        }
        else {
            console.error("No user is currently signed in");
        }
    }

    hideSpinner();
}

function setupSearchListeners() {
    try {
        const searchUserInput = document.getElementById('searchUserInput');
        const searchUserResults = document.getElementById('searchUserResults');

        searchUserInput.addEventListener('input', () => {
            const searchText = searchUserInput.value.trim();

            if (searchText) {
                performSearch(searchText);
            }
            else {
                searchUserResults.innerHTML = '';
                searchUserResults.style.display = 'none';
            }
        });
    }
    catch (error) {
        console.error("Error fetching user list: ", error);
        if (error.code === 'resource-exhausted') {
            const noUserSelected = document.getElementById('profileContainer');
            if (noUserSelected) {
                noUserSelected.innerHTML = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
                noUserSelected.style.height = '350px';
            }
        }
    }
}

async function performSearch(searchText) {
    const searchUserResults = document.getElementById('searchUserResults');
    const db = getFirestore();
    showSpinner();

    try {
        const userQuery = query(collection(db, 'profiles'), where('username', '>=', searchText), where('username', '<=', searchText + '\uf8ff'));
        const querySnapshot = await getDocs(userQuery);

        searchUserResults.innerHTML = '';
        if (querySnapshot.empty) {
            searchUserResults.innerHTML = `<div style="text-align: center; font-weight: bold">No User with Username "${searchText}" found</div>`;
            searchUserResults.style.display = 'block';
        }
        else {
            searchUserResults.style.display = 'block';
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const userDiv = document.createElement('div');
                userDiv.className = 'user-search-result';
                userDiv.style.cursor = 'pointer';
                userDiv.addEventListener('click', () => loadProfile(doc.id));

                const img = document.createElement('img');
                img.src = user.profileImage || '../../images/user-default.png';
                img.style.width = '33%';
                img.style.borderRadius = '8px';
                userDiv.appendChild(img);

                const textDiv = document.createElement('div');
                textDiv.style.width = '67%';
                textDiv.style.textAlign = 'left';
                textDiv.innerHTML = `<strong style="font-size: 16px">${user.username}</strong><p style="margin-top: 5px; text-align: left; font-size: 16px">Bio: ${user.bio || 'Not Set'}</p>`;
                userDiv.appendChild(textDiv);

                searchUserResults.appendChild(userDiv);
            });
        }
        hideSpinner();
    }
    catch (error) {
        console.error("Error during search: ", error);
        searchUserResults.innerHTML = `<div style="text-align: center; font-weight: bold">Error in searching: ${error.message}</div>`;
        searchUserResults.style.display = 'block';
        hideSpinner();
    }
}

document.getElementById('container1').addEventListener('click', async () => {
    const userEmail = localStorage.getItem('currentlyViewingProfile');

    if (!userEmail) {
        console.error('No user email found');
        return;
    }

    try {
        const rating = await getAverageMovieRating(userEmail);
        const convertRatingToPercent = (rating / 5) * 100;
        const averageRating = convertRatingToPercent.toFixed(1);

        const triviaStats = await getTriviaStats(userEmail);

        let averageTriviaScore = 0;
        if (triviaStats.totalAttempted > 0) {
            averageTriviaScore = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
        }

        updateProgressCircles(averageRating, averageTriviaScore, 'container1');
    }
    catch (error) {
        console.error('Error updating progress circles:', error);
    }
});

document.getElementById('container2').addEventListener('click', async () => {
    const userEmail = localStorage.getItem('currentlyViewingProfile');

    if (!userEmail) {
        console.error('No user email found');
        return;
    }

    try {
        const rating = await getAverageMovieRating(userEmail);
        const convertRatingToPercent = (rating / 5) * 100;
        const averageRating = convertRatingToPercent.toFixed(1);

        const triviaStats = await getTriviaStats(userEmail);

        let averageTriviaScore = 0;
        if (triviaStats.totalAttempted > 0) {
            averageTriviaScore = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
        }

        updateProgressCircles(averageRating, averageTriviaScore, 'container2');
    }
    catch (error) {
        console.error('Error updating progress circles:', error);
    }
});

async function loadProfile(userEmail = localStorage.getItem('currentlySignedInMovieVerseUser')) {
    try {
        showSpinner();

        document.getElementById('viewMyProfileBtn').disabled = false;

        if (!userEmail) return;

        const welcomeMessage = document.getElementById('welcomeMessage');
        const profileContainer = document.getElementById('profileContainer');
        const changeProfileImageBtn = document.getElementById('changeProfileImageBtn');
        const editProfileBtn = document.getElementById('editProfileBtn');
        const removeProfileImageBtn = document.getElementById('removeProfileImage');
        const profileImage = document.getElementById('profileImage');

        if (userEmail !== localStorage.getItem('currentlySignedInMovieVerseUser') || !localStorage.getItem('currentlySignedInMovieVerseUser') || !JSON.parse(localStorage.getItem('isSignedIn'))) {
            changeProfileImageBtn.style.display = 'none';
            editProfileBtn.style.display = 'none';
            profileImage.removeAttribute('onclick');
            profileImage.style.cursor = 'default';
            profileImage.title = 'Sign in to change profile image';
        }
        else {
            changeProfileImageBtn.style.display = '';
            editProfileBtn.style.display = '';
            profileImage.setAttribute('onclick', 'document.getElementById("imageUpload").click()');
            profileImage.style.cursor = 'pointer';
            profileImage.title = 'Click to change profile image';
        }

        profileContainer.style.display = 'block';

        const docRef = doc(db, 'profiles', userEmail);
        const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
        const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

        let followUnfollowBtn = document.getElementById('followUnfollowBtn');
        if (!followUnfollowBtn) {
            followUnfollowBtn = document.createElement('button');
            followUnfollowBtn.id = 'followUnfollowBtn';
            followUnfollowBtn.style.width = '100%';
            profileContainer.appendChild(followUnfollowBtn);
        }

        if (currentUserEmail && userEmail !== currentUserEmail && isSignedIn) {
            const followingRef = doc(db, 'profiles', currentUserEmail, 'following', userEmail);
            const followersRef = doc(db, 'profiles', userEmail, 'followers', currentUserEmail);

            const followSnap = await getDoc(followingRef);
            let isFollowing = followSnap.exists();

            followUnfollowBtn.textContent = isFollowing ? 'Unfollow' : 'Follow';
            followUnfollowBtn.style.display = 'block';

            followUnfollowBtn.onclick = async () => {
                if (isFollowing) {
                    await deleteDoc(followingRef);
                    await deleteDoc(followersRef);
                    followUnfollowBtn.textContent = 'Follow';
                    isFollowing = false;
                    await displayUserList('followers', userEmail);
                }
                else {
                    const timestamp = serverTimestamp();
                    await setDoc(followingRef, {timestamp: timestamp});
                    await setDoc(followersRef, {timestamp: timestamp});
                    followUnfollowBtn.textContent = 'Unfollow';
                    isFollowing = true;
                    await displayUserList('followers', userEmail);
                }
            };
        }
        else {
            followUnfollowBtn.style.display = 'none';
        }

        const rating = await getAverageMovieRating(userEmail);
        const convertRatingToPercent = (rating / 5) * 100;
        const averageRating = convertRatingToPercent.toFixed(1);

        const triviaStats = await getTriviaStats(userEmail);

        let averageTriviaScore = 0;
        if (triviaStats.totalAttempted > 0) {
            averageTriviaScore = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
        }

        localStorage.setItem('currentlyViewingProfile', userEmail);

        updateProgressCircles(averageRating, averageTriviaScore);

        try {
            const docSnap = await getDoc(docRef);
            let profile = {
                username: 'N/A',
                dob: 'N/A',
                bio: 'N/A',
                favoriteGenres: 'N/A',
                location: 'N/A',
                favoriteMovie: 'N/A',
                hobbies: 'N/A',
                favoriteActor: 'N/A',
                favoriteDirector: 'N/A',
                personalQuote: 'N/A',
                profileImage: '../../images/user-default.png'
            };

            if (docSnap.exists()) {
                profile = {...profile, ...docSnap.data()};
                const imageUrl = profile.profileImage || '../../images/user-default.png';
                document.getElementById('profileImage').src = imageUrl;

                if (userEmail !== localStorage.getItem('currentlySignedInMovieVerseUser') || !localStorage.getItem('currentlySignedInMovieVerseUser') || !JSON.parse(localStorage.getItem('isSignedIn')) || profile.profileImage === '../../images/user-default.png') {
                    removeProfileImageBtn.style.display = 'none';
                } else {
                    removeProfileImageBtn.style.display = 'inline';
                }

                document.getElementById('usernameDisplay').innerHTML = `<strong>Username:</strong> ${profile.username}`;
                document.getElementById('dobDisplay').innerHTML = `<strong>Date of Birth:</strong> ${profile.dob}`;
                document.getElementById('bioDisplay').innerHTML = `<strong>Bio:</strong> ${profile.bio}`;
                document.getElementById('favoriteGenresDisplay').innerHTML = `<strong>Favorite Genres:</strong> ${profile.favoriteGenres}`;
                document.getElementById('locationDisplay').innerHTML = `<strong>Location:</strong> ${profile.location}`;
                document.getElementById('favoriteMovieDisplay').innerHTML = `<strong>Favorite Movie:</strong> ${profile.favoriteMovie}`;
                document.getElementById('hobbiesDisplay').innerHTML = `<strong>Hobbies:</strong> ${profile.hobbies}`;
                document.getElementById('favoriteActorDisplay').innerHTML = `<strong>Favorite Actor:</strong> ${profile.favoriteActor}`;
                document.getElementById('favoriteDirectorDisplay').innerHTML = `<strong>Favorite Director:</strong> ${profile.favoriteDirector}`;
                document.getElementById('personalQuoteDisplay').innerHTML = `<strong>Personal Quote:</strong> ${profile.personalQuote}`;
                window.document.title = `${profile.username !== 'N/A' ? profile.username : 'User'}'s Profile - The MovieVerse`;

                if (userEmail === localStorage.getItem('currentlySignedInMovieVerseUser')) {
                    welcomeMessage.textContent = `Welcome, ${profile.username}!`;
                } else {
                    welcomeMessage.textContent = `Viewing ${profile.username}'s profile`;
                }

                await displayUserList('following', userEmail);
                await displayUserList('followers', userEmail);
            }
            else {
                const imageUrl = profile.profileImage || '../../images/user-default.png';
                document.getElementById('profileImage').src = imageUrl;

                if (userEmail !== localStorage.getItem('currentlySignedInMovieVerseUser') || !localStorage.getItem('currentlySignedInMovieVerseUser') || !JSON.parse(localStorage.getItem('isSignedIn')) || profile.profileImage === '../../images/user-default.png') {
                    removeProfileImageBtn.style.display = 'none';
                }
                else {
                    removeProfileImageBtn.style.display = 'inline';
                }

                document.getElementById('usernameDisplay').innerHTML = `<strong>Username:</strong> N/A`;
                document.getElementById('dobDisplay').innerHTML = `<strong>Date of Birth:</strong> N/A`;
                document.getElementById('bioDisplay').innerHTML = `<strong>Bio:</strong> N/A`;
                document.getElementById('favoriteGenresDisplay').innerHTML = `<strong>Favorite Genres:</strong> N/A`;
                document.getElementById('locationDisplay').innerHTML = `<strong>Location:</strong> N/A`;
                document.getElementById('favoriteMovieDisplay').innerHTML = `<strong>Favorite Movie:</strong> N/A`;
                document.getElementById('hobbiesDisplay').innerHTML = `<strong>Hobbies:</strong> N/A`;
                document.getElementById('favoriteActorDisplay').innerHTML = `<strong>Favorite Actor:</strong> N/A`;
                document.getElementById('favoriteDirectorDisplay').innerHTML = `<strong>Favorite Director:</strong> N/A`;
                document.getElementById('personalQuoteDisplay').innerHTML = `<strong>Personal Quote:</strong> N/A`;
                window.document.title = `${profile.username !== 'N/A' ? profile.username : 'User'}'s Profile - The MovieVerse`;

                if (userEmail === localStorage.getItem('currentlySignedInMovieVerseUser')) {
                    welcomeMessage.textContent = `Welcome, ${profile.username}!`;
                }
                else {
                    welcomeMessage.textContent = `Viewing ${profile.username}'s profile`;
                }

                await displayUserList('following', userEmail);
                await displayUserList('followers', userEmail);
            }
        }
        catch (error) {
            if (error.code === 'resource-exhausted') {
                const noUserSelected = document.getElementById('profileContainer');
                if (noUserSelected) {
                    noUserSelected.innerHTML = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
                    noUserSelected.style.height = '350px';
                }
                hideSpinner();
            }

            document.getElementById('viewMyProfileBtn').disabled = true;
        }

        hideSpinner();
    }
    catch (error) {
        console.error("Error fetching user list: ", error);
        if (error.code === 'resource-exhausted') {
            const noUserSelected = document.getElementById('profileContainer');
            if (noUserSelected) {
                noUserSelected.innerHTML = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
                noUserSelected.style.height = '350px';
            }
            hideSpinner();
        }

        document.getElementById('viewMyProfileBtn').disabled = true;
    }
}

async function displayUserList(listType, userEmail) {
    showSpinner();

    const db = getFirestore();
    const listRef = collection(db, 'profiles', userEmail, listType);
    const snapshot = await getDocs(listRef);
    const userListSpan = document.getElementById(`${listType}List`);

    userListSpan.innerHTML = '';

    if (snapshot.empty) {
        userListSpan.textContent = 'N/A';
    }
    else {
        for (let docSnapshot of snapshot.docs) {
            const userRef = doc(db, 'profiles', docSnapshot.id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();

                const userLink = document.createElement('a');
                userLink.textContent = userData.username;
                userLink.href = '#';
                userLink.id = "userLink"
                userLink.style.cursor = 'pointer';
                userLink.onclick = () => loadProfile(docSnapshot.id);

                userListSpan.appendChild(userLink);
                userListSpan.appendChild(document.createTextNode(', '));
            }
        }

        if (userListSpan.lastChild) {
            userListSpan.removeChild(userListSpan.lastChild);
        }
    }

    hideSpinner();
}

async function saveProfileChanges() {
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (!userEmail) return;

    const profileRef = doc(db, 'profiles', userEmail);
    const currentDoc = await getDoc(profileRef);
    const currentProfile = currentDoc.exists() ? currentDoc.data() : null;

    const newUsername = document.getElementById('editUsername').value.trim();

    if (currentProfile && currentProfile.username && currentProfile.username !== 'N/A' && !newUsername) {
        alert("You cannot delete your username. Please enter a valid username.");
        document.getElementById('editUsername').value = currentProfile.username;
        return;
    }

    const profile = {
        username: newUsername || currentProfile.username,
        dob: document.getElementById('editDob').value,
        bio: document.getElementById('editBio').value,
        favoriteGenres: document.getElementById('editFavoriteGenres').value.split(',').map(genre => genre.trim()),
        location: document.getElementById('editLocation').value,
        favoriteMovie: document.getElementById('editFavoriteMovie').value,
        hobbies: document.getElementById('editHobbies').value.split(',').map(hobby => hobby.trim()),
        favoriteActor: document.getElementById('editFavoriteActor').value,
        favoriteDirector: document.getElementById('editFavoriteDirector').value,
        personalQuote: document.getElementById('editPersonalQuote').value,
    };

    try {
        await setDoc(profileRef, profile, { merge: true });
        console.log("Profile updated successfully.");
        closeModal();
        loadProfile();
    }
    catch (error) {
        console.log("Error updating profile: ", error);
    }
}

async function removeProfileImage() {
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (!userEmail) return;

    const defaultImageUrl = '../../images/user-default.png';

    try {
        await setDoc(doc(db, 'profiles', userEmail), { profileImage: defaultImageUrl }, { merge: true });

        document.getElementById('profileImage').src = defaultImageUrl;
        document.getElementById('removeProfileImage').style.display = 'none';

        console.log('Profile image reset to default successfully');
    }
    catch (error) {
        console.log("Error removing image: ", error);
    }
}

async function uploadImage() {
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (!userEmail) {
        alert("You're not signed in.");
        return;
    }

    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (!file) {
        alert('No file selected. Please choose an image.');
        return;
    }

    try {
        const base64Image = await resizeImageAndConvertToBase64(file, 1024, 1024);

        await setDoc(doc(db, 'profiles', userEmail), { profileImage: base64Image }, { merge: true });

        document.getElementById('profileImage').src = base64Image;
        console.log('Image processed and Firestore updated');
        window.location.reload();
    }
    catch (error) {
        console.log("Error during image processing:", error);
        alert('Error during image processing: ' + error.message);
    }
}

function resizeImageAndConvertToBase64(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                }
                else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function setupEventListeners() {
    document.getElementById('saveChanges').addEventListener('click', async () => {
        await saveProfileChanges();
    });

    document.getElementById('cancelEdit').addEventListener('click', () => {
        closeModal();
    });

    const imageUploadInput = document.getElementById('imageUpload');
    imageUploadInput.addEventListener('change', uploadImage);

    document.getElementById('editProfileBtn').addEventListener('click', async () => {
        const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
        if (!userEmail) {
            alert("You're not signed in.");
            return;
        }

        try {
            const docRef = doc(db, 'profiles', userEmail);
            const docSnap = await getDoc(docRef);

            let profile = {
                username: 'N/A',
                dob: '',
                bio: 'N/A',
                favoriteGenres: [],
                location: 'N/A',
                favoriteMovie: 'N/A',
                hobbies: ['N/A'],
                favoriteActor: 'N/A',
                favoriteDirector: 'N/A',
                personalQuote: 'N/A',
                profileImage: '../../images/user-default.png'
            };

            if (docSnap.exists()) {
                profile = docSnap.data();
                profile.hobbies = profile.hobbies.length > 0 ? profile.hobbies : ['N/A'];
            }

            document.getElementById('editUsername').value = profile.username;
            document.getElementById('editDob').value = profile.dob;
            const defaultDOB = new Date();
            defaultDOB.setFullYear(defaultDOB.getFullYear() - 18);
            const defaultDOBString = defaultDOB.toISOString().split('T')[0];

            document.getElementById('editDob').value = profile.dob || defaultDOBString;
            document.getElementById('editBio').value = profile.bio;
            document.getElementById('editFavoriteGenres').value = profile.favoriteGenres.join(', ');
            document.getElementById('editLocation').value = profile.location;
            document.getElementById('editFavoriteMovie').value = profile.favoriteMovie;
            document.getElementById('editHobbies').value = profile.hobbies.join(', ');
            document.getElementById('editFavoriteActor').value = profile.favoriteActor;
            document.getElementById('editFavoriteDirector').value = profile.favoriteDirector;
            document.getElementById('editPersonalQuote').value = profile.personalQuote;
            document.getElementById('profileImage').src = profile.profileImage || '../../images/user-default.png';
            document.getElementById('editProfileModal').style.display = 'block';
        }
        catch (error) {
            console.log("Error accessing Firestore: ", error);
        }
    });

    document.getElementById('imageUpload').addEventListener('change', async () => {
        await uploadImage();
    });

    document.getElementById('removeProfileImage').addEventListener('click', async () => {
        await removeProfileImage();
    });
}
