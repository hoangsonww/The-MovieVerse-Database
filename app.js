// Get the discussion list element
const discussionList = document.getElementById('discussion-list');

// Get the discussion input and post button elements
const discussionInput = document.getElementById('discussion-input');
const postButton = document.querySelector('button');

// Add an event listener to the post button
postButton.addEventListener('click', addDiscussion);

// Load the discussions from local storage when the page loads
loadDiscussions();

// Function to add a discussion to the discussion list
function addDiscussion() {
    // Get the discussion text from the input field
    const discussionText = discussionInput.value.trim();

    // If the discussion text is empty, don't add it to the list
    if (!discussionText) {
        return;
    }

    // Create a new discussion item
    const discussionItem = document.createElement('li');
    discussionItem.textContent = discussionText;

    // Add the discussion item to the discussion list
    discussionList.appendChild(discussionItem);

    // Clear the input field
    discussionInput.value = '';

    // Save the discussions to local storage
    saveDiscussions();
}

// Function to load the discussions from local storage
function loadDiscussions() {
    // Get the discussions from local storage
    const discussions = JSON.parse(localStorage.getItem('discussions')) || [];

    // Add each discussion to the discussion list
    for (let discussion of discussions) {
        const discussionItem = document.createElement('li');
        discussionItem.textContent = discussion;
        discussionList.appendChild(discussionItem);
    }
}

// Function to save the discussions to local storage
function saveDiscussions() {
    // Get all the discussion items from the discussion list
    const discussionItems = discussionList.querySelectorAll('li');

    // Get an array of discussion texts from the discussion items
    const discussions = Array.from(discussionItems).map(item => item.textContent);

    // Save the discussions to local storage as a JSON string
    localStorage.setItem('discussions', JSON.stringify(discussions));
}
