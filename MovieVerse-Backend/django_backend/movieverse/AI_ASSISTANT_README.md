# AI-Powered Cinematic Assistant

## Overview

The AI-Powered Cinematic Assistant is an intelligent recommendation system that provides personalized movie suggestions, contextual trivia, and engagement features to enhance the MovieVerse experience.

## Features

### 1. What to Watch (`/api/agent/what-to-watch`)
- Personalized movie recommendations based on:
  - Available time (runtime filtering)
  - User's current mood (genre-based)
  - Viewing history (avoids already-watched movies)
  - User preferences (learned from ratings)
- Smart scoring algorithm that boosts recommendations matching user preferences
- Returns detailed reasoning for each suggestion

**Parameters:**
- `user_id` (optional): User ID for personalized recommendations
- `time_available` (optional): Time in minutes (e.g., 90, 120, 180)
- `mood` (optional): User's mood - action, comedy, thriller, drama, scifi, romance, horror
- `limit` (optional): Number of recommendations (default: 5)

**Example Request:**
```
GET /api/agent/what-to-watch/?user_id=123&time_available=120&mood=action&limit=5
```

**Example Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "movieId": 550,
      "title": "Fight Club",
      "overview": "A ticking-time-bomb insomniac...",
      "runtime": 139,
      "releaseDate": "1999-10-15",
      "voteAverage": 8.4,
      "posterPath": "/path/to/poster.jpg",
      "genres": ["Drama", "Thriller"],
      "reasoning": "Highly rated (8.4/10) • Perfect for your 120-minute window • Matches your action mood"
    }
  ],
  "context": {
    "time_available": 120,
    "mood": "action",
    "count": 5
  }
}
```

### 2. Cinema Trivia (`/api/agent/trivia`)
- General cinema facts and trivia
- Movie-specific trivia with runtime, ratings, and genre information
- "On This Day" historical movie releases

**Parameters:**
- `movie_id` (optional): Specific movie ID for movie-specific trivia
- `context` (optional): 'general', 'historical', or 'on_this_day' (default: 'general')

**Example Request:**
```
GET /api/agent/trivia/?context=on_this_day
```

**Example Response:**
```json
{
  "success": true,
  "trivia": {
    "type": "on_this_day",
    "message": "On this day 28 years ago, 'Se7en' was released!",
    "movieId": 807,
    "title": "Se7en",
    "releaseDate": "1995-09-22",
    "overview": "Two homicide detectives' desperate hunt...",
    "posterPath": "/path/to/poster.jpg"
  }
}
```

### 3. Rewatch Reminders (`/api/agent/rewatch-reminder`)
- Suggests movies to rewatch based on high ratings and time since last viewing
- Identifies movies that were loved but haven't been watched in 6+ months
- Provides contextual reasoning for each reminder

**Parameters:**
- `user_id` (required): User ID
- `limit` (optional): Number of reminders (default: 5)

**Example Request:**
```
GET /api/agent/rewatch-reminder/?user_id=123&limit=5
```

**Example Response:**
```json
{
  "success": true,
  "reminders": [
    {
      "movieId": 550,
      "title": "Fight Club",
      "posterPath": "/path/to/poster.jpg",
      "reason": "You loved this 8 months ago. Time for a rewatch?",
      "type": "rewatch"
    }
  ],
  "count": 1
}
```

### 4. Weekly Watchlist (`/api/agent/weekly-watchlist`)
- Curated weekly watchlist with themed collections
- Themes include: Time Travel Adventures, Classic Noir, Feel-Good Comedies, etc.
- High-quality movies (7.0+ rating) matching the theme

**Parameters:**
- `theme` (optional): Specific theme name

**Example Request:**
```
GET /api/agent/weekly-watchlist/
```

**Example Response:**
```json
{
  "success": true,
  "watchlist": {
    "theme": "Mind-Bending Thrillers",
    "description": "A curated selection of mind-bending thrillers for your week",
    "movies": [
      {
        "movieId": 27205,
        "title": "Inception",
        "overview": "Cobb, a skilled thief...",
        "posterPath": "/path/to/poster.jpg",
        "voteAverage": 8.4
      }
    ],
    "weekOf": "2024-10-22"
  }
}
```

## Frontend Components

### AI Assistant Page
**Location:** `MovieVerse-Frontend/html/ai-assistant.html`

A dedicated page featuring:
- Interactive recommendation filters (mood, time available)
- Daily cinema trivia
- Rewatch reminders (for logged-in users)
- Weekly themed watchlist

### Movie Trivia Integration
**Location:** `MovieVerse-Frontend/react/js/movie-trivia-integration.js`

Functions to add contextual trivia to movie detail pages:
- `addMovieTrivia(movieId, containerId)` - Adds movie-specific trivia
- `addOnThisDayTrivia(containerId)` - Adds "On This Day" banner
- `initializeMovieTrivia()` - Auto-initializes trivia on movie detail pages

**Usage:**
```javascript
// Add to movie detail page
<script src="../react/js/movie-trivia-integration.js"></script>
<div id="trivia-container"></div>
```

### JavaScript Module
**Location:** `MovieVerse-Frontend/react/js/ai-assistant.js`

The `MovieVerseAssistant` class provides:
```javascript
const assistant = new MovieVerseAssistant();

// Get recommendations
const recommendations = await assistant.getWhatToWatch({
  timeAvailable: 120,
  mood: 'action',
  limit: 5
});

// Get trivia
const trivia = await assistant.getTrivia({ context: 'on_this_day' });

// Get rewatch reminders
const reminders = await assistant.getRewatchReminders(5);

// Get weekly watchlist
const watchlist = await assistant.getWeeklyWatchlist();

// Initialize full assistant panel
await assistant.initializeAssistantPanel('container-id');
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Activity Layer                       │
│         (Ratings, Watchlists, Reviews, Browsing)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   CinematicAssistant                        │
│                    (AI Agent Logic)                          │
├─────────────────────────────────────────────────────────────┤
│  • User History Analysis                                     │
│  • Genre Preference Learning                                 │
│  • Smart Filtering & Scoring                                 │
│  • Contextual Recommendation Reasoning                       │
└────────────┬────────────────────────────────────────────────┘
             │
             ├──► get_what_to_watch()
             │     └─► Filter by time, mood, history
             │         └─► Score based on preferences
             │             └─► Generate reasoning
             │
             ├──► get_trivia()
             │     └─► Movie-specific facts
             │         └─► Historical releases
             │             └─► General cinema trivia
             │
             ├──► get_rewatch_reminders()
             │     └─► Analyze user reviews
             │         └─► Find high-rated movies
             │             └─► Filter by time since viewing
             │
             └──► get_weekly_watchlist()
                   └─► Select themed collection
                       └─► Filter high-quality movies
                           └─► Curate 7-day list
                            
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Movies DB (MongoDB)  │  Reviews DB (MySQL)  │  Users DB    │
│  • Movie metadata     │  • User ratings      │  (PostgreSQL)│
│  • Genres            │  • Review text       │  • User info  │
│  • Cast & crew       │  • Timestamps        │  • Preferences│
└─────────────────────────────────────────────────────────────┘
```

## Testing

Run the test suite:
```bash
cd MovieVerse-Backend/django_backend
python manage.py test movieverse.AIAgentTests
```

Tests cover:
- Endpoint accessibility
- Parameter handling
- Response format validation
- User authentication requirements
- Error handling

## Security Considerations

1. **User Data Privacy**: User IDs are optional for most endpoints
2. **Rate Limiting**: Consider implementing rate limiting for API endpoints
3. **Data Validation**: All inputs are validated before processing
4. **Error Handling**: Graceful fallbacks when data is unavailable

## Future Enhancements

1. **Machine Learning Integration**
   - Deep learning-based recommendation models
   - Collaborative filtering with similar users
   - Content-based filtering using movie embeddings

2. **Enhanced Personalization**
   - Time-of-day preferences
   - Seasonal recommendations
   - Social viewing patterns

3. **Conversational Interface**
   - Natural language queries
   - ChatGPT-style interactions
   - Voice-based commands

4. **Advanced Analytics**
   - Watch time predictions
   - Genre trend analysis
   - Personalized movie timelines

## Contributing

When adding new AI features:
1. Update `ai_agent.py` with new methods
2. Add corresponding endpoints in `views.py`
3. Update URL routing in `urls.py`
4. Write comprehensive tests in `tests.py`
5. Document the feature in this README
6. Update frontend components as needed

## License

Part of The MovieVerse project - see main LICENSE.md for details.
