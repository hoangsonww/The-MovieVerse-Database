const movieCode = {
  part1: 'YzVhMjBjODY=',
  part2: 'MWFjZjdiYjg=',
  part3: 'ZDllOTg3ZGNjN2YxYjU1OA==',
};

function getMovieCode() {
  return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames() {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
const FALLBACKS = {
  poster: '../../images/movie-default.jpg',
  person: '../../images/actor-default.webp',
  backdrop: '../../images/universe-1.webp',
};
const FEED_PAGE_SIZE = 5;
const feedState = {
  items: [],
  filter: 'all',
  page: 1,
};

document.addEventListener('DOMContentLoaded', () => {
  initNotifications();
  setupRailNav();
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastVisit', new Date().toISOString());
  });
});

async function initNotifications() {
  const lastVisit = getLastVisitDate();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const formattedLastVisit = formatDate(lastVisit);
  const formattedToday = formatDate(today);
  const formattedMonthStart = formatDate(monthStart);

  const [trending, nowPlaying, upcoming, airingToday, people, newReleases, recommended, topRatedMonth] = await Promise.all([
    fetchJson(buildUrl('/trending/all/day', 'language=en-US')),
    fetchJson(buildUrl('/movie/now_playing', 'language=en-US&page=1')),
    fetchJson(buildUrl('/movie/upcoming', 'language=en-US&page=1')),
    fetchJson(buildUrl('/tv/airing_today', 'language=en-US&page=1')),
    fetchJson(buildUrl('/person/popular', 'language=en-US&page=1')),
    fetchJson(
      buildUrl(
        '/discover/movie',
        `language=en-US&sort_by=release_date.desc&release_date.gte=${formattedLastVisit}&release_date.lte=${formattedToday}`
      )
    ),
    fetchRecommendedReleases(),
    fetchJson(
      buildUrl(
        '/discover/movie',
        `language=en-US&sort_by=vote_average.desc&vote_count.gte=200&primary_release_date.gte=${formattedMonthStart}&primary_release_date.lte=${formattedToday}&page=1`
      )
    ),
  ]);

  const trendingResults = trending?.results || [];
  const nowPlayingResults = nowPlaying?.results || [];
  const upcomingResults = upcoming?.results || [];
  const airingResults = airingToday?.results || [];
  const peopleResults = people?.results || [];
  const newReleaseResults = newReleases?.results || [];
  const recommendedResults = Array.isArray(recommended) ? recommended : recommended?.results || [];
  const topRatedMonthResults = topRatedMonth?.results || [];

  const heroItem = pickHero(trendingResults, nowPlayingResults, upcomingResults);
  await renderHero(heroItem);
  const statsSection = document.getElementById('todayPulse');
  const usesInlineStats = statsSection?.dataset?.statsSource === 'inline';
  if (!usesInlineStats) {
    updateStats({
      newReleases: newReleaseResults,
      upcoming: upcomingResults,
      trending: trendingResults,
      topRatedMonth: topRatedMonthResults,
      lastVisit,
      monthStart,
      today,
    });
  }
  renderRadar(airingResults, nowPlayingResults, peopleResults);
  renderRails({
    newReleases: newReleaseResults,
    upcoming: upcomingResults,
    recommended: recommendedResults,
    people: peopleResults,
  });

  const feedItems = buildFeedItems({
    newReleases: newReleaseResults,
    trending: trendingResults,
    nowPlaying: nowPlayingResults,
    upcoming: upcomingResults,
    airing: airingResults,
    people: peopleResults,
    recommended: recommendedResults,
  });

  feedState.items = feedItems;
  renderFeed(feedItems, 'all', 1);
  setupFilters(feedItems);
  setupFeedPagination();
}

function buildUrl(path, query = '') {
  const base = `https://${getMovieVerseData()}/3${path}`;
  const joiner = base.includes('?') ? '&' : '?';
  const queryString = query ? `&${query}` : '';
  return `${base}${joiner}${generateMovieNames()}${getMovieCode()}${queryString}`;
}

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.log('Fetch failed:', error);
    return null;
  }
}

function getLastVisitDate() {
  const stored = localStorage.getItem('lastVisit');
  const fallback = new Date();
  fallback.setDate(fallback.getDate() - 7);
  if (!stored) {
    return fallback;
  }
  const parsed = new Date(stored);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLong(dateString) {
  if (!dateString) {
    return 'Unknown date';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRangeShort(startDate, endDate) {
  const startLabel = formatDateShort(startDate);
  const endLabel = formatDateShort(endDate);
  if (!startLabel || !endLabel) {
    return '';
  }
  if (startLabel === endLabel) {
    return startLabel;
  }
  return `${startLabel}–${endLabel}`;
}

function formatRelative(dateString) {
  if (!dateString) {
    return 'Just now';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }
  const now = new Date();
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays > 0) {
    return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }
  const daysAgo = Math.abs(diffDays);
  return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
}

function imageUrl(path, size, fallback) {
  if (!path) {
    return fallback;
  }
  return `${IMAGE_BASE}${size}${path}`;
}

function pickHero(trending, nowPlaying, upcoming) {
  const candidates = [...trending, ...nowPlaying, ...upcoming].filter(item => item && (item.backdrop_path || item.poster_path));
  return candidates[0] || trending[0] || nowPlaying[0] || upcoming[0] || null;
}

async function renderHero(item) {
  if (!item) {
    return;
  }

  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const heroBackdrop = document.getElementById('heroBackdrop');
  const heroPoster = document.getElementById('heroPoster');
  const heroTitle = document.getElementById('heroTitle');
  const heroOverview = document.getElementById('heroOverview');
  const heroType = document.getElementById('heroType');
  const heroBadge = document.getElementById('heroBadge');
  const heroDate = document.getElementById('heroDate');
  const heroRating = document.getElementById('heroRating');
  const heroRuntime = document.getElementById('heroRuntime');
  const heroPrimary = document.getElementById('heroPrimary');

  const backdrop = imageUrl(item.backdrop_path, 'w1280', FALLBACKS.backdrop);
  heroBackdrop.style.backgroundImage = `url('${backdrop}')`;

  heroTitle.textContent = item.title || item.name || 'Spotlight pick';
  heroOverview.textContent = item.overview || 'A fresh highlight from the MovieVerse universe.';
  heroType.textContent = mediaType === 'tv' ? 'TV Series' : mediaType === 'person' ? 'Person' : 'Movie';
  heroBadge.textContent = item.popularity ? 'Trending Now' : 'Featured';
  heroDate.textContent = formatDateLong(item.release_date || item.first_air_date);
  heroRating.textContent = item.vote_average ? `${item.vote_average.toFixed(1)} / 10` : 'No rating yet';

  heroPoster.innerHTML = '';
  const posterImg = document.createElement('img');
  posterImg.src = imageUrl(item.poster_path, 'w342', mediaType === 'person' ? FALLBACKS.person : FALLBACKS.poster);
  posterImg.alt = heroTitle.textContent;
  heroPoster.appendChild(posterImg);

  heroPrimary.onclick = () => openDetails(item, mediaType);

  if (mediaType === 'movie' || mediaType === 'tv') {
    const details = await fetchJson(buildUrl(`/${mediaType}/${item.id}`, 'language=en-US'));
    if (details) {
      const runtimeValue = mediaType === 'movie' ? details.runtime : details.episode_run_time?.[0];
      heroRuntime.textContent = runtimeValue ? `${runtimeValue} min` : 'Runtime varies';
    } else {
      heroRuntime.textContent = 'Runtime varies';
    }
  } else {
    heroRuntime.textContent = 'Trending now';
  }
}

function updateStats({ newReleases, upcoming, trending, topRatedMonth, lastVisit, monthStart, today }) {
  const lastVisitLabel = formatDateLong(lastVisit.toISOString().split('T')[0]);
  const statNewCount = document.getElementById('statNewCount');
  const statNewMeta = document.getElementById('statNewMeta');
  const statUpcomingCount = document.getElementById('statUpcomingCount');
  const statUpcomingMeta = document.getElementById('statUpcomingMeta');
  const statFavoritesCount = document.getElementById('statFavoritesCount');
  const statWatchlistsCount = document.getElementById('statWatchlistsCount');
  const statTrendingMeta = document.getElementById('statTrendingMeta');
  const statTopRatedMeta = document.getElementById('statTopRatedMeta');

  if (statNewCount) {
    statNewCount.textContent = newReleases.length;
  }
  if (statNewMeta) {
    statNewMeta.textContent = `Since ${lastVisitLabel}`;
  }

  const upcomingSoon = upcoming.filter(item => {
    if (!item.release_date) {
      return false;
    }
    const days = (new Date(item.release_date) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  });

  if (statUpcomingCount) {
    statUpcomingCount.textContent = upcomingSoon.length;
  }
  if (statUpcomingMeta) {
    statUpcomingMeta.textContent = 'Next 30 days';
  }

  if (statFavoritesCount) {
    const trendingCandidates = trending.filter(item => item && typeof item.vote_average === 'number');
    const trendingQualified = trendingCandidates.filter(item => (item.vote_count || 0) >= 100);
    const trendingPool = trendingQualified.length ? trendingQualified : trendingCandidates;
    const trendingLeader = trendingPool.sort((a, b) => {
      if (b.vote_average !== a.vote_average) {
        return b.vote_average - a.vote_average;
      }
      return (b.vote_count || 0) - (a.vote_count || 0);
    })[0];
    statFavoritesCount.textContent = trendingLeader ? trendingLeader.vote_average.toFixed(1) : '--';

    if (statTrendingMeta) {
      const trendingTitle = trendingLeader?.title || trendingLeader?.name;
      statTrendingMeta.textContent = trendingTitle ? `Top rated: ${trendingTitle}` : 'Highest-rated trending title';
    }
  }

  if (statWatchlistsCount) {
    const topRatedLeader = topRatedMonth
      .filter(item => item && typeof item.vote_average === 'number')
      .sort((a, b) => b.vote_average - a.vote_average || (b.vote_count || 0) - (a.vote_count || 0))[0];
    statWatchlistsCount.textContent = topRatedLeader ? topRatedLeader.vote_average.toFixed(1) : '--';

    if (statTopRatedMeta) {
      const rangeLabel = formatDateRangeShort(monthStart, today);
      const topRatedTitle = topRatedLeader?.title;
      const titleLabel = topRatedTitle ? `Best: ${topRatedTitle}` : 'Best rated this month';
      statTopRatedMeta.textContent = rangeLabel ? `${titleLabel} (${rangeLabel})` : titleLabel;
    }
  }
}

function buildFeedItems({ newReleases, trending, nowPlaying, upcoming, airing, people, recommended }) {
  const feedItems = [];
  const seen = new Set();

  const pushItems = (items, category, fallbackType) => {
    items.slice(0, 6).forEach(item => {
      const mediaType = item.media_type || fallbackType || (item.first_air_date ? 'tv' : 'movie');
      const key = `${mediaType}-${item.id}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      feedItems.push(createFeedItem(item, category, mediaType));
    });
  };

  pushItems(newReleases, 'new', 'movie');
  pushItems(trending, 'trending');
  pushItems(nowPlaying, 'now', 'movie');
  pushItems(airing, 'airing', 'tv');
  pushItems(upcoming, 'upcoming', 'movie');
  pushItems(recommended, 'recommended', 'movie');
  pushItems(people, 'people', 'person');

  return feedItems;
}

function createFeedItem(item, category, mediaType) {
  const title = item.title || item.name || 'Untitled';
  const date = item.release_date || item.first_air_date;
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  const categoryMap = {
    new: { badge: 'New release', message: `Just landed ${formatRelative(date)}.` },
    trending: { badge: 'Trending', message: 'Heating up across the MovieVerse right now.' },
    now: { badge: 'Now playing', message: 'Currently in theaters and buzzing.' },
    upcoming: { badge: 'Coming soon', message: `Arrives ${formatRelative(date)}.` },
    airing: { badge: 'Airing today', message: 'Fresh episode available today.' },
    recommended: { badge: 'For you', message: 'Picked from your viewing patterns.' },
    people: { badge: 'Trending talent', message: `${item.known_for_department || 'Creator'} making waves.` },
  };

  const categoryData = categoryMap[category] || categoryMap.trending;
  return {
    id: item.id,
    title,
    overview: item.overview,
    date,
    rating,
    image:
      mediaType === 'person'
        ? imageUrl(item.profile_path, 'w185', FALLBACKS.person)
        : imageUrl(item.poster_path || item.backdrop_path, 'w342', FALLBACKS.poster),
    mediaType,
    badge: categoryData.badge,
    message: categoryData.message,
    timeLabel: date ? formatRelative(date) : 'Just now',
    raw: item,
  };
}

function renderFeed(items, filter, page = 1) {
  const feed = document.getElementById('notificationFeed');
  const empty = document.getElementById('feedEmpty');
  const pagination = document.getElementById('feedPagination');
  const pageCurrent = document.getElementById('feedPageCurrent');
  const pageTotal = document.getElementById('feedPageTotal');
  const prevBtn = document.getElementById('feedPrev');
  const nextBtn = document.getElementById('feedNext');
  if (!feed) {
    return;
  }
  feed.innerHTML = '';
  const filtered = filter === 'all' ? items : items.filter(item => item.mediaType === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / FEED_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  feedState.filter = filter;
  feedState.page = currentPage;

  if (!filtered.length) {
    if (empty) {
      empty.style.display = 'block';
    }
    if (pagination) {
      pagination.style.display = 'none';
    }
    return;
  }

  if (empty) {
    empty.style.display = 'none';
  }

  const startIndex = (currentPage - 1) * FEED_PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + FEED_PAGE_SIZE);

  pageItems.forEach(item => {
    feed.appendChild(createFeedCard(item));
  });

  if (pagination) {
    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
  }
  if (pageCurrent) {
    pageCurrent.textContent = currentPage;
  }
  if (pageTotal) {
    pageTotal.textContent = totalPages;
  }
  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
  }
}

function setupFilters(items) {
  const filters = document.querySelectorAll('.filter-btn');
  if (!filters.length) {
    return;
  }
  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderFeed(items, button.dataset.filter, 1);
    });
  });
}

function setupFeedPagination() {
  const prevBtn = document.getElementById('feedPrev');
  const nextBtn = document.getElementById('feedNext');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      renderFeed(feedState.items, feedState.filter, feedState.page - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      renderFeed(feedState.items, feedState.filter, feedState.page + 1);
    });
  }
}

function createFeedCard(item) {
  const card = document.createElement('article');
  card.className = 'feed-card';
  card.dataset.type = item.mediaType;

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'feed-image';
  const image = document.createElement('img');
  image.src = item.image;
  image.alt = item.title;
  imageWrapper.appendChild(image);

  const body = document.createElement('div');
  body.className = 'feed-body';

  const top = document.createElement('div');
  top.className = 'feed-top';
  const badge = document.createElement('span');
  badge.className = 'feed-badge';
  badge.textContent = item.badge;
  const time = document.createElement('span');
  time.className = 'feed-badge';
  time.textContent = item.timeLabel;
  top.appendChild(badge);
  top.appendChild(time);

  const title = document.createElement('h4');
  title.className = 'feed-title';
  title.textContent = item.title;

  const message = document.createElement('p');
  message.className = 'feed-message';
  message.textContent = item.message;

  const meta = document.createElement('div');
  meta.className = 'feed-meta';
  if (item.date) {
    const dateSpan = document.createElement('span');
    dateSpan.innerHTML = `<i class="fas fa-calendar"></i> ${formatDateLong(item.date)}`;
    meta.appendChild(dateSpan);
  }
  if (item.rating) {
    const ratingSpan = document.createElement('span');
    ratingSpan.innerHTML = `<i class="fas fa-star"></i> ${item.rating}`;
    meta.appendChild(ratingSpan);
  }

  const actions = document.createElement('div');
  actions.className = 'feed-actions';
  const primary = document.createElement('button');
  primary.className = 'feed-action primary';
  primary.textContent = item.mediaType === 'person' ? 'View profile' : 'View details';
  primary.addEventListener('click', () => openDetails(item.raw, item.mediaType));

  actions.appendChild(primary);

  body.appendChild(top);
  body.appendChild(title);
  body.appendChild(message);
  body.appendChild(meta);
  body.appendChild(actions);

  card.appendChild(imageWrapper);
  card.appendChild(body);

  card.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'button') {
      return;
    }
    openDetails(item.raw, item.mediaType);
  });

  return card;
}

function renderRadar(airing, nowPlaying, people) {
  const radarList = document.getElementById('radarList');
  if (!radarList) {
    return;
  }
  radarList.innerHTML = '';

  const combined = [
    ...airing.slice(0, 2).map(item => ({ ...item, media_type: 'tv', label: 'Airing today' })),
    ...nowPlaying.slice(0, 2).map(item => ({ ...item, media_type: 'movie', label: 'Now playing' })),
    ...people.slice(0, 2).map(item => ({ ...item, media_type: 'person', label: 'Trending person' })),
  ];

  combined.forEach(item => {
    radarList.appendChild(createMiniCard(item));
  });
}

function createMiniCard(item) {
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const card = document.createElement('div');
  card.className = 'mini-card';

  const img = document.createElement('img');
  img.src =
    mediaType === 'person'
      ? imageUrl(item.profile_path, 'w185', FALLBACKS.person)
      : imageUrl(item.poster_path || item.backdrop_path, 'w185', FALLBACKS.poster);
  img.alt = item.title || item.name || 'Media';

  const details = document.createElement('div');
  const title = document.createElement('h4');
  title.textContent = item.title || item.name || 'Untitled';
  const label = document.createElement('span');
  label.textContent = item.label || (mediaType === 'tv' ? 'TV alert' : mediaType === 'person' ? 'Spotlight' : 'Movie alert');

  details.appendChild(title);
  details.appendChild(label);
  card.appendChild(img);
  card.appendChild(details);

  card.addEventListener('click', () => openDetails(item, mediaType));
  return card;
}

function renderRails({ newReleases, upcoming, recommended, people }) {
  renderRail('railNewReleases', newReleases, 'movie');
  renderRail('railComingSoon', upcoming, 'movie');
  renderRail('railRecommendations', recommended, 'movie');
  renderRail('railPeople', people, 'person');
}

function renderRail(trackId, items, fallbackType) {
  const track = document.getElementById(trackId);
  if (!track) {
    return;
  }
  track.innerHTML = '';

  items.slice(0, 12).forEach(item => {
    const mediaType = item.media_type || fallbackType || (item.first_air_date ? 'tv' : 'movie');
    track.appendChild(createRailCard(item, mediaType));
  });
}

function createRailCard(item, mediaType) {
  const card = document.createElement('article');
  card.className = 'rail-card';

  const img = document.createElement('img');
  img.src =
    mediaType === 'person'
      ? imageUrl(item.profile_path, 'w342', FALLBACKS.person)
      : imageUrl(item.poster_path || item.backdrop_path, 'w342', FALLBACKS.poster);
  img.alt = item.title || item.name || 'Media poster';

  const content = document.createElement('div');
  content.className = 'rail-card-content';

  const title = document.createElement('h4');
  title.className = 'rail-card-title';
  title.textContent = item.title || item.name || 'Untitled';

  const meta = document.createElement('div');
  meta.className = 'rail-card-meta';
  if (mediaType === 'person') {
    const knownFor = item.known_for?.[0];
    meta.textContent = knownFor ? `Known for ${knownFor.title || knownFor.name}` : 'Trending in the spotlight';
  } else {
    const date = item.release_date || item.first_air_date;
    meta.textContent = date ? formatDateLong(date) : 'Updated pick';
  }

  content.appendChild(title);
  content.appendChild(meta);
  card.appendChild(img);
  card.appendChild(content);

  card.addEventListener('click', () => openDetails(item, mediaType));
  return card;
}

function openDetails(item, mediaType) {
  if (mediaType === 'movie') {
    window.location.href = `movie-details.html?movieId=${item.id}`;
    return;
  }
  if (mediaType === 'tv') {
    window.location.href = `tv-details.html?tvSeriesId=${item.id}`;
    return;
  }
  if (mediaType === 'person') {
    const department = item.known_for_department;
    if (department === 'Directing') {
      localStorage.setItem('selectedDirectorId', item.id.toString());
      window.location.href = 'director-details.html?' + item.id;
    } else {
      localStorage.setItem('selectedActorId', item.id.toString());
      window.location.href = 'actor-details.html?' + item.id;
    }
  }
}

function setupRailNav() {
  const railBodies = document.querySelectorAll('.rail-body');
  if (!railBodies.length) {
    return;
  }

  railBodies.forEach(body => {
    const track = body.querySelector('.rail-track');
    if (!track) {
      return;
    }
    const prevBtn = body.querySelector('.rail-prev');
    const nextBtn = body.querySelector('.rail-next');
    const scrollAmount = () => Math.round(track.clientWidth * 0.8);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });
    }
  });
}

async function getMostVisitedMovieGenre() {
  const movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
  let mostVisitedGenre = null;
  let maxVisits = 0;
  for (const movieId in movieVisits) {
    const visits = movieVisits[movieId];
    if (visits.count > maxVisits) {
      maxVisits = visits.count;
      mostVisitedGenre = await fetchGenreForMovie(movieId);
    }
  }
  return mostVisitedGenre;
}

async function fetchGenreForMovie(movieId) {
  const movieDetailsUrl = buildUrl(`/movie/${movieId}`, 'language=en-US');
  const response = await fetchJson(movieDetailsUrl);
  if (!response || !response.genres || !response.genres[0]) {
    return null;
  }
  return response.genres[0].id;
}

async function fetchRecommendedReleases() {
  let url;
  const mostCommonGenre = typeof getMostCommonGenre === 'function' ? getMostCommonGenre() : null;
  const mostVisitedMovieGenre = await getMostVisitedMovieGenre();

  try {
    const genreId = mostVisitedMovieGenre || mostCommonGenre;
    if (!genreId || genreId === 'Not Available') {
      throw new Error('Genre ID is not valid.');
    }
    url = buildUrl('/discover/movie', `language=en-US&with_genres=${genreId}`);
  } catch (error) {
    console.log('Fetching recommended movies failed or data issues:', error);
    url = buildUrl('/movie/popular', 'language=en-US&page=1');
  }

  const data = await fetchJson(url);
  return data?.results || [];
}
