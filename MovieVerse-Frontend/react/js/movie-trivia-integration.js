/**
 * Movie Trivia Integration Module
 * Adds contextual AI-powered trivia to movie detail pages
 */

/**
 * Add trivia section to movie detail page
 * @param {number} movieId - The movie ID
 * @param {string} containerId - ID of the container element to add trivia to
 */
async function addMovieTrivia(movieId, containerId = 'trivia-container') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn('Trivia container not found, creating one');
        const mainContent = document.getElementById('main') || document.body;
        const triviaDiv = document.createElement('div');
        triviaDiv.id = containerId;
        triviaDiv.className = 'movie-trivia-section';
        mainContent.appendChild(triviaDiv);
    }

    try {
        const response = await fetch(`/api/agent/trivia/?movie_id=${movieId}`);
        const data = await response.json();

        if (data.success && data.trivia) {
            renderMovieTrivia(data.trivia, containerId);
        }
    } catch (error) {
        console.error('Error loading movie trivia:', error);
    }
}

/**
 * Render trivia in the container
 * @param {Object} trivia - Trivia data
 * @param {string} containerId - Container element ID
 */
function renderMovieTrivia(trivia, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let triviaHTML = '';

    if (trivia.type === 'movie_specific') {
        triviaHTML = `
            <div class="movie-trivia-card">
                <div class="trivia-header">
                    <span class="trivia-icon">🎬</span>
                    <h3>Movie Facts</h3>
                </div>
                <div class="trivia-content">
                    <ul class="trivia-facts-list">
                        ${trivia.facts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    } else {
        triviaHTML = `
            <div class="movie-trivia-card">
                <div class="trivia-header">
                    <span class="trivia-icon">💡</span>
                    <h3>Cinema Trivia</h3>
                </div>
                <div class="trivia-content">
                    <p>${trivia.message}</p>
                </div>
            </div>
        `;
    }

    container.innerHTML = triviaHTML;
}

/**
 * Add "On This Day" trivia banner
 * @param {string} containerId - Container element ID
 */
async function addOnThisDayTrivia(containerId = 'on-this-day-container') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn('On This Day container not found');
        return;
    }

    try {
        const response = await fetch('/api/agent/trivia/?context=on_this_day');
        const data = await response.json();

        if (data.success && data.trivia && data.trivia.type === 'on_this_day') {
            const trivia = data.trivia;
            
            const triviaHTML = `
                <div class="on-this-day-banner">
                    <div class="banner-icon">📅</div>
                    <div class="banner-content">
                        <h4>On This Day in Cinema</h4>
                        <p>${trivia.message}</p>
                        ${trivia.movieId ? `
                            <a href="./movie-details.html?id=${trivia.movieId}" class="banner-link">
                                Learn more →
                            </a>
                        ` : ''}
                    </div>
                    ${trivia.posterPath ? `
                        <img src="https://image.tmdb.org/t/p/w200${trivia.posterPath}" 
                             alt="${trivia.title}" 
                             class="banner-poster">
                    ` : ''}
                </div>
            `;
            
            container.innerHTML = triviaHTML;
        }
    } catch (error) {
        console.error('Error loading On This Day trivia:', error);
    }
}

/**
 * Initialize trivia on page load
 */
function initializeMovieTrivia() {
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        addMovieTrivia(movieId);
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMovieTrivia);
} else {
    initializeMovieTrivia();
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addMovieTrivia,
        addOnThisDayTrivia,
        initializeMovieTrivia
    };
}
