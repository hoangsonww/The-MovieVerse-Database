document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search');
    const searchButton = document.getElementById('button-search');
    const myHeading = document.getElementById('my-heading');
    const localTime = document.getElementById('local-time');

    function toggleVisibility() {
        const query = searchBar.value.trim();
        if (query) {
            if (window.innerWidth > 800) {
                myHeading.style.position = 'fixed';
                myHeading.style.top = '28px';
                localTime.style.display = 'none';
                myHeading.style.zIndex = '0.05';
                searchBar.style.marginTop = '16px';
                searchButton.style.marginTop = '16px';
            }
        }
        else {
            myHeading.style.position = '';
            myHeading.style.top = '';
            myHeading.style.zIndex = '';
            localTime.style.display = '';
            searchBar.style.marginTop = '';
            searchButton.style.marginTop = '';
        }
    }

    searchBar.addEventListener('input', toggleVisibility);
    toggleVisibility();

    const clearSearchBtn = document.getElementById('clear-search');
    clearSearchBtn.addEventListener('click', function() {
        searchBar.value = '';
        toggleVisibility();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const viewAllResultsBtn = document.getElementById('view-all-results');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResultsContainer = document.getElementById('search-results');

    function toggleButtons() {
        const query = searchInput.value.trim();
        viewAllResultsBtn.style.display = query ? 'inline-block' : 'none';
        clearSearchBtn.style.display = query ? 'inline-block' : 'none';
    }

    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchResultsContainer.innerHTML = '';
        document.getElementById('local-time').style.display = '';
        toggleButtons();
        searchInput.focus();
    });

    toggleButtons();
    searchInput.addEventListener('input', toggleButtons);
});

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search').addEventListener('input', function(e) {
        showSpinner();
        const viewAllResultsBtn = document.getElementById('view-all-results');
        const searchInput = document.getElementById('search');
        const query = e.target.value.trim();
        const searchResultsContainer = document.getElementById('search-results');

        viewAllResultsBtn.style.display = query ? 'block' : 'none';

        function toggleButtons() {
            viewAllResultsBtn.style.display = query ? 'inline-block' : 'none';
            const clearSearchBtn = document.getElementById('clear-search');
            clearSearchBtn.style.display = query ? 'inline-block' : 'none';
        }

        if (query) {
            const searchURL = `https://${getMovieVerseData()}/3/search/multi?${generateMovieNames()}${getMovieCode()}&query=${encodeURIComponent(query)}`;
            fetch(searchURL)
                .then(response => response.json())
                .then(data => {
                    const sortedResults = data.results.sort((a, b) => b.popularity - a.popularity);
                    displaySearchResults(sortedResults.slice(0, 5));
                })
                .catch(err => console.log("Fetching error:", err));
        }
        else {
            searchInput.value = '';
            searchResultsContainer.innerHTML = '';
            toggleButtons();
            searchInput.focus();
        }

        searchInput.addEventListener('input', function() {
            if (searchInput.value.trim()) {
                viewAllResultsBtn.style.display = 'block';
            }
            else {
                viewAllResultsBtn.style.display = 'none';
            }
        });

        viewAllResultsBtn.addEventListener('click', function() {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                localStorage.setItem('searchQuery', searchQuery);
                window.location.href = 'search.html';
            }
            else {
                alert('Please enter a search query.');
            }
        });

        hideSpinner();
    });

    function displaySearchResults(results) {
        showSpinner();
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        results.forEach(item => {
            const card = document.createElement('div');
            card.className = 'search-result-card';
            card.style.cursor = 'pointer';

            const imagePath = item.poster_path || item.profile_path ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}` : null;

            if (imagePath) {
                const image = document.createElement('img');
                image.src = imagePath;
                image.className = 'result-image';
                card.appendChild(image);
            }
            else {
                const placeholder = document.createElement('div');
                placeholder.className = 'result-image-placeholder';
                placeholder.textContent = 'Image Not Available';
                placeholder.style.textAlign = 'center';
                placeholder.style.padding = '10px';
                card.appendChild(placeholder);
            }

            const details = document.createElement('div');
            details.className = 'result-details';

            const name = document.createElement('div');
            name.className = 'result-name';
            name.textContent = item.title || item.name;
            details.appendChild(name);

            const type = document.createElement('div');
            type.className = 'result-type';
            type.textContent = item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV Series' : 'Person';
            details.appendChild(type);

            card.appendChild(details);
            resultsContainer.appendChild(card);

            card.addEventListener('click', () => handleResultClick(item));
        });

        hideSpinner();
    }

    async function handleResultClick(item) {
        console.log('Clicked item:', item.media_type, item.id);

        if (!item.media_type) {
            console.log('Media type is undefined');
            return;
        }

        if (item.media_type === 'movie') {
            localStorage.setItem('selectedMovieId', item.id);
            window.location.href = 'movie-details.html';
        }
        else if (item.media_type === 'tv') {
            localStorage.setItem('selectedTvSeriesId', item.id);
            window.location.href = 'tv-details.html';
        }
        else if (item.media_type === 'person') {
            try {
                const personDetailsUrl = `https://${getMovieVerseData()}/3/person/${item.id}?${generateMovieNames()}${getMovieCode()}`;
                const response = await fetch(personDetailsUrl);
                const personDetails = await response.json();

                if (personDetails.known_for_department === 'Directing') {
                    localStorage.setItem('selectedDirectorId', item.id);
                    window.location.href = 'director-details.html?' + item.id;
                }
                else {
                    localStorage.setItem('selectedActorId', item.id);
                    window.location.href = 'actor-details.html?' + item.id;
                }
            }
            catch (error) {
                console.log('Error fetching person details:', error);
            }
        }
        else {
            console.log('Unknown media type:', item.media_type);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const viewAllResultsBtn = document.getElementById('view-all-results');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResultsContainer = document.getElementById('search-results');
    let selectedIndex = -1;

    function clearSelection() {
        const results = searchResultsContainer.getElementsByClassName('search-result-card');
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            results[selectedIndex].style.backgroundColor = '';
        }
        else if (selectedIndex === results.length) {
            viewAllResultsBtn.style.backgroundColor = '';
        }
        else if (selectedIndex === results.length + 1) {
            clearSearchBtn.style.backgroundColor = '';
        }
    }

    function moveSelection(direction) {
        const results = searchResultsContainer.getElementsByClassName('search-result-card');
        const totalElements = results.length + 2;
        clearSelection();

        if (direction === 'down') {
            selectedIndex = (selectedIndex + 1) % totalElements;
        }
        else if (direction === 'up') {
            selectedIndex = (selectedIndex - 1 + totalElements) % totalElements;
        }

        if (selectedIndex < results.length) {
            results[selectedIndex].style.backgroundColor = '#ff8623';
            results[selectedIndex].scrollIntoView({ block: "nearest" });
        }
        else if (selectedIndex === results.length) {
            viewAllResultsBtn.style.backgroundColor = '#ff8623';
            viewAllResultsBtn.scrollIntoView({ block: "nearest" });
        }
        else if (selectedIndex === results.length + 1) {
            clearSearchBtn.style.backgroundColor = '#ff8623';
            clearSearchBtn.scrollIntoView({ block: "nearest" });
        }
    }

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            moveSelection('down');
        }
        else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            moveSelection('up');
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < searchResultsContainer.getElementsByClassName('search-result-card').length) {
                searchResultsContainer.getElementsByClassName('search-result-card')[selectedIndex].click();
            }
            else if (selectedIndex === searchResultsContainer.getElementsByClassName('search-result-card').length) {
                viewAllResultsBtn.click();
            }
            else if (selectedIndex === searchResultsContainer.getElementsByClassName('search-result-card').length + 1) {
                clearSearchBtn.click();
            }
            else {
                const query = searchInput.value.trim();
                localStorage.setItem('searchQuery', query);
                window.location.href = 'search.html';
            }
        }
    });

    searchInput.addEventListener('blur', clearSelection);
});
