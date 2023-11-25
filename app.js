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

const OPENAI_API_KEY = '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';

// Function to call OpenAI's API
async function openAIResponse(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": message}],
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Send message and get response
async function sendMessage(message) {
    chatbotBody.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px; color: white;">${message}</div>
    `;

    // Get the response from OpenAI's API instead of the Eliza response
    let botReply = await openAIResponse(message);

    setTimeout(() => {
        chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: white;">${botReply}</div>
        `;
        chatbotBody.scrollTop = chatbotBody.scrollHeight; // Auto-scroll to the latest message
    }, 1000);
}


