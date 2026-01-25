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

let currentIndex = sessionStorage.getItem('currentIndex') ? parseInt(sessionStorage.getItem('currentIndex')) : 0;

function getMovieCode() {
  return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

const search = document.getElementById('search');
const searchButton = document.getElementById('button-search');
const form = document.getElementById('form1');
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;
const main = document.getElementById('main');
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const IMGPATH2 = 'https://image.tmdb.org/t/p/w185';
const searchTitle = document.getElementById('search-title');

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

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

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
  currentIndex = 0;
  document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

document.addEventListener('DOMContentLoaded', () => {
  const directorId = localStorage.getItem('selectedDirectorId');

  if (directorId) {
    fetchDirectorDetails(directorId);
  } else {
    fetchDirectorDetails(488);
  }
});

async function fetchDirectorDetails(directorId) {
  showSpinner();

  const directorUrl = `https://${getMovieVerseData()}/3/person/${directorId}?${generateMovieNames()}${getMovieCode()}`;
  const combinedCreditsUrl = `https://${getMovieVerseData()}/3/person/${directorId}/combined_credits?${generateMovieNames()}${getMovieCode()}`;

  try {
    const [directorResponse, combinedCreditsResponse] = await Promise.all([fetch(directorUrl), fetch(combinedCreditsUrl)]);

    const director = await directorResponse.json();
    const combinedCredits = await combinedCreditsResponse.json();
    const movieCredits = {
      cast: (combinedCredits.cast || []).filter(item => item.media_type === 'movie'),
      crew: (combinedCredits.crew || []).filter(item => item.media_type === 'movie'),
    };
    const tvCredits = {
      cast: (combinedCredits.cast || []).filter(item => item.media_type === 'tv'),
      crew: (combinedCredits.crew || []).filter(item => item.media_type === 'tv'),
    };

    if (director.success === false) {
      document.getElementById('director-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>Director details currently unavailable - please try again</h2>
            </div>`;
    } else {
      updateBrowserURL(director.name);
      populateDirectorDetails(director, movieCredits, tvCredits);

      // Display the analytics dashboard
      displayDirectorDashboard(director, movieCredits);

      // Display the filmography timeline
      displayFilmographyTimeline(director, movieCredits);
    }
    hideSpinner();
  } catch (error) {
    document.getElementById('director-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>Director details currently unavailable - please try again</h2>
            </div>`;
    console.log('Error fetching director details:', error);
    hideSpinner();
  }
}

async function populateDirectorDetails(director, credits, tvCredits) {
  const directorImage = document.getElementById('director-image');
  const directorName = document.getElementById('director-name');
  const directorDescription = document.getElementById('director-description');
  const directorId = director.id;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }

  async function rotateDirectorImages(directorImage, imagePaths, interval = 4000) {
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
        directorImage.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 1000));
        directorImage.src = img.src;
        directorImage.alt = `Director Image ${nextIndex + 1}`;
        directorImage.style.opacity = '1';
        currentIndex = nextIndex;
      } catch (error) {
        console.error('Failed to load image:', nextImageSrc, error);
        directorImage.style.opacity = '1';
      }
    };

    setInterval(updateImage, interval);
  }

  async function getInitialDirectorImage(actorId) {
    const response = await fetch(`https://${getMovieVerseData()}/3/person/${actorId}?${generateMovieNames()}${getMovieCode()}`);
    const data = await response.json();
    return data.profile_path;
  }

  async function getAdditionalDirectorImages(actorId) {
    const response = await fetch(`https://${getMovieVerseData()}/3/person/${actorId}/images?${generateMovieNames()}${getMovieCode()}`);
    const data = await response.json();
    return data.profiles.map(profile => profile.file_path);
  }

  if (director.profile_path) {
    directorImage.src = `https://image.tmdb.org/t/p/w1280${director.profile_path}`;
    directorName.textContent = director.name;
    document.title = `${director.name} - Director's Details`;

    const initialDirectorImage = await getInitialDirectorImage(directorId);
    const additionalDirectorImages = await getAdditionalDirectorImages(directorId);

    if (initialDirectorImage) {
      directorImage.src = `https://image.tmdb.org/t/p/w1280${initialDirectorImage}`;
      directorImage.alt = director.name;
      directorImage.loading = 'lazy';
      directorImage.style.transition = 'transform 0.3s ease-in-out, opacity 1s ease-in-out';
      directorImage.style.opacity = '1';

      let allDirectorImages = [initialDirectorImage, ...additionalDirectorImages];
      allDirectorImages = allDirectorImages.sort(() => 0.5 - Math.random()).slice(0, 10);
      rotateDirectorImages(directorImage, allDirectorImages);
    } else {
      const noImageText = document.createElement('h2');
      noImageText.textContent = 'Image Not Available';
      noImageText.style.textAlign = 'center';
      document.querySelector('.director-left').appendChild(noImageText);
    }
  } else {
    directorImage.style.display = 'none';
    directorName.textContent = director.name;
    const noImageText = document.createElement('h2');
    noImageText.textContent = 'Image Not Available';
    noImageText.style.textAlign = 'center';
    document.querySelector('.director-left').appendChild(noImageText);
  }

  let ageOrStatus;
  if (director.birthday) {
    if (director.deathday) {
      ageOrStatus = calculateAge(director.birthday, director.deathday) + ' (Deceased)';
    } else {
      ageOrStatus = calculateAge(director.birthday) + ' (Alive)';
    }
  } else {
    ageOrStatus = 'Unknown';
  }

  const popularity = director.popularity.toFixed(2);
  const isPopular = popularity > 20 ? 'popular' : 'not popular';

  directorDescription.innerHTML = `
    <!-- Director Info Dashboard -->
    <div style="display: grid; gap: 20px;">

      <!-- Biography Card -->
      <div style="background: linear-gradient(135deg, rgba(115, 120, 197, 0.1) 0%, rgba(115, 120, 197, 0.05) 100%);
                  border-radius: 15px;
                  padding: 20px;
                  border: 1px solid rgba(115, 120, 197, 0.2);
                  backdrop-filter: blur(10px);">
        <h3 style="color: #7378c5;
                   font-size: 16px;
                   margin: 0 0 15px 0;
                   display: flex;
                   align-items: center;">
          <i class="fas fa-book-open" style="margin-right: 10px;"></i>
          Biography
        </h3>
        <p style="color: #d0d0d0;
                  line-height: 1.8;
                  margin: 0;
                  font-size: 14px;">
          ${director.biography || 'Information currently unavailable. Check back later for updates.'}
        </p>
      </div>

      <!-- Personal Information Grid -->
      <div style="display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                  gap: 15px;">

        <!-- Birth Information Card -->
        <div style="background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;">
          <h4 style="color: #ff8623;
                     font-size: 13px;
                     margin: 0 0 12px 0;
                     text-transform: uppercase;
                     letter-spacing: 1px;
                     opacity: 0.8;">
            <i class="fas fa-calendar-alt" style="margin-right: 8px;"></i>
            Personal Details
          </h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #999; font-size: 13px;">Date of Birth:</span>
              <span style="color: #fff; font-size: 14px; font-weight: 500;">
                ${director.birthday || 'Not Available'}
              </span>
            </div>
            ${
              director.deathday
                ? `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #999; font-size: 13px;">Date of Death:</span>
                <span style="color: #fff; font-size: 14px; font-weight: 500;">
                  ${director.deathday}
                </span>
              </div>
            `
                : ''
            }
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #999; font-size: 13px;">Age:</span>
              <span style="color: #fff; font-size: 14px; font-weight: 500;">
                ${ageOrStatus}
              </span>
            </div>
          </div>
        </div>

        <!-- Location Card -->
        <div style="background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;">
          <h4 style="color: #4caf50;
                     font-size: 13px;
                     margin: 0 0 12px 0;
                     text-transform: uppercase;
                     letter-spacing: 1px;
                     opacity: 0.8;">
            <i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i>
            Origin
          </h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <span style="color: #999; font-size: 13px; display: block; margin-bottom: 5px;">Place of Birth:</span>
              <span style="color: #fff; font-size: 14px; font-weight: 500;">
                ${director.place_of_birth || 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        <!-- Professional Info Card -->
        <div style="background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;">
          <h4 style="color: #2196f3;
                     font-size: 13px;
                     margin: 0 0 12px 0;
                     text-transform: uppercase;
                     letter-spacing: 1px;
                     opacity: 0.8;">
            <i class="fas fa-film" style="margin-right: 8px;"></i>
            Professional
          </h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #999; font-size: 13px;">Known For:</span>
              <span style="color: #fff; font-size: 14px; font-weight: 500;">
                Directing
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #999; font-size: 13px;">Popularity:</span>
              <span style="color: ${popularity > 20 ? '#4caf50' : '#ff8623'};
                     font-size: 14px;
                     font-weight: 600;">
                ${popularity}
                <span style="font-size: 11px; opacity: 0.8; margin-left: 5px;">
                  (${isPopular})
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Also Known As Card -->
      ${
        director.also_known_as && director.also_known_as.length > 0
          ? `
        <div style="background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 18px;
                    border: 1px solid rgba(255, 255, 255, 0.1);">
          <h4 style="color: #9c27b0;
                     font-size: 13px;
                     margin: 0 0 12px 0;
                     text-transform: uppercase;
                     letter-spacing: 1px;
                     opacity: 0.8;">
            <i class="fas fa-user-tag" style="margin-right: 8px;"></i>
            Also Known As
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${director.also_known_as
              .map(
                name => `
              <span style="background: rgba(156, 39, 176, 0.2);
                           color: #e0e0e0;
                           padding: 6px 12px;
                           border-radius: 20px;
                           font-size: 13px;
                           border: 1px solid rgba(156, 39, 176, 0.3);">
                ${name}
              </span>
            `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }
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
  directorDescription.appendChild(filmographyHeading);

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
  directorDescription.appendChild(movieSection);

  const directedMovies = (credits?.crew || []).filter(movie => movie.job === 'Director');
  renderMediaList(movieList, directedMovies, {
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
  directorDescription.appendChild(tvSection);

  const directedSeries = (tvCredits?.crew || []).filter(series => series.job === 'Director');
  renderMediaList(tvList, directedSeries, {
    getTitle: item => item.name || item.original_name,
    onClick: selectTvSeriesId,
    emptyText: 'No TV series found',
    altSuffix: 'Poster',
  });

  const mediaUrl = `https://${getMovieVerseData()}/3/person/${director.id}/images?${generateMovieNames()}${getMovieCode()}`;
  const mediaResponse = await fetch(mediaUrl);
  const mediaData = await mediaResponse.json();
  const images = mediaData.profiles;

  const detailsContainer = document.getElementById('director-description');

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

  let modalOpen = false;

  if (images.length > 0) {
    imageElement.src = `https://image.tmdb.org/t/p/w780${images[0].file_path}`;
  }

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
      }, 380);
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

function calculateAge(dob, deathday = null) {
  const birthDate = new Date(dob);
  const referenceDate = deathday ? new Date(deathday) : new Date();
  const ageDifMs = referenceDate - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

function selectMovieId(movieId) {
  // Navigate to movie details page with movieId as a query parameter
  window.location.href = `movie-details.html?movieId=${movieId}`;
}

function selectTvSeriesId(tvSeriesId) {
  // Navigate to TV details page with tvSeriesId as a query parameter
  window.location.href = `tv-details.html?tvSeriesId=${tvSeriesId}`;
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

// Display Director Analytics Dashboard
function displayDirectorDashboard(director, credits) {
  const dashboard = document.getElementById('director-stats-dashboard');
  if (!dashboard) return;

  // Show the dashboard
  dashboard.style.display = 'block';
  dashboard.style.opacity = '0';

  // Calculate director influence (based on number of films and average rating)
  const directedMovies = credits.crew.filter(movie => movie.job === 'Director');
  const influence = Math.min(100, Math.round((directedMovies.length / 50) * 100)); // 50 films = 100% influence

  setTimeout(() => {
    dashboard.style.transition = 'opacity 0.5s ease';
    dashboard.style.opacity = '1';

    // Animate influence number
    animateInfluence(influence);

    // Display box office performance
    displayBoxOfficePerformance(directedMovies);

    // Display genre distribution
    displayGenreDistribution(directedMovies);

    // Display additional stats
    displayAdditionalStats(director, directedMovies);
  }, 100);
}

function animateInfluence(value) {
  const influenceValue = document.getElementById('director-influence-value');

  if (influenceValue) {
    animateNumber(influenceValue, 0, value, 2000);
  }
}

function animateNumber(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + (end - start) * progress);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function displayBoxOfficePerformance(movies) {
  const budgetBar = document.getElementById('avg-budget-bar');
  const revenueBar = document.getElementById('avg-revenue-bar');
  const budgetLabel = document.getElementById('avg-budget-label');
  const revenueLabel = document.getElementById('avg-revenue-label');
  const roiValue = document.getElementById('avg-roi-value');

  // Calculate average budget and revenue (mock data for demonstration)
  const avgBudget = 50000000; // $50M average
  const avgRevenue = 150000000; // $150M average

  if (budgetBar && revenueBar) {
    const maxValue = Math.max(avgBudget, avgRevenue, 1);
    const budgetHeight = Math.max((avgBudget / maxValue) * 100, 5);
    const revenueHeight = Math.max((avgRevenue / maxValue) * 100, 5);

    setTimeout(() => {
      budgetBar.style.height = `${budgetHeight}%`;
      revenueBar.style.height = `${revenueHeight}%`;

      if (budgetLabel && revenueLabel) {
        budgetLabel.textContent = `$${formatCurrency(avgBudget)}`;
        revenueLabel.textContent = `$${formatCurrency(avgRevenue)}`;
        budgetLabel.style.opacity = '1';
        revenueLabel.style.opacity = '1';
      }

      if (avgBudget > 0 && roiValue) {
        const roi = Math.round(((avgRevenue - avgBudget) / avgBudget) * 100);
        roiValue.textContent = `${roi > 0 ? '+' : ''}${roi}%`;
        roiValue.style.color = roi > 0 ? '#4CAF50' : roi < 0 ? '#f44336' : '#888';
      }
    }, 800);
  }
}

function formatCurrency(value) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

function displayGenreDistribution(movies) {
  const genreChart = document.getElementById('director-genre-chart');
  if (!genreChart) return;

  // Count genres (mock data for demonstration)
  const genres = {
    Drama: 35,
    Action: 25,
    Thriller: 20,
    Comedy: 15,
    'Sci-Fi': 5,
  };

  genreChart.innerHTML = '';
  const maxCount = Math.max(...Object.values(genres));

  Object.entries(genres)
    .slice(0, 5)
    .forEach(([genre, count]) => {
      const percentage = (count / maxCount) * 100;
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 10px;';

      row.innerHTML = `
      <span style="color: #888; font-size: 12px; width: 60px; text-align: right">${genre}</span>
      <div style="flex: 1; height: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden">
        <div style="height: 100%; background: linear-gradient(90deg, #7378c5, #ff8623); width: ${percentage}%; transition: width 1.5s ease; border-radius: 10px"></div>
      </div>
      <span style="color: #fff; font-size: 12px; width: 30px">${count}%</span>
    `;

      genreChart.appendChild(row);
    });
}

function displayAdditionalStats(director, movies) {
  // Films directed
  const filmsDirected = document.getElementById('films-directed');
  if (filmsDirected) {
    filmsDirected.textContent = movies.length;
  }

  // Career span
  const careerSpan = document.getElementById('career-span');
  if (careerSpan && movies.length > 0) {
    const years = movies.map(m => new Date(m.release_date).getFullYear()).filter(y => y);
    if (years.length > 0) {
      const span = Math.max(...years) - Math.min(...years);
      careerSpan.textContent = `${span} years`;
    }
  }

  // Average rating
  const avgRating = document.getElementById('dir-avg-rating');
  if (avgRating) {
    const ratings = movies.map(m => m.vote_average).filter(r => r > 0);
    if (ratings.length > 0) {
      const average = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
      avgRating.textContent = average;
    }
  }

  // Total revenue (mock data)
  const totalRevenue = document.getElementById('total-revenue');
  if (totalRevenue) {
    const revenue = movies.length * 150000000; // Mock: $150M per film
    totalRevenue.textContent = `$${formatCurrency(revenue)}`;
  }
}

// Display Filmography Timeline
function displayFilmographyTimeline(director, credits) {
  const container = document.getElementById('filmography-timeline-container');
  const slider = document.getElementById('filmography-slider');
  const loading = document.getElementById('timeline-loading');

  if (!container || !slider) return;

  // Show container
  container.style.display = 'block';
  loading.style.display = 'block';

  // Get directed movies sorted by date
  const directedMovies = credits.crew
    .filter(movie => movie.job === 'Director' && movie.release_date)
    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  setTimeout(() => {
    loading.style.display = 'none';
    slider.innerHTML = '';

    directedMovies.forEach((movie, index) => {
      const item = createTimelineItem(movie, index);
      slider.appendChild(item);
    });

    // Setup navigation
    setupTimelineNavigation(slider);

    // Update progress bar
    updateTimelineProgress(slider);
  }, 500);
}

function createTimelineItem(movie, index) {
  const item = document.createElement('div');
  item.className = 'timeline-item';
  if (index === 0) item.classList.add('active');

  const posterWrapper = document.createElement('div');
  posterWrapper.style.cssText = `
    position: relative;
    width: 140px;
    height: 210px;
    margin: 0 auto 15px auto;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
  `;

  if (movie.poster_path) {
    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
    poster.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    posterWrapper.appendChild(poster);
  } else {
    posterWrapper.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666;">
        <i class="fas fa-film" style="font-size: 48px; margin-bottom: 10px; opacity: 0.3;"></i>
        <span style="font-size: 12px;">No Poster</span>
      </div>
    `;
  }

  const year = document.createElement('div');
  year.style.cssText = `
    color: #f5f5f5;
    font-size: 14px;
    font-weight: 600;
    margin-top: 12px;
    background: linear-gradient(135deg, rgba(115, 120, 197, 0.3) 0%, rgba(115, 120, 197, 0.1) 100%);
    padding: 5px 14px;
    border-radius: 20px;
    display: inline-block;
  `;
  year.textContent = new Date(movie.release_date).getFullYear();

  const title = document.createElement('div');
  title.style.cssText = `
    color: #d0d0d0;
    font-size: 13px;
    margin-top: 8px;
    max-width: 140px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.4;
  `;
  title.textContent = movie.title;

  // Timeline dot
  const dot = document.createElement('div');
  dot.style.cssText = `
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
    border: 3px solid #7378c5;
    border-radius: 50%;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    transition: all 0.3s ease;
  `;

  item.appendChild(posterWrapper);
  item.appendChild(year);
  item.appendChild(title);
  item.appendChild(dot);

  // Click handler
  item.addEventListener('click', () => {
    window.location.href = `movie-details.html?movieId=${movie.id}`;
  });

  return item;
}

function setupTimelineNavigation(slider) {
  const prevBtn = document.getElementById('timeline-prev');
  const nextBtn = document.getElementById('timeline-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -200, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }

  // Update active item on scroll
  slider.addEventListener('scroll', () => {
    updateTimelineProgress(slider);
  });
}

function updateTimelineProgress(slider) {
  const progress = document.getElementById('timeline-progress');
  if (progress) {
    const scrollPercentage = (slider.scrollLeft / (slider.scrollWidth - slider.clientWidth)) * 100;
    progress.style.width = `${scrollPercentage}%`;
  }
}
