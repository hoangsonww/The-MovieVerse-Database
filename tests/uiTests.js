const { toggleNav, removeNavBar } = require('../index.js');
const { screen, fireEvent } = require('@testing-library/dom');
const {describe, it} = require("node:test");
const expect = require("expect");

describe("User Interface Interactions", () => {
    it("should open and close the side navigation bar", () => {
        document.body.innerHTML = `<div id="side-nav" class="side-nav"></div>`;

        toggleNav();
        expect(document.getElementById('side-nav').classList).toContain('manual-toggle');

        removeNavBar();
        expect(document.getElementById('side-nav').classList).not.toContain('manual-toggle');
    });

    it("should open and close the side navigation bar when the hamburger menu is clicked", () => {
        document.body.innerHTML = `<div id="side-nav" class="side-nav"></div>
        <div id="hamburger-menu" class="hamburger-menu"></div>`;

        const hamburgerMenu = document.getElementById('hamburger-menu');
        fireEvent.click(hamburgerMenu);
        expect(document.getElementById('side-nav').classList).toContain('manual-toggle');

        removeNavBar();
        expect(document.getElementById('side-nav').classList).not.toContain('manual-toggle');
    });
});
