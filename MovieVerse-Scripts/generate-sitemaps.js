#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://movie-verse.com';
const FRONTEND_HTML_DIR = path.join(ROOT_DIR, 'MovieVerse-Frontend', 'html');
const ROOT_INDEX_FILE = path.join(ROOT_DIR, 'index.html');

const OUTPUT_FILES = {
  core: 'sitemap-core.xml',
  content: 'sitemap-content.xml',
  games: 'sitemap-games.xml',
};

const EXCLUDED_PAGES = new Set([
  'api_fails.html',
  'chat.html',
  'chatbot.html',
  'create-account.html',
  'favorites.html',
  'feedback.html',
  'generic-error.html',
  'notifications.html',
  'offline.html',
  'reset-password.html',
  'settings.html',
  'sign-in.html',
  'user-profile.html',
]);

const GAME_PAGES = new Set([
  'catch-popcorn.html',
  'dinosaur-jump.html',
  'falling-stars.html',
  'flappy-bird.html',
  'space-invaders.html',
  'stack-blocks.html',
]);

const CONTENT_PAGES = new Set([
  'blogs.html',
  'blog-cinematography.html',
  'blog-editing.html',
  'blog-inception.html',
  'blog-production.html',
  'blog-scoring.html',
  'blog-screenwriting.html',
  'blog-sound.html',
  'blog-special-effects.html',
  'blog-vfx.html',
]);

const PRIORITY_OVERRIDES = {
  '/': { changefreq: 'daily', priority: '1.00' },
  '/MovieVerse-Frontend/html/search.html': { changefreq: 'daily', priority: '0.95' },
  '/MovieVerse-Frontend/html/movie-details.html': { changefreq: 'daily', priority: '0.92' },
  '/MovieVerse-Frontend/html/tv-details.html': { changefreq: 'daily', priority: '0.90' },
  '/MovieVerse-Frontend/html/actor-details.html': { changefreq: 'weekly', priority: '0.90' },
  '/MovieVerse-Frontend/html/director-details.html': { changefreq: 'weekly', priority: '0.90' },
  '/MovieVerse-Frontend/html/company-details.html': { changefreq: 'weekly', priority: '0.88' },
  '/MovieVerse-Frontend/html/blogs.html': { changefreq: 'weekly', priority: '0.88' },
  '/MovieVerse-Frontend/html/inception.html': { changefreq: 'monthly', priority: '0.86' },
  '/MovieVerse-Frontend/html/leonardo-dicaprio.html': { changefreq: 'monthly', priority: '0.84' },
  '/MovieVerse-Frontend/html/christopher-nolan.html': { changefreq: 'monthly', priority: '0.84' },
  '/MovieVerse-Frontend/html/privacy-policy.html': { changefreq: 'yearly', priority: '0.45' },
  '/MovieVerse-Frontend/html/terms-of-service.html': { changefreq: 'yearly', priority: '0.45' },
};

const GROUP_DEFAULTS = {
  core: { changefreq: 'weekly', priority: '0.80' },
  content: { changefreq: 'monthly', priority: '0.78' },
  games: { changefreq: 'weekly', priority: '0.68' },
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

function extractFirstMatch(content, regex) {
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractPageMetadata(content) {
  const robotsRaw = extractFirstMatch(
    content,
    /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  const ogImage = extractFirstMatch(
    content,
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  const title = extractFirstMatch(content, /<title>([\s\S]*?)<\/title>/i).replace(/\s+/g, ' ');

  return {
    robotsRaw,
    ogImage,
    title,
  };
}

function shouldIndexPage(fileName, robotsRaw) {
  if (EXCLUDED_PAGES.has(fileName)) {
    return false;
  }

  if (!robotsRaw) {
    return true;
  }

  const robots = robotsRaw.toLowerCase();
  return !robots.includes('noindex');
}

function getGroup(fileName) {
  if (CONTENT_PAGES.has(fileName)) {
    return 'content';
  }

  if (GAME_PAGES.has(fileName)) {
    return 'games';
  }

  return 'core';
}

function getRoute(fileName, isRoot) {
  if (isRoot) {
    return '/';
  }

  return `/MovieVerse-Frontend/html/${fileName}`;
}

function getPriorityConfig(route, group) {
  if (PRIORITY_OVERRIDES[route]) {
    return PRIORITY_OVERRIDES[route];
  }

  return GROUP_DEFAULTS[group];
}

function buildSitemapUrlEntries() {
  const entries = [];

  const rootStat = fs.statSync(ROOT_INDEX_FILE);
  const rootContent = readFileIfExists(ROOT_INDEX_FILE);
  const rootMeta = extractPageMetadata(rootContent);
  entries.push({
    group: 'core',
    route: '/',
    loc: `${BASE_URL}/`,
    lastmod: toIsoDate(rootStat.mtime),
    ...getPriorityConfig('/', 'core'),
    image: rootMeta.ogImage || '',
    title: rootMeta.title || 'The MovieVerse',
  });

  const htmlFiles = fs
    .readdirSync(FRONTEND_HTML_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  for (const fileName of htmlFiles) {
    const absolutePath = path.join(FRONTEND_HTML_DIR, fileName);
    const content = readFileIfExists(absolutePath);
    const metadata = extractPageMetadata(content);

    if (!shouldIndexPage(fileName, metadata.robotsRaw)) {
      continue;
    }

    const group = getGroup(fileName);
    const route = getRoute(fileName, false);
    const { changefreq, priority } = getPriorityConfig(route, group);
    const fileStat = fs.statSync(absolutePath);

    entries.push({
      group,
      route,
      loc: `${BASE_URL}${route}`,
      lastmod: toIsoDate(fileStat.mtime),
      changefreq,
      priority,
      image: metadata.ogImage || '',
      title: metadata.title || '',
    });
  }

  return entries.sort((left, right) => left.loc.localeCompare(right.loc));
}

function buildUrlNode(entry) {
  const imageNode =
    entry.image && /^https?:\/\//i.test(entry.image)
      ? [
          '    <image:image>',
          `      <image:loc>${escapeXml(entry.image)}</image:loc>`,
          entry.title ? `      <image:title>${escapeXml(entry.title)}</image:title>` : '',
          '    </image:image>',
        ]
          .filter(Boolean)
          .join('\n')
      : '';

  return [
    '  <url>',
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${entry.lastmod}</lastmod>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    imageNode,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function writeUrlSet(fileName, entries) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map(buildUrlNode),
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(ROOT_DIR, fileName), xml, 'utf8');
}

function writeSitemapIndex(groupedEntries) {
  const today = toIsoDate(new Date());
  const indexNodes = Object.entries(OUTPUT_FILES).map(([group, fileName]) => {
    const entries = groupedEntries[group];
    const latestLastmod = entries
      .map((entry) => entry.lastmod)
      .sort((left, right) => right.localeCompare(left))[0] || today;

    return [
      '  <sitemap>',
      `    <loc>${escapeXml(`${BASE_URL}/${fileName}`)}</loc>`,
      `    <lastmod>${latestLastmod}</lastmod>`,
      '  </sitemap>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexNodes,
    '</sitemapindex>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml, 'utf8');
}

function main() {
  const entries = buildSitemapUrlEntries();
  const groupedEntries = {
    core: entries.filter((entry) => entry.group === 'core'),
    content: entries.filter((entry) => entry.group === 'content'),
    games: entries.filter((entry) => entry.group === 'games'),
  };

  Object.entries(OUTPUT_FILES).forEach(([group, fileName]) => {
    writeUrlSet(fileName, groupedEntries[group]);
  });

  writeSitemapIndex(groupedEntries);

  console.log(
    [
      `Generated sitemap index + ${Object.keys(OUTPUT_FILES).length} sitemap files.`,
      `Total URLs: ${entries.length}`,
      ...Object.entries(groupedEntries).map(([group, groupEntries]) => `${group}: ${groupEntries.length}`),
    ].join('\n')
  );
}

main();
