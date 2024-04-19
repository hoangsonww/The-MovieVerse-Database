// ButtonActions.kt

class ButtonActions {
    companion object {
        fun setButtonActions() {
            document.addEventListener("DOMContentLoaded") {
                val settingsBtn = document.getElementById("settings-btn")
                settingsBtn?.addEventListener("click") {
                    window.location.href = "src/html/settings.html"
                }

                val movieMatchBtn = document.getElementById("movie-match-btn")
                movieMatchBtn?.addEventListener("click") {
                    window.location.href = "src/html/movie-match.html"
                }

                val movieTimelineBtn = document.getElementById("movie-timeline-btn")
                movieTimelineBtn?.addEventListener("click") {
                    window.location.href = "src/html/movie-timeline.html"
                }

                val movieOfTheDayBtn = document.getElementById("movie-of-the-day-btn")
                movieOfTheDayBtn?.addEventListener("click") {
                    showMovieOfTheDay()
                }

                val discussionsBtn = document.getElementById("discussions-btn")
                discussionsBtn?.addEventListener("click") {
                    window.location.href = "./src/html/chatbot.html"
                }

                val triviaBtn = document.getElementById("trivia-btn")
                triviaBtn?.addEventListener("click") {
                    window.location.href = "./src/html/trivia.html"
                }

                val backToTopBtn = document.getElementById("back-to-top-btn")
                backToTopBtn?.addEventListener("click") {
                    window.location.href = "#homepage-header"
                }
            }
        }
    }
}
