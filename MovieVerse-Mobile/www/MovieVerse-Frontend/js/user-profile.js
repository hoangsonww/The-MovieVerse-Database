import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
});

function handleProfileDisplay() {
    showSpinner();
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const profileKey = `profileInfo-${userEmail}`;
    const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
    const welcomeMessage = document.getElementById('welcomeMessage');
    const profileContainer = document.getElementById('profileContainer');
    const signInPrompt = document.getElementById('signInPrompt');

    if (isSignedIn && userEmail) {
        welcomeMessage.textContent = `Welcome, ${profile.username || 'User'}!`;
        profileContainer.style.display = 'block';
        signInPrompt.style.display = 'none';
        loadProfile();
        hideSpinner();
    }
    else {
        document.getElementById('welcomeMessage').textContent = '';
        document.getElementById('profileContainer').style.display = 'none';
        signInPrompt.textContent = 'Please sign in to view your profile';
        signInPrompt.style.fontWeight = '800';
        signInPrompt.style.color = '#ff8623';
        hideSpinner();
    }
}

async function loadProfile() {
    showSpinner();
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (!userEmail) return;

    const docRef = doc(db, 'profiles', userEmail);
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
            profile = { ...profile, ...docSnap.data() };
            const imageUrl = profile.profileImage || '../../images/user-default.png';
            document.getElementById('profileImage').src = imageUrl;

            profile.hobbies = profile.hobbies && profile.hobbies.length > 0 ? profile.hobbies.join(', ') : 'N/A';
        }

        document.getElementById('profileImage').src = profile.profileImage;
        document.getElementById('removeProfileImage').style.display = profile.profileImage && profile.profileImage !== '../../images/user-default.png' ? 'inline' : 'none';
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

    }
    catch (error) {
        console.error("Error loading profile: ", error);
    }

    hideSpinner();
}

async function saveProfileChanges() {
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (!userEmail) return;

    const profileRef = doc(db, 'profiles', userEmail);
    const profile = {
        username: document.getElementById('editUsername').value,
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
        console.error("Error updating profile: ", error);
    }
}

async function removeProfileImage() {
    const userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (!userEmail) return;

    const profileImageRef = ref(storage, `profileImages/${userEmail}`);

    try {
        await deleteObject(profileImageRef);
        console.log('File deleted successfully');
        await setDoc(doc(db, 'profiles', userEmail), { profileImage: deleteField() }, { merge: true });
        document.getElementById('profileImage').src = '../../images/user-default.png';
        document.getElementById('removeProfileImage').style.display = 'none';
    }
    catch (error) {
        console.error("Error removing image: ", error);
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

        await setDoc(doc(db, 'profiles', userEmail), { profileImageBase64: base64Image }, { merge: true });
        document.getElementById('profileImage').src = base64Image;

        console.log('Image processed and Firestore updated');
    }
    catch (error) {
        console.error("Error during image processing:", error);
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
            console.error("Error accessing Firestore: ", error);
        }
    });

    document.getElementById('imageUpload').addEventListener('change', async () => {
        await uploadImage();
    });

    document.getElementById('removeProfileImage').addEventListener('click', async () => {
        await removeProfileImage();
    });
}
