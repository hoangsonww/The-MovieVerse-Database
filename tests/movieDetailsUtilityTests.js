const { getRtSlug, createMetacriticSlug } = require('../src/js/movie-details');
const {describe, it} = require("node:test");
const expect = require("expect");

describe("Movie Details Utility Functions", () => {
    it("should generate correct Rotten Tomatoes slug", () => {
        const title = "The Great Movie";
        expect(getRtSlug(title)).toEqual("the_great_movie");
    });

    it("should generate correct Metacritic slug", () => {
        const title = "The Great Movie";
        expect(createMetacriticSlug(title)).toEqual("the-great-movie");
    });

    it("should generate correct Metacritic slug with special characters", () => {
        const title = "The Great Movie: Part 2";
        expect(createMetacriticSlug(title)).toEqual("the-great-movie-part-2");
    });

});