document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    setupEventListeners();
});

function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('profileInfo')) || {};
    const profileImage = localStorage.getItem('profileImage') || '../../images/user-default.png';
    document.getElementById('profileImage').src = profileImage;
    document.getElementById('removeProfileImage').style.display = profileImage !== '../../images/user-default.png' ? 'inline' : 'none';
    document.getElementById('profileImage').src = profileImage;
    document.getElementById('usernameDisplay').innerHTML = `<strong>Username:</strong> ${profile.username || 'N/A'}`;
    document.getElementById('dobDisplay').innerHTML = `<strong>Date of Birth:</strong> ${profile.dob || 'N/A'}`;
    document.getElementById('bioDisplay').innerHTML = `<strong>Bio:</strong> ${profile.bio || 'N/A'}`;
    document.getElementById('favoriteGenresDisplay').innerHTML = `<strong>Favorite Genres:</strong> ${profile.favoriteGenres || 'N/A'}`;
    document.getElementById('locationDisplay').innerHTML = `<strong>Location:</strong> ${profile.location || 'N/A'}`;
    document.getElementById('favoriteMovieDisplay').innerHTML = `<strong>Favorite Movie:</strong> ${profile.favoriteMovie || 'N/A'}`;
    document.getElementById('hobbiesDisplay').innerHTML = `<strong>Hobbies:</strong> ${profile.hobbies || 'N/A'}`;
    document.getElementById('favoriteActorDisplay').innerHTML = `<strong>Favorite Actor:</strong> ${profile.favoriteActor || 'N/A'}`;
    document.getElementById('favoriteDirectorDisplay').innerHTML = `<strong>Favorite Director:</strong> ${profile.favoriteDirector || 'N/A'}`;
    document.getElementById('personalQuoteDisplay').innerHTML = `<strong>Personal Quote:</strong> ${profile.personalQuote || 'N/A'}`;
}

function removeProfileImage() {
    localStorage.removeItem('profileImage');
    document.getElementById('profileImage').src = '../../images/user-default.png';
    document.getElementById('removeProfileImage').style.display = 'none';
}

function setupEventListeners() {
    document.getElementById('saveChanges').addEventListener('click', saveProfileChanges);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);
    document.getElementById('editProfileBtn').addEventListener('click', openEditModal);
    document.getElementById('imageUpload').addEventListener('change', uploadImage);
}

function openEditModal() {
    const profile = JSON.parse(localStorage.getItem('profileInfo')) || {};
    document.getElementById('editUsername').value = profile.username || '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('editDob').setAttribute('max', today);
    document.getElementById('editBio').value = profile.bio || '';
    document.getElementById('editFavoriteGenres').value = profile.favoriteGenres || '';
    document.getElementById('editProfileModal').style.display = 'block';
    document.getElementById('editLocation').value = profile.location || '';
    document.getElementById('editFavoriteMovie').value = profile.favoriteMovie || '';
    document.getElementById('editHobbies').value = profile.hobbies || '';
    document.getElementById('editFavoriteActor').value = profile.favoriteActor || '';
    document.getElementById('editFavoriteDirector').value = profile.favoriteDirector || '';
    document.getElementById('editPersonalQuote').value = profile.personalQuote || '';
}

function saveProfileChanges() {
    const profile = {
        username: document.getElementById('editUsername').value,
        dob: document.getElementById('editDob').value,
        bio: document.getElementById('editBio').value,
        favoriteGenres: document.getElementById('editFavoriteGenres').value,
        location: document.getElementById('editLocation').value,
        favoriteMovie: document.getElementById('editFavoriteMovie').value,
        hobbies: document.getElementById('editHobbies').value,
        favoriteActor: document.getElementById('editFavoriteActor').value,
        favoriteDirector: document.getElementById('editFavoriteDirector').value,
        personalQuote: document.getElementById('editPersonalQuote').value
    };

    localStorage.setItem('profileInfo', JSON.stringify(profile));
    closeModal();
    loadProfile();
}

function closeModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function uploadImage() {
    const file = document.getElementById('imageUpload').files[0];
    if (file && file.size <= 750 * 1024 * 1024) { // 750MB
        const reader = new FileReader();
        reader.onloadend = function() {
            localStorage.setItem('profileImage', reader.result);
            document.getElementById('profileImage').src = reader.result;
            document.getElementById('removeProfileImage').style.display = 'inline';
        };
        reader.readAsDataURL(file);
    } else {
        alert('File is too large or not an image. Please choose another file.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    handleProfileDisplay();
    setupEventListeners();
});

function handleProfileDisplay() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
    const profile = JSON.parse(localStorage.getItem('profileInfo')) || {};
    const welcomeMessage = document.getElementById('welcomeMessage');
    const profileContainer = document.getElementById('profileContainer');
    const signInPrompt = document.getElementById('signInPrompt');

    if (isSignedIn) {
        welcomeMessage.textContent = `Welcome, ${profile.username || 'User'}!`;
        profileContainer.style.display = 'block';
        signInPrompt.style.display = 'none';
        loadProfile();
    }
    else {
        welcomeMessage.textContent = '';
        profileContainer.style.display = 'none';
        signInPrompt.textContent = 'Please sign in to view your profile';
        signInPrompt.style.fontWeight = '800';
    }
}