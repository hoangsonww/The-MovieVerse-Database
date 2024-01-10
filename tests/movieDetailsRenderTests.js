const { screen } = require('@testing-library/dom');
const { populateMovieDetails } = require('../src/js/movie-details.js');
const { describe, it} = require("node:test");
const expect = require("expect");

describe("Movie Details Rendering", () => {
    it("should render movie details correctly", () => {
        const mockMovie = {/* Mock movie data */};
        document.body.innerHTML = `<div id="movie-details-container"></div>`;

        populateMovieDetails(mockMovie, '8.0', '90%', '85/100', 'Oscar-winning', 'PG-13');
        expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    });

});
