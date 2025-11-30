/**
 * Integration Guide for AI Assistant
 * 
 * This file demonstrates how to integrate the AI Assistant into existing MovieVerse pages
 */

// ==========================
// 1. Add Navigation Link
// ==========================

// Add this button to your navigation menu or header:
/*
<button
  class="ai-assistant-btn nav-btn notranslate"
  onclick="window.location.href='MovieVerse-Frontend/html/ai-assistant.html'"
  title="Your AI Movie Assistant"
>
  <i class="fas fa-robot"></i> AI Assistant
</button>
*/

// Or add to side navigation:
/*
<a href="MovieVerse-Frontend/html/ai-assistant.html" class="side-nav-link">
  <i class="fas fa-robot"></i> AI Assistant
</a>
*/


// ==========================
// 2. Add Trivia to Movie Details Page
// ==========================

// In your movie-details.html, add:
/*
<!-- Include the CSS -->
<link rel="stylesheet" href="../css/ai-assistant.css" />

<!-- Add a container for trivia -->
<div id="trivia-container"></div>

<!-- Include the script -->
<script src="../react/js/movie-trivia-integration.js"></script>
*/

// The trivia will automatically load for the current movie


// ==========================
// 3. Add "On This Day" Banner
// ==========================

// In your homepage or any page, add:
/*
<!-- Add container -->
<div id="on-this-day-container"></div>

<!-- Add script -->
<script type="module">
  import { addOnThisDayTrivia } from './MovieVerse-Frontend/react/js/movie-trivia-integration.js';
  
  document.addEventListener('DOMContentLoaded', () => {
    addOnThisDayTrivia('on-this-day-container');
  });
</script>
*/


// ==========================
// 4. Add Quick Recommendations Widget
// ==========================

// Add a recommendations widget to your dashboard or profile:
/*
<div id="quick-recommendations"></div>

<script type="module">
  import MovieVerseAssistant from './MovieVerse-Frontend/react/js/ai-assistant.js';
  
  document.addEventListener('DOMContentLoaded', async () => {
    const assistant = new MovieVerseAssistant();
    const response = await assistant.getWhatToWatch({ limit: 3 });
    
    const container = document.getElementById('quick-recommendations');
    if (response.success) {
      container.innerHTML = `
        <div class="recommendations-widget">
          <h3>🎬 Recommended for You</h3>
          <div class="movies-grid">
            ${response.recommendations.map(movie => 
              assistant.renderMovieCard(movie)
            ).join('')}
          </div>
        </div>
      `;
    }
  });
</script>
*/


// ==========================
// 5. Add to User Profile
// ==========================

// In user-profile.html, add a section for AI features:
/*
<div class="profile-section">
  <h3>Your AI Assistant</h3>
  <button onclick="window.location.href='ai-assistant.html'">
    Open AI Assistant
  </button>
  
  <div id="profile-recommendations"></div>
  <div id="profile-reminders"></div>
</div>

<script type="module">
  import MovieVerseAssistant from '../react/js/ai-assistant.js';
  
  const assistant = new MovieVerseAssistant();
  
  // Load recommendations
  assistant.getWhatToWatch({ limit: 3 }).then(response => {
    if (response.success) {
      const container = document.getElementById('profile-recommendations');
      container.innerHTML = '<h4>Recommended for You</h4>' + 
        response.recommendations.map(m => assistant.renderMovieCard(m)).join('');
    }
  });
  
  // Load rewatch reminders
  assistant.getRewatchReminders(3).then(response => {
    if (response.success && response.reminders.length > 0) {
      const container = document.getElementById('profile-reminders');
      container.innerHTML = '<h4>Movies to Revisit</h4>' + 
        response.reminders.map(r => assistant.renderReminderCard(r)).join('');
    }
  });
</script>
*/


// ==========================
// 6. Chatbot Integration
// ==========================

// Enhance your existing chatbot with AI Assistant features:
/*
// In chatbot.js, add these commands:

function handleChatbotMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // Handle AI Assistant commands
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    // Extract mood if mentioned
    const moods = ['action', 'comedy', 'thriller', 'drama', 'scifi', 'romance', 'horror'];
    const mood = moods.find(m => lowerMessage.includes(m));
    
    const assistant = new MovieVerseAssistant();
    assistant.getWhatToWatch({ mood, limit: 5 }).then(response => {
      if (response.success) {
        displayRecommendations(response.recommendations);
      }
    });
  }
  else if (lowerMessage.includes('trivia') || lowerMessage.includes('fact')) {
    const assistant = new MovieVerseAssistant();
    assistant.getTrivia({ context: 'general' }).then(response => {
      if (response.success) {
        displayTrivia(response.trivia.message);
      }
    });
  }
  else if (lowerMessage.includes('rewatch') || lowerMessage.includes('watch again')) {
    const assistant = new MovieVerseAssistant();
    assistant.getRewatchReminders(3).then(response => {
      if (response.success) {
        displayReminders(response.reminders);
      }
    });
  }
  // ... existing chatbot logic
}
*/


// ==========================
// 7. Styled CSS Examples
// ==========================

// Add custom styles to match your theme:
/*
.recommendations-widget {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.recommendations-widget h3 {
  margin-top: 0;
  color: #667eea;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}
*/


// ==========================
// 8. API Usage Examples
// ==========================

// Direct API calls (if not using the JavaScript module):
/*
// Get recommendations
fetch('/api/agent/what-to-watch/?mood=action&time_available=120&limit=5')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Recommendations:', data.recommendations);
    }
  });

// Get trivia
fetch('/api/agent/trivia/?context=on_this_day')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Trivia:', data.trivia);
    }
  });

// Get rewatch reminders
const userId = getCurrentUserId(); // Your user ID function
fetch(`/api/agent/rewatch-reminder/?user_id=${userId}&limit=5`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Reminders:', data.reminders);
    }
  });

// Get weekly watchlist
fetch('/api/agent/weekly-watchlist/')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Weekly Watchlist:', data.watchlist);
    }
  });
*/


// ==========================
// 9. Error Handling
// ==========================

// Always handle errors gracefully:
/*
async function loadAIFeatures() {
  try {
    const assistant = new MovieVerseAssistant();
    const response = await assistant.getWhatToWatch({ limit: 5 });
    
    if (response.success) {
      displayRecommendations(response.recommendations);
    } else {
      console.error('Failed to load recommendations:', response.error);
      displayFallbackContent();
    }
  } catch (error) {
    console.error('Error loading AI features:', error);
    displayFallbackContent();
  }
}

function displayFallbackContent() {
  // Show cached recommendations or default content
  document.getElementById('recommendations').innerHTML = 
    '<p>Recommendations temporarily unavailable. Please try again later.</p>';
}
*/


// ==========================
// 10. Performance Tips
// ==========================

/*
Tips for optimal performance:

1. Cache responses in localStorage:
   localStorage.setItem('daily-trivia', JSON.stringify(triviaData));

2. Lazy load the assistant on pages where it's not immediately needed:
   <script defer src="../react/js/ai-assistant.js"></script>

3. Use loading indicators:
   <div class="loading">Loading recommendations...</div>

4. Implement debouncing for user interactions:
   const debouncedRefresh = debounce(() => assistant.refreshRecommendations(), 500);

5. Only fetch what you need:
   Use the limit parameter to control the number of results
*/

console.log('AI Assistant Integration Guide loaded successfully!');
console.log('Visit /MovieVerse-Frontend/html/ai-assistant.html to see the full assistant.');
