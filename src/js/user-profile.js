document.addEventListener('DOMContentLoaded', function() {
    handleProfileDisplay();
    setupEventListeners();
});

function handleProfileDisplay() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
    const userEmail = localStorage.getItem('currentUserEmail');
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
    }
    else {
        welcomeMessage.textContent = '';
        profileContainer.style.display = 'none';
        signInPrompt.textContent = 'Please sign in to view your profile';
        signInPrompt.style.fontWeight = '800';
    }
}

function loadProfile() {
    const userEmail = localStorage.getItem('currentUserEmail');
    const profileKey = `profileInfo-${userEmail}`;
    const profileImageKey = `profileImage-${userEmail}`;

    const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
    const profileImage = localStorage.getItem(profileImageKey) || '../../images/user-default.png';

    document.getElementById('profileImage').src = profileImage;
    document.getElementById('removeProfileImage').style.display = profileImage !== '../../images/user-default.png' ? 'inline' : 'none';

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

function saveProfileChanges() {
    const userEmail = localStorage.getItem('currentUserEmail');
    const profileKey = `profileInfo-${userEmail}`;

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
        personalQuote: document.getElementById('editPersonalQuote').value,
    };

    localStorage.setItem(profileKey, JSON.stringify(profile));
    closeModal();
    loadProfile();
    window.location.reload();
}

function closeModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function removeProfileImage() {
    const userEmail = localStorage.getItem('currentUserEmail');
    const profileImageKey = `profileImage-${userEmail}`;

    localStorage.removeItem(profileImageKey);
    document.getElementById('profileImage').src = '../../images/user-default.png';
    document.getElementById('removeProfileImage').style.display = 'none';
}

function uploadImage() {
    const file = document.getElementById('imageUpload').files[0];

    if (!file) {
        alert('No file selected. Please choose an image.');
        return;
    }

    function resizeImage(file, maxWidth, maxHeight, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
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

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(callback, 'image/jpeg', 0.7);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    if (file.size > 750 * 1024) {
        resizeImage(file, 1024, 1024, function(resizedBlob) {
            const userEmail = localStorage.getItem('currentUserEmail');
            const profileImageKey = `profileImage-${userEmail}`;
            const reader = new FileReader();
            reader.onloadend = function() {
                localStorage.setItem(profileImageKey, reader.result);
                document.getElementById('profileImage').src = reader.result;
                document.getElementById('removeProfileImage').style.display = 'inline';
            };
            reader.readAsDataURL(resizedBlob);
        });
    }
    else {
        const reader = new FileReader();
        reader.onloadend = function() {
            const userEmail = localStorage.getItem('currentUserEmail');
            const profileImageKey = `profileImage-${userEmail}`;
            localStorage.setItem(profileImageKey, reader.result);
            document.getElementById('profileImage').src = reader.result;
            document.getElementById('removeProfileImage').style.display = 'inline';
        };
        reader.readAsDataURL(file);
    }
}

function setupEventListeners() {
    document.getElementById('saveChanges').addEventListener('click', saveProfileChanges);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);

    document.getElementById('editProfileBtn').addEventListener('click', function() {
        const userEmail = localStorage.getItem('currentUserEmail');
        const profileKey = `profileInfo-${userEmail}`;
        const profile = JSON.parse(localStorage.getItem(profileKey)) || {};

        document.getElementById('editUsername').value = profile.username || '';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('editDob').setAttribute('max', today);
        document.getElementById('editBio').value = profile.bio || '';
        document.getElementById('editFavoriteGenres').value = profile.favoriteGenres || '';
        document.getElementById('editLocation').value = profile.location || '';
        document.getElementById('editFavoriteMovie').value = profile.favoriteMovie || '';
        document.getElementById('editHobbies').value = profile.hobbies || '';
        document.getElementById('editFavoriteActor').value = profile.favoriteActor || '';
        document.getElementById('editFavoriteDirector').value = profile.favoriteDirector || '';
        document.getElementById('editPersonalQuote').value = profile.personalQuote || '';

        document.getElementById('editProfileModal').style.display = 'block';
    });

    document.getElementById('imageUpload').addEventListener('change', uploadImage);
    document.getElementById('removeProfileImage').addEventListener('click', removeProfileImage);
}
