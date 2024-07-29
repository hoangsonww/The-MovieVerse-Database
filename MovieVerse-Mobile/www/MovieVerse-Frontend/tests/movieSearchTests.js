const axios = require('axios');
const { getMovies, showMovies } = require('../js/chatbot.js');
const jest = require('jest');
const { describe, it } = require('node:test');

jest.mock('axios');

describe('Movie Search', () => {
  it('should fetch movies based on search term', async () => {
    const mockData = {
      data: {
        results: [
          /* Mock movie data */
        ],
      },
    };
    axios.get.mockResolvedValue(mockData);

    const searchTerm = 'Inception';
    const data = await getMovies(SEARCHPATH + searchTerm);
    expect(data.results).toHaveLength(mockData.data.results.length);
  });

  it('should render movies correctly', () => {
    const mockMovies = [
      /* Mock movie data */
    ];
    showMovies(mockMovies, document.createElement('div'));
  });
});
