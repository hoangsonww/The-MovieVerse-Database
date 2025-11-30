/**
 * AI Assistant Module for MovieVerse
 * Provides intelligent, personalized movie recommendations and insights
 */

class MovieVerseAssistant {
    constructor() {
        this.apiBase = '/api/agent';
        this.userId = this.getUserId();
    }

    getUserId() {
        // Try to get user ID from localStorage or session
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                return JSON.parse(user).id || null;
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Get personalized movie recommendations
     * @param {Object} params - { timeAvailable, mood, limit }
     * @returns {Promise<Object>} Recommendations response
     */
    async getWhatToWatch(params = {}) {
        const queryParams = new URLSearchParams({
            ...(this.userId && { user_id: this.userId }),
            ...(params.timeAvailable && { time_available: params.timeAvailable }),
            ...(params.mood && { mood: params.mood }),
            limit: params.limit || 5
        });

        try {
            const response = await fetch(`${this.apiBase}/what-to-watch/?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get movie trivia
     * @param {Object} params - { movieId, context }
     * @returns {Promise<Object>} Trivia response
     */
    async getTrivia(params = {}) {
        const queryParams = new URLSearchParams({
            ...(params.movieId && { movie_id: params.movieId }),
            context: params.context || 'general'
        });

        try {
            const response = await fetch(`${this.apiBase}/trivia/?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching trivia:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get rewatch reminders
     * @param {number} limit - Number of reminders
     * @returns {Promise<Object>} Reminders response
     */
    async getRewatchReminders(limit = 5) {
        if (!this.userId) {
            return { success: false, error: 'User not logged in' };
        }

        const queryParams = new URLSearchParams({
            user_id: this.userId,
            limit: limit
        });

        try {
            const response = await fetch(`${this.apiBase}/rewatch-reminder/?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching rewatch reminders:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get weekly watchlist
     * @param {string} theme - Optional theme
     * @returns {Promise<Object>} Watchlist response
     */
    async getWeeklyWatchlist(theme = null) {
        const queryParams = new URLSearchParams({
            ...(theme && { theme: theme })
        });

        try {
            const response = await fetch(`${this.apiBase}/weekly-watchlist/?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weekly watchlist:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Render movie recommendation card
     * @param {Object} movie - Movie data
     * @returns {string} HTML string
     */
    renderMovieCard(movie) {
        const posterUrl = movie.posterPath 
            ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
            : 'https://via.placeholder.com/300x450?text=No+Image';

        return `
            <div class="assistant-movie-card" data-movie-id="${movie.movieId}">
                <img src="${posterUrl}" alt="${movie.title}" class="assistant-movie-poster">
                <div class="assistant-movie-info">
                    <h3 class="assistant-movie-title">${movie.title}</h3>
                    ${movie.voteAverage ? `<div class="assistant-movie-rating">⭐ ${movie.voteAverage}/10</div>` : ''}
                    ${movie.runtime ? `<div class="assistant-movie-runtime">⏱️ ${movie.runtime} min</div>` : ''}
                    ${movie.reasoning ? `<p class="assistant-movie-reason">${movie.reasoning}</p>` : ''}
                    ${movie.overview ? `<p class="assistant-movie-overview">${this.truncateText(movie.overview, 120)}</p>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render rewatch reminder card
     * @param {Object} reminder - Reminder data
     * @returns {string} HTML string
     */
    renderReminderCard(reminder) {
        const posterUrl = reminder.posterPath 
            ? `https://image.tmdb.org/t/p/w500${reminder.posterPath}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

        return `
            <div class="assistant-reminder-card" data-movie-id="${reminder.movieId}">
                <img src="${posterUrl}" alt="${reminder.title}" class="assistant-reminder-poster">
                <div class="assistant-reminder-info">
                    <h4 class="assistant-reminder-title">${reminder.title}</h4>
                    <p class="assistant-reminder-reason">${reminder.reason}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render trivia message
     * @param {Object} trivia - Trivia data
     * @returns {string} HTML string
     */
    renderTrivia(trivia) {
        if (trivia.type === 'on_this_day') {
            return `
                <div class="assistant-trivia on-this-day">
                    <div class="trivia-icon">📅</div>
                    <h3>On This Day in Cinema</h3>
                    <p class="trivia-message">${trivia.message}</p>
                    ${trivia.posterPath ? `
                        <img src="https://image.tmdb.org/t/p/w300${trivia.posterPath}" 
                             alt="${trivia.title}" 
                             class="trivia-poster">
                    ` : ''}
                </div>
            `;
        } else if (trivia.type === 'movie_specific') {
            return `
                <div class="assistant-trivia movie-specific">
                    <div class="trivia-icon">🎬</div>
                    <h3>Movie Facts: ${trivia.title}</h3>
                    <ul class="trivia-facts">
                        ${trivia.facts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            return `
                <div class="assistant-trivia general">
                    <div class="trivia-icon">💡</div>
                    <h3>Cinema Trivia</h3>
                    <p class="trivia-message">${trivia.message}</p>
                </div>
            `;
        }
    }

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Initialize assistant panel in the UI
     * @param {string} containerId - ID of container element
     */
    async initializeAssistantPanel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="assistant-panel">
                <div class="assistant-header">
                    <h2>🎬 Your Cinematic Assistant</h2>
                    <p>Personalized recommendations and insights just for you</p>
                </div>
                
                <div class="assistant-section">
                    <h3>What to Watch Now</h3>
                    <div class="assistant-controls">
                        <select id="assistant-mood">
                            <option value="">Any Mood</option>
                            <option value="action">Action</option>
                            <option value="comedy">Comedy</option>
                            <option value="thriller">Thriller</option>
                            <option value="drama">Drama</option>
                            <option value="scifi">Sci-Fi</option>
                            <option value="romance">Romance</option>
                            <option value="horror">Horror</option>
                        </select>
                        <select id="assistant-time">
                            <option value="">Any Length</option>
                            <option value="90">~90 minutes</option>
                            <option value="120">~2 hours</option>
                            <option value="150">~2.5 hours</option>
                            <option value="180">3+ hours</option>
                        </select>
                        <button id="assistant-refresh">🔄 Refresh</button>
                    </div>
                    <div id="assistant-recommendations" class="assistant-recommendations loading">
                        Loading recommendations...
                    </div>
                </div>

                <div class="assistant-section">
                    <h3>Cinema Trivia</h3>
                    <div id="assistant-trivia" class="assistant-trivia-container loading">
                        Loading trivia...
                    </div>
                </div>

                ${this.userId ? `
                    <div class="assistant-section">
                        <h3>Movies to Revisit</h3>
                        <div id="assistant-reminders" class="assistant-reminders loading">
                            Loading reminders...
                        </div>
                    </div>
                ` : ''}

                <div class="assistant-section">
                    <h3>Weekly Watchlist</h3>
                    <div id="assistant-weekly" class="assistant-weekly loading">
                        Loading weekly picks...
                    </div>
                </div>
            </div>
        `;

        // Set up event listeners
        this.setupEventListeners();

        // Load initial content
        await this.loadAllContent();
    }

    /**
     * Set up event listeners for the assistant panel
     */
    setupEventListeners() {
        const refreshBtn = document.getElementById('assistant-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshRecommendations());
        }

        const moodSelect = document.getElementById('assistant-mood');
        const timeSelect = document.getElementById('assistant-time');
        
        if (moodSelect) {
            moodSelect.addEventListener('change', () => this.refreshRecommendations());
        }
        
        if (timeSelect) {
            timeSelect.addEventListener('change', () => this.refreshRecommendations());
        }
    }

    /**
     * Load all assistant content
     */
    async loadAllContent() {
        await Promise.all([
            this.refreshRecommendations(),
            this.loadTrivia(),
            this.loadReminders(),
            this.loadWeeklyWatchlist()
        ]);
    }

    /**
     * Refresh recommendations based on current filters
     */
    async refreshRecommendations() {
        const recommendationsContainer = document.getElementById('assistant-recommendations');
        if (!recommendationsContainer) return;

        recommendationsContainer.innerHTML = '<div class="loading">Loading recommendations...</div>';

        const mood = document.getElementById('assistant-mood')?.value || null;
        const timeAvailable = document.getElementById('assistant-time')?.value || null;

        const response = await this.getWhatToWatch({
            mood,
            timeAvailable: timeAvailable ? parseInt(timeAvailable) : null,
            limit: 5
        });

        if (response.success && response.recommendations.length > 0) {
            recommendationsContainer.innerHTML = response.recommendations
                .map(movie => this.renderMovieCard(movie))
                .join('');
        } else {
            recommendationsContainer.innerHTML = '<p class="no-results">No recommendations available at the moment.</p>';
        }
    }

    /**
     * Load trivia content
     */
    async loadTrivia() {
        const triviaContainer = document.getElementById('assistant-trivia');
        if (!triviaContainer) return;

        const response = await this.getTrivia({ context: 'on_this_day' });

        if (response.success) {
            triviaContainer.innerHTML = this.renderTrivia(response.trivia);
        } else {
            triviaContainer.innerHTML = '<p class="error">Unable to load trivia.</p>';
        }
    }

    /**
     * Load rewatch reminders
     */
    async loadReminders() {
        const remindersContainer = document.getElementById('assistant-reminders');
        if (!remindersContainer) return;

        const response = await this.getRewatchReminders(5);

        if (response.success && response.reminders.length > 0) {
            remindersContainer.innerHTML = response.reminders
                .map(reminder => this.renderReminderCard(reminder))
                .join('');
        } else if (response.reminders && response.reminders.length === 0) {
            remindersContainer.innerHTML = '<p class="no-results">No rewatch reminders yet. Rate some movies to get started!</p>';
        } else {
            remindersContainer.innerHTML = '<p class="error">Unable to load reminders.</p>';
        }
    }

    /**
     * Load weekly watchlist
     */
    async loadWeeklyWatchlist() {
        const weeklyContainer = document.getElementById('assistant-weekly');
        if (!weeklyContainer) return;

        const response = await this.getWeeklyWatchlist();

        if (response.success && response.watchlist) {
            const watchlist = response.watchlist;
            weeklyContainer.innerHTML = `
                <div class="weekly-watchlist">
                    <h4>${watchlist.theme}</h4>
                    <p class="weekly-description">${watchlist.description}</p>
                    <div class="weekly-movies">
                        ${watchlist.movies.map(movie => `
                            <div class="weekly-movie-card" data-movie-id="${movie.movieId}">
                                <img src="${movie.posterPath ? `https://image.tmdb.org/t/p/w200${movie.posterPath}` : 'https://via.placeholder.com/200x300'}" 
                                     alt="${movie.title}">
                                <p class="weekly-movie-title">${movie.title}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            weeklyContainer.innerHTML = '<p class="error">Unable to load weekly watchlist.</p>';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MovieVerseAssistant;
}
