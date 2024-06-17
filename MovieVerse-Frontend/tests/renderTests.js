const { showMovies } = require('../../../../Downloads/The-MovieVerse-Database-ee3ec4ea5610d37178bc008fd505fd99c5f83070');
const { screen } = require('@testing-library/dom');
const { describe, it} = require("node:test");
const expect = require("expect");

describe("Component Rendering", () => {
    it("should render movies correctly", () => {
        document.body.innerHTML = `<div id="main"></div>`;
        const mockMovies = [/* Mock movie data */];
        showMovies(mockMovies, document.getElementById('main'));

        expect(screen.getByText(mockMovies[0].title)).toBeInTheDocument();
    });

});
