const { getClassByRate, calculateMoviesToDisplay } = require('../../index.js');
const { it, describe} = require("node:test");
const expect = require("expect");

describe("Utility Functions", () => {
    it("should return the correct class based on the rating", () => {
        expect(getClassByRate(8)).toEqual("green");
        expect(getClassByRate(5)).toEqual("orange");
        expect(getClassByRate(3)).toEqual("red");
    });

    it("should return the correct number of movies to display", () => {
        const mockMovies = [
            {title: "Movie 1", rating: 8},
            {title: "Movie 2", rating: 5},
            {title: "Movie 3", rating: 3},
            {title: "Movie 4", rating: 8},
            {title: "Movie 5", rating: 5},
            {title: "Movie 6", rating: 3},
            {title: "Movie 7", rating: 8},
            {title: "Movie 8", rating: 5},
            {title: "Movie 9", rating: 3},
            {title: "Movie 10", rating: 8},
            {title: "Movie 11", rating: 5},
            {title: "Movie 12", rating: 3},
        ];
        expect(calculateMoviesToDisplay(mockMovies, 0)).toEqual(4);
        expect(calculateMoviesToDisplay(mockMovies, 1)).toEqual(8);
        expect(calculateMoviesToDisplay(mockMovies, 2)).toEqual(12);
    });

});