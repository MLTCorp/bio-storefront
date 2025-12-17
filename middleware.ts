import { next } from '@vercel/edge';

// Detect social media crawlers
function isCrawler(userAgent: string): boolean {
  const crawlers = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'WhatsApp',
    'LinkedInBot',
    'Slackbot',
    'TelegramBot',
    'Discordbot',
    'Embedly',
    'pinterest',
    'vkShare'
  ];
  return crawlers.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

export default function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only process crawler requests for potential username routes
  if (!isCrawler(userAgent)) {
    return next();
  }

  // Skip known routes and files
  if (pathname.startsWith('/api') ||
      pathname.startsWith('/sign-') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/checkout') ||
      pathname.startsWith('/page-editor') ||
      pathname.startsWith('/pages') ||
      pathname.startsWith('/assets') ||
      pathname.includes('.') ||
      pathname === '/') {
    return next();
  }

  // Extract username and rewrite to OG API
  const username = pathname.slice(1).toLowerCase();
  if (username && !username.includes('/')) {
    const ogUrl = new URL(`/api/og/${username}`, request.url);
    return fetch(ogUrl);
  }

  return next();
}

export const config = {
  matcher: ['/((?!api|_next|assets|favicon|.*\\..*).*)'],
};
