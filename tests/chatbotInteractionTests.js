const { sendMessage, movieVerseResponse } = require('../src/js/app.js');
const { describe, it} = require("node:test");
const expect = require("expect");

describe("Chatbot Interactions", () => {
    it("should send a message", () => {
        const message = "Hello";
        sendMessage(message);
    });

    it("should generate appropriate responses", () => {
        const query = "Show me details about Inception";
        const response = movieVerseResponse(query);
        expect(response).toContain("Searching for details about \"Inception\".");
    });

});
