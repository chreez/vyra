import type { Context } from "https://edge.netlify.com";

const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Applebot',
  'iMessageLinkPreview',
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return CRAWLER_USER_AGENTS.some(bot =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

interface BlogMeta {
  title: string;
  date: string;
  category: string;
  videoId: string;
  published: boolean;
  excerpt: string;
}

export default async function handler(request: Request, context: Context) {
  const userAgent = request.headers.get('user-agent');

  // If not a crawler, pass through to the SPA
  if (!isCrawler(userAgent)) {
    return context.next();
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');

  // Extract slug from /blog/:slug
  if (pathParts[1] !== 'blog' || !pathParts[2]) {
    return context.next();
  }

  const slug = pathParts[2];
  const siteUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch meta.json for this article
    const metaResponse = await fetch(`${siteUrl}/data/blog/${slug}/meta.json`);

    if (!metaResponse.ok) {
      return context.next();
    }

    const meta: BlogMeta = await metaResponse.json();

    // Build the OG image URL (hero.jpg in the blog assets folder)
    const ogImage = `${siteUrl}/blog/${slug}/hero.jpg`;
    const canonicalUrl = `${siteUrl}/blog/${slug}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)} | Vyra</title>
  <meta name="description" content="${escapeHtml(meta.excerpt)}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.excerpt)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="Vyra">
  <meta property="article:published_time" content="${meta.date}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.excerpt)}">
  <meta name="twitter:image" content="${ogImage}">

  <link rel="canonical" href="${canonicalUrl}">
</head>
<body>
  <h1>${escapeHtml(meta.title)}</h1>
  <p>${escapeHtml(meta.excerpt)}</p>
  <a href="${canonicalUrl}">Read full article</a>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    // On any error, fall through to normal SPA
    return context.next();
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const config = {
  path: '/blog/*',
};
