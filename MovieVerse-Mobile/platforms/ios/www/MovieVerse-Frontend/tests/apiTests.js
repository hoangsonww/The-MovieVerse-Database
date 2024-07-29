const axios = require('axios');
const { getMovies } = require('../../../../Downloads/The-MovieVerse-Database-ee3ec4ea5610d37178bc008fd505fd99c5f83070');
const { describe, it } = require('node:test');
const jest = require('jest');
const expect = require('expect');

jest.mock('axios');

describe('API Calls', () => {
  it('should fetch popular movies', async () => {
    const mockData = {
      data: {
        results: [
          /* Mock movie data */
        ],
      },
    };
    axios.get.mockResolvedValue(mockData);

    const data = await getMovies(DATABASEURL);
    expect(data.results).toHaveLength(mockData.data.results.length);
  });
});
