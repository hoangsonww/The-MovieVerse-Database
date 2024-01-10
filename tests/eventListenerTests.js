const { initEventListeners } = require('../src/js/settings.js');
const { it, beforeEach, describe} = require("node:test");
const { fireEvent} = require("@testing-library/dom");

describe("Event Listener Tests", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="background-select"></div>
            <input id="text-color-input" />
            <select id="font-size-select"></select>
            <button id="reset-button"></button>
        `;
        initEventListeners();
    });

    it("should handle background selection change", () => {
        const bgSelect = document.getElementById('background-select');
        fireEvent.change(bgSelect, { target: { value: 'new-url' } });
    });

    it("should handle text color input change", () => {
        const textColorInput = document.getElementById('text-color-input');
        fireEvent.input(textColorInput, { target: { value: '#000' } });
    });

});
