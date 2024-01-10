const { saveSetting, loadSetting } = require('../src/js/settings.js');
const { describe, beforeEach, it} = require("node:test");
const expect = require("expect");

describe("Local Storage Tests", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should save settings to local storage", () => {
        saveSetting('backgroundImage', 'some-url');
        expect(localStorage.getItem('backgroundImage')).toBe('some-url');
    });

    it("should load settings from local storage", () => {
        localStorage.setItem('textColor', '#fff');
        loadSetting();
    });

});
