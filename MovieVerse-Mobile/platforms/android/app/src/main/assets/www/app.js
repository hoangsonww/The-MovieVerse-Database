const chatbotInput = document.getElementById("chatbotInput");
const chatbotBody = document.getElementById("chatbotBody");

document.addEventListener('DOMContentLoaded', function() {
    chatbotInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage(chatbotInput.value);
            chatbotInput.value = "";
        }
    });
});

function sendMessage(message) {
    chatbotBody.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px; color: white;">You: ${message}</div>
    `;
    let botReply = movieVerseResponse(message);  // Renamed function for clarity
    setTimeout(() => {
        chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: #bbb;">Assistant: ${botReply}</div>
        `;
    }, 1000);
}

function movieVerseResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        return "Hello! How can I assist you with MovieVerse today?";
    } else if (lowerMessage.includes("how are you")) {
        return "I'm your digital MovieVerse assistant, ready to help! How can I assist you with movie info?";
    } else if (lowerMessage.includes("search movie")) {
        return "To find information about a movie, please provide its name or keyword related to it.";
    } else if (lowerMessage.includes("imdb rating")) {
        return "You can search for a movie, and I'll provide its IMDb rating among other details. Please provide the movie name!";
    } else if (lowerMessage.includes("movie description") || lowerMessage.includes("tell me about")) {
        return "Sure, please provide the movie name you want to learn about, and I'll fetch its description for you!";
    } else if (lowerMessage.includes("how many movies")) {
        return "MovieVerse has a vast databases of millions of movies. You can search for any movie, and I'll try to fetch details for you!";
    } else if (lowerMessage.includes("latest movies")) {
        return "I can provide information on recent movie releases. However, for the most up-to-date releases, consider checking the 'Latest Movies' section of MovieVerse!";
    } else if (lowerMessage.includes("recommend a movie") || lowerMessage.includes("suggestion")) {
        return "Certainly! How about watching 'Inception'? It's a critically acclaimed movie with a captivating plot!";
    } else if (lowerMessage.includes("how does this work") || lowerMessage.includes("how to use")) {
        return "Simply type in your query related to a movie, and I'll provide details from our MovieVerse databases. You can ask about IMDb ratings, descriptions, and more!";
    } else if (lowerMessage.includes("who created this") || lowerMessage.includes("developer")) {
        return "MovieVerse is the result of the hard work of dedicated developers passionate about movies. We hope you find it helpful!";
    } else if (lowerMessage.includes("top rated movies")) {
        return "Our top-rated movies include 'The Shawshank Redemption', 'The Godfather', and 'The Dark Knight'. Would you like a detailed list?";
    } else if (lowerMessage.includes("genre")) {
        return "We have movies spanning various genres: Action, Drama, Comedy, Romance, Thriller, and more! Which genre are you interested in?";
    } else if (lowerMessage.includes("actor") || lowerMessage.includes("actress")) {
        return "Sure, which actor or actress are you interested in? Provide a name, and I'll fetch the movies they've starred in!";
    } else if (lowerMessage.includes("director")) {
        return "Great! Which director's filmography are you interested in?";
    } else if (lowerMessage.includes("animated movies")) {
        return "We have a wide collection of animated movies! Some popular ones include 'Toy Story', 'Frozen', and 'Spirited Away'.";
    } else if (lowerMessage.includes("thank you") || lowerMessage.includes("thanks")) {
        return "You're welcome! If you have any more questions, feel free to ask. Enjoy your movie experience!";
    } else if (lowerMessage.includes("subscription") || lowerMessage.includes("membership")) {
        return "MovieVerse offers different subscription tiers. For detailed information, you might want to check our 'Subscription' section.";
    } else if (lowerMessage.includes("watch movie")) {
        return "While MovieVerse provides detailed information on movies, to watch them, you might need to visit specific streaming platforms or theaters!";
    } else if (lowerMessage.includes("are you a bot")) {
        return "Yes, I'm the MovieVerse digital assistant. How can I help you further?";
    } else if (lowerMessage.includes("documentary")) {
        return "We have an extensive collection of documentaries. From nature to history and science, what topic interests you?";
    } else if (lowerMessage.includes("foreign films")) {
        return "MovieVerse has films from all around the world. Looking for any specific region or language?";
    } else if (lowerMessage.includes("classic movies")) {
        return "Ah, classics! Some all-time favorites include 'Casablanca', 'Gone with the Wind', and 'Citizen Kane'. Would you like more recommendations?";
    } else if (lowerMessage.includes("family movies")) {
        return "We have plenty of family-friendly movies. 'The Lion King', 'Finding Nemo', and 'Toy Story' are a few favorites. Looking for anything specific?";
    } else if (lowerMessage.includes("comedy")) {
        return "In need of a good laugh? We've got comedies like 'Dumb and Dumber', 'Bridesmaids', and 'Anchorman' to name a few!";
    } else if (lowerMessage.includes("action movies")) {
        return "For adrenaline junkies, we've got action-packed movies like 'Die Hard', 'Mad Max: Fury Road', and 'The Dark Knight'. Ready to dive in?";
    } else if (lowerMessage.includes("horror")) {
        return "Looking for a scare? Consider watching 'The Exorcist', 'Psycho', or 'Get Out'. Don't forget to keep the lights on!";
    } else if (lowerMessage.includes("romance")) {
        return "Feeling romantic? Check out 'The Notebook', 'Pride and Prejudice', or 'Before Sunrise'. Love is in the air!";
    } else if (lowerMessage.includes("sci-fi")) {
        return "For sci-fi enthusiasts, we recommend 'Blade Runner', 'Star Wars', or 'Interstellar'. Ready to travel through space and time?";
    } else if (lowerMessage.includes("trailers")) {
        return "Want to see what's coming up? Our 'Trailers' section has the latest teasers and previews of upcoming films!";
    } else if (lowerMessage.includes("membership benefits")) {
        return "Members get exclusive access to early releases, high-definition streaming, and ad-free experience. Interested in upgrading?";
    } else if (lowerMessage.includes("create an account")) {
        return "Creating an account is easy! Just head to the 'Sign Up' section on our website and follow the steps.";
    } else if (lowerMessage.includes("forgot password")) {
        return "No worries! Just click on the 'Forgot Password' link on the login page, and we'll guide you through the reset process.";
    } else if (lowerMessage.includes("movie ratings")) {
        return "Our ratings are sourced from critics and viewers like you. They provide a combined score to help you pick the best movies!";
    } else if (lowerMessage.includes("how do you work")) {
        return "I'm here to answer your questions about MovieVerse and movies in general. Just ask away!";
    } else if (lowerMessage.includes("are you real")) {
        return "I'm a virtual assistant powered by code. While I'm not real, I'm here to help!";
    } else if (lowerMessage.includes("oscar winners")) {
        return "Looking for Oscar winners? We have a dedicated section for 'Academy Award Winners'. Check it out for a list of acclaimed films!";
    } else if (lowerMessage.includes("in theaters now")) {
        return "Our 'Now Showing' section provides a list of movies currently playing in theaters. Planning a movie outing?";
    } else if (lowerMessage.includes("coming soon")) {
        return "Anticipating new releases? Head over to our 'Coming Soon' tab to check out movies hitting the theaters soon!";
    } else if (lowerMessage.includes("movie runtime")) {
        return "Please specify the movie you're inquiring about, and I'll fetch its runtime for you!";
    } else if (lowerMessage.includes("indie films")) {
        return "Indie films offer unique storytelling. Some of our favorites include 'Moonlight', 'Lady Bird', and 'Whiplash'. Would you like to explore more indie titles?";
    } else if (lowerMessage.includes("film festivals")) {
        return "We have a collection of movies that have made waves in film festivals. From Cannes to Sundance, which festival's winners are you interested in?";
    } else if (lowerMessage.includes("animation studios")) {
        return "From Pixar to Studio Ghibli, we have movies from renowned animation studios. Any particular studio you're fond of?";
    } else if (lowerMessage.includes("musicals")) {
        return "Sing your heart out! 'La La Land', 'The Greatest Showman', or classics like 'The Sound of Music' are all available. Ready for a song and dance?";
    } else if (lowerMessage.includes("kid movies")) {
        return "For the little ones, we have 'Despicable Me', 'Frozen', and many more. Anything in particular they enjoy?";
    } else if (lowerMessage.includes("adaptations")) {
        return "Books turned movies? We have 'Harry Potter', 'The Hunger Games', and classics like 'To Kill a Mockingbird'. Interested in a specific adaptation?";
    } else if (lowerMessage.includes("based on true stories")) {
        return "The truth can be stranger than fiction! Check out 'The Imitation Game', 'Schindler's List', or 'Catch Me If You Can'. Any specific era or event you're interested in?";
    } else if (lowerMessage.includes("customer support")) {
        return "Having issues? Our customer support team is here to help. You can reach out via the 'Support' section on our website.";
    } else if (lowerMessage.includes("subscription cancel")) {
        return "We're sad to see you go. To cancel your subscription, please go to the 'Account Settings' section.";
    } else if (lowerMessage.includes("refunds")) {
        return "For refund queries, please get in touch with our customer support. They'll guide you through the process.";
    } else if (lowerMessage.includes("device compatibility")) {
        return "MovieVerse is compatible with a range of devices, from smartphones and tablets to desktops and smart TVs. Any specific device you're asking about?";
    } else if (lowerMessage.includes("movie suggestions based on mood")) {
        return "Of course! Let me know your mood, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie for date night")) {
        return "How about a romantic comedy? 'Pride & Prejudice' or something light-hearted like '500 Days of Summer'?";
    } else if (lowerMessage.includes("is there a series section")) {
        return "Yes, apart from movies, we also have a collection of TV series. From 'Breaking Bad' to 'Stranger Things', binge away!";
    } else if (lowerMessage.includes("award-winning movies")) {
        return "Looking for critically acclaimed cinema? Check our 'Award Winners' section for movies that have received major accolades!";
    } else if (lowerMessage.includes("do you have classics from the 80s")) {
        return "Absolutely! The 80s were iconic. Dive into classics like 'E.T.', 'The Breakfast Club', or 'Back to the Future'. Ready for some nostalgia?";
    } else if (lowerMessage.includes("movie suggestions based on genre")) {
        return "Sure! Let me know your favorite genre, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on actor")) {
        return "Of course! Let me know your favorite actor, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on director")) {
        return "Of course! Let me know your favorite director, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on year")) {
        return "Of course! Let me know your favorite year, and I'll suggest a movie accordingly!";
    }
    else {
        return "Sorry, I didn't catch that. Can you rephrase or ask another question about movies?";
    }
}
