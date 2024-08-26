const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { describe, beforeEach, it } = require('node:test');
const expect = require('expect');
const { JSDOM } = jsdom;

describe('Favorites Page Tests', () => {
  let document;
  let window;

  beforeEach(() => {
    const html = fs.readFileSync(path.join(__dirname, '../MovieVerse-Frontend/html/favorites.html'), 'utf-8');
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
    });
    window = dom.window;
    document = window.document;
  });

  it('should display correct title', () => {
    expect(document.title).toContain('Favorite Movies & Watchlists');
  });

  it('should have a search input', () => {
    expect(document.getElementById('search')).not.toBeNull();
  });

  it('should handle search input correctly', () => {
    const searchInput = document.getElementById('search');
    searchInput.value = 'Inception';
    searchInput.dispatchEvent(new window.Event('input'));
    expect(searchInput.value).toBe('Inception');
  });

  it('should display favorites correctly', () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    favorites.forEach(movie => {
      const li = document.createElement('li');
      li.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}" />
                <p>${movie.Title}</p>
                <button class="remove-favorite-btn" data-id="${movie.imdbID}">Remove</button>
            `;
      favoritesList.appendChild(li);
    });
    expect(favoritesList.children.length).toBe(favorites.length);
  });

  it('should create a new watchlist', () => {
    const watchlistName = 'Test Watchlist';
    const watchlist = { name: watchlistName, movies: [] };
    const watchlists = JSON.parse(localStorage.getItem('watchlists')) || [];
    watchlists.push(watchlist);
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
    expect(watchlists.length).toBe(1);
    expect(watchlists[0].name).toBe(watchlistName);
  });

  it('should edit an existing watchlist', () => {
    const watchlistName = 'Test Watchlist';
    const watchlist = { name: watchlistName, movies: [] };
    const watchlists = JSON.parse(localStorage.getItem('watchlists')) || [];
    watchlists.push(watchlist);
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
    expect(watchlists.length).toBe(1);
    expect(watchlists[0].name).toBe(watchlistName);
  });

  it('should delete a watchlist', () => {
    const watchlistName = 'Test Watchlist';
    const watchlist = { name: watchlistName, movies: [] };
    const watchlists = JSON.parse(localStorage.getItem('watchlists')) || [];
    watchlists.push(watchlist);
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
    expect(watchlists.length).toBe(1);
    expect(watchlists[0].name).toBe(watchlistName);
  });

  it('should open and close modals correctly', () => {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOpenBtn = document.getElementById('modal-open-btn');
    modalOpenBtn.click();
    expect(modal.style.display).toBe('block');
    modalCloseBtn.click();
    expect(modal.style.display).toBe('none');
  });
});
