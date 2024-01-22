document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const resetEmail = document.getElementById('resetEmail').value;

    const accounts = JSON.parse(localStorage.getItem('accountsMovieVerse')) || [];
    if (!accounts.some(account => account.email === resetEmail)) {
        alert("No account with such credentials exists in our database, or you might have mistyped something. Please try again.");
        return;
    }

    document.getElementById('newPasswordFields').style.display = 'block';
});

function isValidPassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumbers &&
        hasSpecialChar
    );
}

function updatePassword() {
    const resetEmail = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (!isValidPassword(newPassword)) {
        alert('New password does not meet the security requirements.\n\n' +
            'Your password must include:\n' +
            '- At least 8 characters\n' +
            '- At least one uppercase letter\n' +
            '- At least one lowercase letter\n' +
            '- At least one number\n' +
            '- At least one special character (e.g., !@#$%^&*)');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match.");
        return;
    }

    let accounts = JSON.parse(localStorage.getItem('accountsMovieVerse')) || [];
    accounts = accounts.map(account => {
        if (account.email === resetEmail) {
            return { ...account, password: newPassword };
        }
        return account;
    });

    localStorage.setItem('accountsMovieVerse', JSON.stringify(accounts));
    alert("Password updated successfully!");
    window.location.href = '../html/sign-in.html';
}

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            fallbackMovieSelection();
        }
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        fallbackMovieSelection();
    }
}
