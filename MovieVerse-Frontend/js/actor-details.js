const search = document.getElementById('search');
const searchButton = document.getElementById('button-search');
const form = document.getElementById('form1');
const main = document.getElementById('main');
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const IMGPATH2 = 'https://image.tmdb.org/t/p/w185';
const searchTitle = document.getElementById('search-title');
let currentIndex = sessionStorage.getItem('currentIndex') ? parseInt(sessionStorage.getItem('currentIndex')) : 0;

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

const movieCode = {
  part1: 'YzVhMjBjODY=',
  part2: 'MWFjZjdiYjg=',
  part3: 'ZDllOTg3ZGNjN2YxYjU1OA==',
};

function getMovieCode() {
  return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function updateBrowserURL(name) {
  const nameSlug = createNameSlug(name);
  const newURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + nameSlug;
  window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(name) {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]/g, '');
}

const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;

form.addEventListener('submit', e => {
  e.preventDefault();
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'search.html';
});

function handleSearch() {
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'search.html';
}

let initialMainContent = '';

document.addEventListener('DOMContentLoaded', () => {
  initialMainContent = document.getElementById('main').innerHTML;
  currentIndex = 0;

  const actorId = localStorage.getItem('selectedActorId');
  if (actorId) {
    fetchActorDetails(actorId);
  } else {
    fetchActorDetails(2037);
  }
});

async function fetchActorDetails(actorId) {
  showSpinner();
  const actorUrl = `https://${getMovieVerseData()}/3/person/${actorId}?${generateMovieNames()}${getMovieCode()}`;
  const combinedCreditsUrl = `https://${getMovieVerseData()}/3/person/${actorId}/combined_credits?${generateMovieNames()}${getMovieCode()}`;

  try {
    const [actorResponse, combinedCreditsResponse] = await Promise.all([fetch(actorUrl), fetch(combinedCreditsUrl)]);

    const actor = await actorResponse.json();
    const combinedCredits = await combinedCreditsResponse.json();
    const movieCredits = {
      cast: (combinedCredits.cast || []).filter(item => item.media_type === 'movie'),
      crew: (combinedCredits.crew || []).filter(item => item.media_type === 'movie'),
    };
    const tvCredits = {
      cast: (combinedCredits.cast || []).filter(item => item.media_type === 'tv'),
      crew: (combinedCredits.crew || []).filter(item => item.media_type === 'tv'),
    };
    if (actor.success === false) {
      document.getElementById('actor-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100vw; height: 800px">
                <h2>Actor details currently unavailable - please try again</h2>
            </div>`;
    } else {
      updateBrowserURL(actor.name);
      populateActorDetails(actor, movieCredits, tvCredits);

      // Display Actor Stats Dashboard
      displayActorStatsDashboard(actor, movieCredits);

      // Display Career Timeline
      displayCareerTimeline(movieCredits);
    }
    hideSpinner();
  } catch (error) {
    console.log('Error fetching actor details:', error);
    document.getElementById('actor-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100vw; height: 800px">
                <h2>Actor details currently unavailable - please try again</h2>
            </div>`;
    hideSpinner();
  }
}

async function populateActorDetails(actor, credits, tvCredits) {
  const actorImage = document.getElementById('actor-image');
  const actorName = document.getElementById('actor-name');
  const actorDescription = document.getElementById('actor-description');
  const actorId = actor.id;

  async function getInitialActorImage(actorId) {
    const response = await fetch(`https://${getMovieVerseData()}/3/person/${actorId}?${generateMovieNames()}${getMovieCode()}`);
    const data = await response.json();
    return data.profile_path;
  }

  async function getAdditionalActorImages(actorId) {
    const response = await fetch(`https://${getMovieVerseData()}/3/person/${actorId}/images?${generateMovieNames()}${getMovieCode()}`);
    const data = await response.json();
    return data.profiles.map(profile => profile.file_path);
  }

  async function rotateActorImages(actorImage, imagePaths, interval = 4000) {
    const uniqueImagePaths = [...new Set(imagePaths)];

    if (uniqueImagePaths.length <= 1) return;

    let currentIndex = 0;

    const preloadNextImage = nextIndex => {
      return loadImage(`https://image.tmdb.org/t/p/w1280${uniqueImagePaths[nextIndex]}`);
    };

    const updateImage = async () => {
      const nextIndex = (currentIndex + 1) % uniqueImagePaths.length;
      const nextImageSrc = `https://image.tmdb.org/t/p/w1280${uniqueImagePaths[nextIndex]}`;

      try {
        const img = await preloadNextImage(nextIndex);
        actorImage.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 1000));
        actorImage.src = img.src;
        actorImage.alt = `Actor Image ${nextIndex + 1}`;
        actorImage.style.opacity = '1';
        currentIndex = nextIndex;
      } catch (error) {
        console.error('Failed to load image:', nextImageSrc, error);
        actorImage.style.opacity = '1';
      }
    };

    setInterval(updateImage, interval);
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  if (actor.profile_path) {
    actorImage.src = `https://image.tmdb.org/t/p/w1280${actor.profile_path}`;
    actorName.textContent = actor.name;
    document.title = `${actor.name} - Actor's Details`;

    const initialActorImage = await getInitialActorImage(actorId);

    if (initialActorImage) {
      actorImage.src = `https://image.tmdb.org/t/p/w1280${initialActorImage}`;
      actorImage.alt = actor.name;
      actorImage.loading = 'lazy';
      actorImage.style.transition = 'transform 0.3s ease-in-out, opacity 1s ease-in-out';
      actorImage.style.opacity = '1';

      const additionalActorImages = await getAdditionalActorImages(actorId);
      let allActorImages = [initialActorImage, ...additionalActorImages];
      allActorImages = allActorImages.sort(() => 0.5 - Math.random()).slice(0, 10);
      rotateActorImages(actorImage, allActorImages);
    } else {
      const noImageText = document.createElement('h2');
      noImageText.textContent = 'Image Not Available';
      noImageText.style.textAlign = 'center';
      document.querySelector('.actor-left').appendChild(noImageText);
    }
  } else {
    actorImage.style.display = 'none';
    actorName.textContent = actor.name;
    const noImageText = document.createElement('h2');
    noImageText.textContent = 'Image Not Available';
    noImageText.style.textAlign = 'center';
    document.querySelector('.actor-left').appendChild(noImageText);
  }

  let ageOrStatus;
  if (actor.birthday) {
    if (actor.deathday) {
      ageOrStatus = calculateAge(actor.birthday, actor.deathday) + ' (Deceased)';
    } else {
      ageOrStatus = calculateAge(actor.birthday) + ' (Alive)';
    }
  } else {
    ageOrStatus = 'Unknown';
  }

  // Transform to dashboard-style layout
  actorDescription.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 20px 0;">

      <!-- Biography Card -->
      <div style="grid-column: 1 / -1; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 25px; border: 1px solid rgba(255,255,255,0.2);">
        <h3 style="margin: 0 0 15px 0; color: #fff; font-size: 18px; display: flex; align-items: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
          Biography
        </h3>
        <p style="margin: 0; line-height: 1.6; color: rgba(255,255,255,0.9); font-size: 14px;">${actor.biography || 'Biography information is not available for this person.'}</p>
      </div>

      <!-- Personal Info Card -->
      <div style="background: linear-gradient(135deg, rgba(115,120,197,0.1) 0%, rgba(115,120,197,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(115,120,197,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #7378c5; font-size: 16px;">Personal Information</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Full Name</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${actor.name}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Date of Birth</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${actor.birthday ? new Date(actor.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}</span>
          </div>
          ${
            actor.deathday
              ? `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Date of Death</span>
            <span style="color: #ff6b6b; font-size: 13px; font-weight: 500;">${new Date(actor.deathday).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Age</span>
            <span style="color: ${actor.deathday ? '#ff6b6b' : '#51cf66'}; font-size: 13px; font-weight: 600;">${ageOrStatus}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Gender</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'Not Specified'}</span>
          </div>
        </div>
      </div>

      <!-- Career Info Card -->
      <div style="background: linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,193,7,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(255,193,7,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #ffc107; font-size: 16px;">Career Details</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Known For</span>
            <span style="color: #ffc107; font-size: 13px; font-weight: 600;">${actor.known_for_department || 'Acting'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Place of Birth</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500; text-align: right; max-width: 150px;">${actor.place_of_birth || 'Unknown'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Popularity</span>
            <span style="color: ${actor.popularity > 30 ? '#51cf66' : '#ff6b6b'}; font-size: 13px; font-weight: 600;">${actor.popularity.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <!-- Also Known As Card -->
      ${
        actor.also_known_as && actor.also_known_as.length > 0
          ? `
      <div style="background: linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(156,39,176,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #9c27b0; font-size: 16px;">Also Known As</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${actor.also_known_as
            .map(
              name =>
                `<span style="background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #fff; border: 1px solid rgba(255,255,255,0.2);">${name}</span>`
            )
            .join('')}
        </div>
      </div>`
          : ''
      }

      <!-- External Links Card -->
      <div style="background: linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(33,150,243,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #2196F3; font-size: 16px;">External Links</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${
            actor.imdb_id
              ? `
          <a href="https://www.imdb.com/name/${actor.imdb_id}/" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(33,150,243,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5c518">
              <rect width="24" height="24" rx="4" fill="#f5c518"/>
              <text x="12" y="16" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="black">IMDb</text>
            </svg>
            <span style="color: #fff; font-size: 13px;">View on IMDb</span>
          </a>`
              : ''
          }
          ${
            actor.homepage
              ? `
          <a href="${actor.homepage}" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(33,150,243,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span style="color: #fff; font-size: 13px;">Official Website</span>
          </a>`
              : ''
          }
        </div>
      </div>
    </div>
  `;

  const filmographyHeading = document.createElement('p');
  filmographyHeading.innerHTML = '<strong>Filmography:</strong>';
  filmographyHeading.style.fontSize = '20px';
  filmographyHeading.style.marginTop = '16px';
  filmographyHeading.style.marginBottom = '8px';
  filmographyHeading.style.letterSpacing = '0.6px';
  filmographyHeading.style.textTransform = 'uppercase';
  filmographyHeading.style.color = '#ffd93d';
  actorDescription.appendChild(filmographyHeading);

  const dedupeById = items => {
    const uniqueItems = new Map();
    (items || []).forEach(item => {
      if (item && item.id != null && !uniqueItems.has(item.id)) {
        uniqueItems.set(item.id, item);
      }
    });
    return Array.from(uniqueItems.values());
  };

  const renderMediaList = (listElement, items, options) => {
    const { getTitle, onClick, emptyText, altSuffix } = options;
    listElement.innerHTML = '';

    let itemsToDisplay = dedupeById(items).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    if (itemsToDisplay.length === 0) {
      const noItemsText = document.createElement('p');
      noItemsText.textContent = emptyText;
      noItemsText.style.textAlign = 'center';
      noItemsText.style.width = '100%';
      noItemsText.style.color = 'white';
      noItemsText.style.margin = '12px auto';
      noItemsText.style.display = 'block';
      listElement.appendChild(noItemsText);
      return;
    }

    itemsToDisplay.forEach((item, index) => {
      const titleText = getTitle(item) || 'Untitled';
      const titleWords = titleText.split(' ');
      const truncatedTitle = titleWords.length > 5 ? titleWords.slice(0, 5).join(' ') + ' ...' : titleText;

      const mediaLink = document.createElement('a');
      mediaLink.classList.add('movie-link');
      mediaLink.href = 'javascript:void(0);';
      mediaLink.style.marginRight = '0';
      mediaLink.style.marginTop = '10px';
      mediaLink.style.maxWidth = '115px';
      mediaLink.addEventListener('click', () => onClick(item.id));

      const mediaItem = document.createElement('div');
      mediaItem.classList.add('movie-item');
      mediaItem.style.height = 'auto';

      const mediaImage = document.createElement('img');
      mediaImage.classList.add('movie-image');
      mediaImage.style.maxHeight = '155px';
      mediaImage.style.maxWidth = '115px';

      if (item.poster_path) {
        mediaImage.src = IMGPATH2 + item.poster_path;
        mediaImage.alt = `${titleText} ${altSuffix}`;
      } else {
        mediaImage.alt = 'Image Not Available';
        mediaImage.src = 'https://movie-verse.com/images/movie-default.jpg';
        mediaImage.style.filter = 'grayscale(100%)';
        mediaImage.style.objectFit = 'cover';
        mediaImage.style.maxHeight = '155px';
        mediaImage.style.maxWidth = '115px';
      }

      mediaItem.appendChild(mediaImage);

      const mediaDetails = document.createElement('div');
      mediaDetails.classList.add('movie-details');

      const mediaTitle = document.createElement('p');
      mediaTitle.classList.add('movie-title');
      mediaTitle.textContent = truncatedTitle;

      mediaDetails.appendChild(mediaTitle);

      mediaItem.appendChild(mediaDetails);
      mediaLink.appendChild(mediaItem);
      listElement.appendChild(mediaLink);

      if (index < itemsToDisplay.length - 1) {
        listElement.appendChild(document.createTextNode(''));
      }
    });
  };

  const movieSection = document.createElement('div');
  movieSection.style.marginTop = '10px';
  const movieSectionTitle = document.createElement('p');
  movieSectionTitle.innerHTML = '<strong>Movies:</strong>';
  movieSectionTitle.style.margin = '10px 0 5px 0';
  movieSection.appendChild(movieSectionTitle);

  const movieList = document.createElement('div');
  movieList.classList.add('movie-list');
  movieList.style.display = 'flex';
  movieList.style.flexWrap = 'wrap';
  movieList.style.justifyContent = 'center';
  movieList.style.gap = '5px';
  movieSection.appendChild(movieList);
  actorDescription.appendChild(movieSection);

  renderMediaList(movieList, credits?.cast || [], {
    getTitle: item => item.title,
    onClick: selectMovieId,
    emptyText: 'No films found',
    altSuffix: 'Poster',
  });

  const tvSection = document.createElement('div');
  tvSection.style.marginTop = '10px';
  const tvSectionTitle = document.createElement('p');
  tvSectionTitle.innerHTML = '<strong>TV Series:</strong>';
  tvSectionTitle.style.margin = '10px 0 5px 0';
  tvSection.appendChild(tvSectionTitle);

  const tvList = document.createElement('div');
  tvList.classList.add('movie-list');
  tvList.style.display = 'flex';
  tvList.style.flexWrap = 'wrap';
  tvList.style.justifyContent = 'center';
  tvList.style.gap = '5px';
  tvSection.appendChild(tvList);
  actorDescription.appendChild(tvSection);

  renderMediaList(tvList, tvCredits?.cast || [], {
    getTitle: item => item.name || item.original_name,
    onClick: selectTvSeriesId,
    emptyText: 'No TV series found',
    altSuffix: 'Poster',
  });

  const mediaUrl = `https://${getMovieVerseData()}/3/person/${actor.id}/images?${generateMovieNames()}${getMovieCode()}`;
  const mediaResponse = await fetch(mediaUrl);
  const mediaData = await mediaResponse.json();
  const images = mediaData.profiles;
  const detailsContainer = document.getElementById('actor-description');

  let mediaContainer = document.getElementById('media-container');
  if (!mediaContainer) {
    mediaContainer = document.createElement('div');
    mediaContainer.id = 'media-container';
    mediaContainer.style = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 450px;
            margin: 20px auto;
            overflow: hidden;
            max-width: 100%;
            box-sizing: border-box;
        `;
    detailsContainer.appendChild(mediaContainer);
  }

  let mediaTitle = document.getElementById('media-title');
  if (!mediaTitle) {
    mediaTitle = document.createElement('p');
    mediaTitle.id = 'media-title';
    mediaTitle.textContent = 'Media:';
    mediaTitle.style = `
            font-weight: bold;
            align-self: center;
            margin-bottom: 5px;
        `;
  }

  detailsContainer.appendChild(mediaTitle);
  detailsContainer.appendChild(mediaContainer);

  let imageWrapper = document.getElementById('image-wrapper');
  if (!imageWrapper) {
    imageWrapper = document.createElement('div');
    imageWrapper.id = 'image-wrapper';
    imageWrapper.style = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        `;
    mediaContainer.appendChild(imageWrapper);
  }

  let imageElement = document.getElementById('series-media-image');
  if (!imageElement) {
    imageElement = document.createElement('img');
    imageElement.id = 'series-media-image';
    imageElement.style = `
            max-width: 100%;
            max-height: 210px;
            transition: opacity 0.5s ease-in-out;
            opacity: 1;
            border-radius: 16px;
            cursor: pointer;
        `;
    imageElement.loading = 'lazy';
    imageWrapper.appendChild(imageElement);
  }

  if (images.length > 0) {
    imageElement.src = `https://image.tmdb.org/t/p/w780${images[0].file_path}`;
  }

  let modalOpen = false;

  imageElement.addEventListener('click', function () {
    const imageUrl = this.src.replace('w780', 'w1280');
    modalOpen = true;
    const modalHtml = `
            <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
                <button id="prevModalButton" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-left"></i></button>
                <img src="${imageUrl}" style="max-width: 80%; max-height: 95%; border-radius: 10px; cursor: default; transition: opacity 0.5s ease-in-out;" onclick="event.stopPropagation();" alt="Media Image"/>
                <button id="nextModalButton" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-right"></i></button>
                <span style="position: absolute; top: 10px; right: 25px; font-size: 40px; cursor: pointer" id="removeBtn">&times;</span>
            </div>
        `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('image-modal');
    const modalImage = modal.querySelector('img');
    const closeModalBtn = document.getElementById('removeBtn');

    closeModalBtn.onclick = function () {
      modal.remove();
      modalOpen = false;
      imageElement.src = modalImage.src.replace('w1280', 'w780');
    };

    modal.addEventListener('click', function (event) {
      if (event.target === this) {
        this.remove();
        modalOpen = false;
        imageElement.src = modalImage.src.replace('w1280', 'w780');
      }
    });

    const prevModalButton = document.getElementById('prevModalButton');
    prevModalButton.onmouseover = () => (prevModalButton.style.backgroundColor = '#ff8623');
    prevModalButton.onmouseout = () => (prevModalButton.style.backgroundColor = '#7378c5');
    prevModalButton.onclick = () => navigateMediaAndModal(images, imageElement, modalImage, -1);

    const nextModalButton = document.getElementById('nextModalButton');
    nextModalButton.onmouseover = () => (nextModalButton.style.backgroundColor = '#ff8623');
    nextModalButton.onmouseout = () => (nextModalButton.style.backgroundColor = '#7378c5');
    nextModalButton.onclick = () => navigateMediaAndModal(images, imageElement, modalImage, 1);
  });

  function navigateMediaAndModal(images, imgElement1, imgElement2, direction) {
    imgElement1.style.opacity = '0';
    imgElement2.style.opacity = '0';
    currentIndex = (currentIndex + direction + images.length) % images.length;

    const newSrc1 = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
    const newSrc2 = `https://image.tmdb.org/t/p/w1280${images[currentIndex].file_path}`;
    const tempImage1 = new Image();
    const tempImage2 = new Image();
    tempImage1.src = newSrc1;
    tempImage2.src = newSrc2;

    tempImage1.onload = () => {
      tempImage2.onload = () => {
        setTimeout(() => {
          imgElement1.src = newSrc1;
          imgElement2.src = newSrc2;
          imgElement1.style.opacity = '1';
          imgElement2.style.opacity = '1';
        }, 500);
      };
    };

    sessionStorage.setItem('currentIndex', currentIndex);
    updateDots(currentIndex);
    resetRotationInterval();
  }

  let prevButton = document.getElementById('prev-media-button');
  let nextButton = document.getElementById('next-media-button');
  if (!prevButton || !nextButton) {
    prevButton = document.createElement('button');
    nextButton = document.createElement('button');
    prevButton.id = 'prev-media-button';
    nextButton.id = 'next-media-button';
    prevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    nextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';

    [prevButton, nextButton].forEach(button => {
      button.style = `
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: #7378c5;
                color: white;
                border-radius: 8px;
                height: 30px;
                width: 30px;
                border: none;
                cursor: pointer;
            `;
      button.onmouseover = () => (button.style.backgroundColor = '#ff8623');
      button.onmouseout = () => (button.style.backgroundColor = '#7378c5');
    });

    prevButton.style.left = '0';
    nextButton.style.right = '0';

    imageWrapper.appendChild(prevButton);
    imageWrapper.appendChild(nextButton);
  }

  prevButton.onclick = () => navigateMedia(images, imageElement, -1);
  nextButton.onclick = () => navigateMedia(images, imageElement, 1);

  let rotationInterval;

  if (images.length === 0) {
    mediaContainer.innerHTML = '<p>No media available</p>';
  } else if (images.length > 1) {
    startRotationInterval();
  }

  function startRotationInterval() {
    rotationInterval = setInterval(() => {
      if (!modalOpen) {
        navigateMedia(images, imageElement, 1);
      }
    }, 3000);
  }

  function resetRotationInterval() {
    clearInterval(rotationInterval);
    startRotationInterval();
  }

  function navigateMedia(images, imgElement, direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    imgElement.style.opacity = '0';

    const newSrc = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
    const tempImage = new Image();
    tempImage.src = newSrc;

    tempImage.onload = () => {
      setTimeout(() => {
        imgElement.src = newSrc;
        imgElement.style.opacity = '1';
      }, 420);
    };

    sessionStorage.setItem('currentIndex', currentIndex);
    updateDots(currentIndex);
    resetRotationInterval();
  }

  const indicatorContainer = document.createElement('div');
  indicatorContainer.style = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 15px;
    `;

  const maxDotsPerLine = 10;
  let currentLine = document.createElement('div');
  currentLine.style.display = 'flex';

  images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'indicator';
    dot.style = `
            width: 8px;
            height: 8px;
            margin: 0 5px;
            background-color: ${index === currentIndex ? '#ff8623' : '#bbb'}; 
            border-radius: 50%;
            cursor: pointer;
            margin-bottom: 5px;
        `;
    dot.addEventListener('click', () => {
      navigateMedia(images, imageElement, index - currentIndex);
      updateDots(index);
    });
    dot.addEventListener('mouseover', () => (dot.style.backgroundColor = '#6a6a6a'));
    dot.addEventListener('mouseout', () => (dot.style.backgroundColor = index === currentIndex ? '#ff8623' : '#bbb'));

    currentLine.appendChild(dot);

    if ((index + 1) % maxDotsPerLine === 0 && index !== images.length - 1) {
      indicatorContainer.appendChild(currentLine);
      currentLine = document.createElement('div');
      currentLine.style.display = 'flex';
    }
  });

  if (currentLine.children.length > 0) {
    indicatorContainer.appendChild(currentLine);
  }

  mediaContainer.appendChild(indicatorContainer);

  function updateDots(newIndex) {
    const dots = document.querySelectorAll('.indicator');
    dots.forEach((dot, index) => {
      dot.style.backgroundColor = index === newIndex ? '#ff8623' : '#bbb';
    });
  }

  if (window.innerWidth <= 767) {
    mediaContainer.style.width = 'calc(100% - 40px)';
  }

  applySettings();
}

function selectMovieId(movieId) {
  // Navigate to movie details page with movieId as a query parameter
  window.location.href = `movie-details.html?movieId=${movieId}`;
}

function selectTvSeriesId(tvSeriesId) {
  // Navigate to TV details page with tvSeriesId as a query parameter
  window.location.href = `tv-details.html?tvSeriesId=${tvSeriesId}`;
}

function calculateAge(birthday, deathday = null) {
  const birthDate = new Date(birthday);
  const referenceDate = deathday ? new Date(deathday) : new Date();
  const diff = referenceDate - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

async function fetchGenreMap() {
  const url = `https://${getMovieVerseData()}/3/genre/movie/list?${generateMovieNames()}${getMovieCode()}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const genreMap = data.genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
    localStorage.setItem('genreMap', JSON.stringify(genreMap));
  } catch (error) {
    console.log('Error fetching genre map:', error);
  }
}

async function rotateUserStats() {
  await ensureGenreMapIsAvailable();

  const stats = [
    {
      label: 'Your Current Time',
      getValue: () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes}`;
      },
    },
    { label: 'Most Visited Movie', getValue: getMostVisitedMovie },
    { label: 'Most Visited Director', getValue: getMostVisitedDirector },
    { label: 'Most Visited Actor', getValue: getMostVisitedActor },
    {
      label: 'Movies Discovered',
      getValue: () => {
        const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
        return viewedMovies.length;
      },
    },
    {
      label: 'Favorite Movies',
      getValue: () => {
        const favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
        return favoritedMovies.length;
      },
    },
    {
      label: 'Favorite Genre',
      getValue: () => {
        const mostCommonGenreCode = getMostCommonGenre();
        const genreMapString = localStorage.getItem('genreMap');
        if (!genreMapString) {
          console.log('No genre map found in localStorage.');
          return 'Not Available';
        }

        let genreMap;
        try {
          genreMap = JSON.parse(genreMapString);
        } catch (e) {
          console.log('Error parsing genre map:', e);
          return 'Not Available';
        }

        let genreObject;
        if (Array.isArray(genreMap)) {
          genreObject = genreMap.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {});
        } else if (typeof genreMap === 'object' && genreMap !== null) {
          genreObject = genreMap;
        } else {
          console.log('genreMap is neither an array nor a proper object:', genreMap);
          return 'Not Available';
        }

        return genreObject[mostCommonGenreCode] || 'Not Available';
      },
    },
    {
      label: 'Watchlists Created',
      getValue: () => localStorage.getItem('watchlistsCreated') || 0,
    },
    {
      label: 'Average Movie Rating',
      getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated',
    },
    {
      label: 'Directors Discovered',
      getValue: () => {
        const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
        return viewedDirectors.length;
      },
    },
    {
      label: 'Actors Discovered',
      getValue: () => {
        const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
        return viewedActors.length;
      },
    },
    { label: 'Your Trivia Accuracy', getValue: getTriviaAccuracy },
  ];

  let currentStatIndex = 0;

  function updateStatDisplay() {
    const currentStat = stats[currentStatIndex];
    document.getElementById('stats-label').textContent = currentStat.label + ':';
    document.getElementById('stats-display').textContent = currentStat.getValue();
    currentStatIndex = (currentStatIndex + 1) % stats.length;
  }

  updateStatDisplay();

  const localTimeDiv = document.getElementById('local-time');
  let statRotationInterval = setInterval(updateStatDisplay, 3000);

  localTimeDiv.addEventListener('click', () => {
    clearInterval(statRotationInterval);
    updateStatDisplay();
    statRotationInterval = setInterval(updateStatDisplay, 3000);
    localTimeDiv.scrollIntoView({ behavior: 'smooth' });
  });
}

function updateMovieVisitCount(movieId, movieTitle) {
  let movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
  if (!movieVisits[movieId]) {
    movieVisits[movieId] = { count: 0, title: movieTitle };
  }
  movieVisits[movieId].count += 1;
  localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
}

function getMostVisitedMovie() {
  const movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
  let mostVisitedMovie = '';
  let maxVisits = 0;

  for (const movieId in movieVisits) {
    if (movieVisits[movieId].count > maxVisits) {
      mostVisitedMovie = movieVisits[movieId].title;
      maxVisits = movieVisits[movieId].count;
    }
  }

  return mostVisitedMovie || 'Not Available';
}

function getMostVisitedActor() {
  const actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
  let mostVisitedActor = '';
  let maxVisits = 0;

  for (const actorId in actorVisits) {
    if (actorVisits[actorId].count > maxVisits) {
      mostVisitedActor = actorVisits[actorId].name;
      maxVisits = actorVisits[actorId].count;
    }
  }

  return mostVisitedActor || 'Not Available';
}

function getMostVisitedDirector() {
  const directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};

  let mostVisitedDirector = '';
  let maxVisits = 0;

  for (const directorId in directorVisits) {
    if (directorVisits[directorId].count > maxVisits) {
      mostVisitedDirector = directorVisits[directorId].name;
      maxVisits = directorVisits[directorId].count;
    }
  }

  return mostVisitedDirector || 'Not Available';
}

function getTriviaAccuracy() {
  let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || {
    totalCorrect: 0,
    totalAttempted: 0,
  };
  if (triviaStats.totalAttempted === 0) {
    return 'No trivia attempted';
  }
  let accuracy = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
  return `${accuracy.toFixed(1)}% accuracy`;
}

function getMostCommonGenre() {
  const favoriteGenresArray = JSON.parse(localStorage.getItem('favoriteGenres')) || [];
  const genreCounts = favoriteGenresArray.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  let mostCommonGenre = '';
  let maxCount = 0;

  for (const genre in genreCounts) {
    if (genreCounts[genre] > maxCount) {
      mostCommonGenre = genre;
      maxCount = genreCounts[genre];
    }
  }

  return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

function handleSignInOut() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

  if (isSignedIn) {
    localStorage.setItem('isSignedIn', JSON.stringify(false));
    alert('You have been signed out.');
  } else {
    window.location.href = 'sign-in.html';
    return;
  }

  updateSignInButtonState();
}

function updateSignInButtonState() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
  const signInText = document.getElementById('signInOutText');

  const signInIcon = document.getElementById('signInIcon');
  const signOutIcon = document.getElementById('signOutIcon');

  if (isSignedIn) {
    signInText.textContent = 'Sign Out';
    signInIcon.style.display = 'none';
    signOutIcon.style.display = 'inline-block';
  } else {
    signInText.textContent = 'Sign In';
    signInIcon.style.display = 'inline-block';
    signOutIcon.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  updateSignInButtonState();
  applySettings();
  document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

async function showMovieOfTheDay() {
  const year = new Date().getFullYear();
  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      // Redirect to movie details page with movieId in the URL
      window.location.href = `movie-details.html?movieId=${randomMovie.id}`;
    } else {
      fallbackMovieSelection();
    }
  } catch (error) {
    console.log('Error fetching movie:', error);
    fallbackMovieSelection();
  }
}

function fallbackMovieSelection() {
  const fallbackMovies = [
    432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340,
    424, 98,
  ];
  const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];

  // Redirect with movieId in URL
  window.location.href = `movie-details.html?movieId=${randomFallbackMovie}`;
}

function applySettings() {
  const savedBg = localStorage.getItem('backgroundImage');
  const savedTextColor = localStorage.getItem('textColor');
  const savedFontSize = localStorage.getItem('fontSize');

  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
  }
  if (savedTextColor) {
    applyTextColor(savedTextColor);
  }
  if (savedFontSize) {
    const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
    document.body.style.fontSize = size;
  }
}

function applyTextColor(color) {
  document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
    element.style.color = color;
  });
}

// Actor Stats Dashboard functionality
function displayActorStatsDashboard(actor, credits) {
  const dashboard = document.getElementById('actor-stats-dashboard');
  if (!dashboard) return;

  // Show the dashboard
  dashboard.style.display = 'block';
  dashboard.style.opacity = '0';

  // Calculate and display popularity (normalize to 0-100 scale)
  const popularity = Math.min(100, Math.round((actor.popularity / 100) * 100));

  setTimeout(() => {
    dashboard.style.transition = 'opacity 0.5s ease';
    dashboard.style.opacity = '1';

    // Animate popularity arc
    animateActorPopularity(popularity);

    // Display career stats
    displayCareerStats(credits);

    // Display genre distribution
    displayGenreDistribution(credits);
  }, 100);
}

function animateActorPopularity(value) {
  const popularityFill = document.getElementById('actor-popularity-fill');
  const popularityValue = document.getElementById('actor-popularity-value');
  const arcLength = 283;

  if (popularityFill && popularityValue) {
    setTimeout(() => {
      const dashLength = (value / 100) * arcLength;
      popularityFill.style.strokeDashoffset = arcLength - dashLength;

      // Animate the percentage text
      let current = 0;
      const increment = value / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        popularityValue.textContent = Math.round(current) + '%';
      }, 30);
    }, 300);
  }
}

function displayCareerStats(credits) {
  const totalFilms = credits.cast ? credits.cast.length : 0;

  // Calculate years active
  let earliestYear = new Date().getFullYear();
  let latestYear = 0;

  if (credits.cast) {
    credits.cast.forEach(movie => {
      if (movie.release_date) {
        const year = new Date(movie.release_date).getFullYear();
        if (year < earliestYear) earliestYear = year;
        if (year > latestYear) latestYear = year;
      }
    });
  }

  const yearsActive = latestYear > 0 ? `${earliestYear} - ${latestYear > 0 ? latestYear : 'Present'}` : 'N/A';

  // Calculate average rating
  let totalRating = 0;
  let ratedMovies = 0;

  if (credits.cast) {
    credits.cast.forEach(movie => {
      if (movie.vote_average > 0) {
        totalRating += movie.vote_average;
        ratedMovies++;
      }
    });
  }

  const avgRating = ratedMovies > 0 ? (totalRating / ratedMovies).toFixed(1) : 'N/A';

  // Update the stats
  document.getElementById('total-films').textContent = totalFilms;
  document.getElementById('years-active').textContent = yearsActive;
  document.getElementById('avg-rating').textContent = avgRating + '/10';
}

function displayGenreDistribution(credits) {
  const genreChart = document.getElementById('genre-chart');
  if (!genreChart) return;

  // Count genres
  const genreCounts = {};
  const genreNames = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
  };

  if (credits.cast) {
    credits.cast.forEach(movie => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach(genreId => {
          const genreName = genreNames[genreId] || 'Other';
          genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        });
      }
    });
  }

  // Sort and get top 5 genres
  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Display genre bars
  genreChart.innerHTML = '';
  const maxCount = sortedGenres[0] ? sortedGenres[0][1] : 1;

  sortedGenres.forEach(([genre, count]) => {
    const percentage = (count / maxCount) * 100;
    const genreBar = document.createElement('div');
    genreBar.style.display = 'flex';
    genreBar.style.alignItems = 'center';
    genreBar.style.gap = '10px';

    genreBar.innerHTML = `
      <span style="color: rgba(255,255,255,0.7); font-size: 11px; min-width: 60px;">${genre}</span>
      <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
        <div style="width: 0%; height: 100%; background: linear-gradient(90deg, #7378c5, #ff6b6b); transition: width 1.5s ease;"
             data-width="${percentage}%"></div>
      </div>
      <span style="color: rgba(255,255,255,0.5); font-size: 10px; min-width: 25px;">${count}</span>
    `;

    genreChart.appendChild(genreBar);
  });

  // Animate the bars after a short delay
  setTimeout(() => {
    genreChart.querySelectorAll('[data-width]').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  }, 300);
}

// Career Timeline functionality
function displayCareerTimeline(credits) {
  const container = document.getElementById('career-timeline-container');
  const slider = document.getElementById('timeline-slider');
  const loadingDiv = document.getElementById('timeline-loading');

  if (!container || !slider || !credits.cast || credits.cast.length === 0) return;

  // Show container
  container.style.display = 'block';

  // Sort movies by release date
  const sortedMovies = credits.cast
    .filter(movie => movie.release_date)
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    .slice(0, 20); // Show top 20 most recent

  // Build timeline HTML
  let timelineHTML = '';
  sortedMovies.forEach(movie => {
    const year = new Date(movie.release_date).getFullYear();
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    timelineHTML += `
      <div style="min-width: 200px; margin: 0 15px; cursor: pointer; transition: transform 0.3s ease;"
           onclick="selectMovieId(${movie.id})"
           onmouseover="this.style.transform='scale(1.05)'"
           onmouseout="this.style.transform='scale(1)'">
        <div style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
          ${
            movie.poster_path
              ? `
            <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}"
                 style="width: 100%; height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;"
                 alt="${movie.title}">
          `
              : `
            <div style="width: 100%; height: 250px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
              <span style="color: rgba(255,255,255,0.3);">No Image</span>
            </div>
          `
          }
          <h4 style="color: #fff; font-size: 14px; margin: 10px 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${movie.title}</h4>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #7378c5; font-size: 12px;">${year}</span>
            <span style="color: #ffd93d; font-size: 12px;">★ ${rating}</span>
          </div>
          ${
            movie.character
              ? `
            <p style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 5px; font-style: italic;">as ${movie.character}</p>
          `
              : ''
          }
        </div>
      </div>
    `;
  });

  // Hide loading and show timeline
  if (loadingDiv && slider) {
    loadingDiv.style.display = 'none';
    slider.innerHTML = timelineHTML;
    slider.style.display = 'flex';
  }
}
