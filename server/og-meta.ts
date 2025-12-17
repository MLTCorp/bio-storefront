import { supabase } from "./supabase";
import type { Request, Response, NextFunction } from "express";

// Detect social media crawlers
export function isCrawler(userAgent: string): boolean {
  const crawlers = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'WhatsApp',
    'LinkedInBot',
    'Slackbot',
    'TelegramBot',
    'Discordbot',
    'googlebot',
    'bingbot',
    'Embedly',
    'Quora Link Preview',
    'Showyoubot',
    'outbrain',
    'pinterest',
    'vkShare',
    'W3C_Validator'
  ];
  return crawlers.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

// Escape HTML to prevent XSS
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

interface PageMeta {
  profile_name: string;
  profile_bio: string | null;
  profile_image: string | null;
}

// Generate HTML with dynamic meta tags for crawlers
export function generateMetaHtml(page: PageMeta, username: string, baseUrl: string): string {
  const title = escapeHtml(`${page.profile_name} - Bio`);
  const description = escapeHtml(page.profile_bio || 'Confira meus produtos e conteúdos exclusivos.');
  const image = page.profile_image || `${baseUrl}/opengraph.jpg`;
  const url = `${baseUrl}/${username}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <!-- Redirect to SPA for actual browsers -->
  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <p>Redirecionando...</p>
</body>
</html>`;
}

// Middleware to serve SSR meta tags for crawlers
export async function serveCrawlerMeta(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userAgent = req.headers['user-agent'] || '';
  const pathname = req.originalUrl.split('?')[0];

  // Skip if not a crawler
  if (!isCrawler(userAgent)) {
    next();
    return;
  }

  // Skip API routes and static files
  if (pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname === '/' ||
      pathname.startsWith('/sign-') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/checkout') ||
      pathname.startsWith('/page-editor') ||
      pathname.startsWith('/pages')) {
    next();
    return;
  }

  // Extract username from path (e.g., /michelle -> michelle)
  const username = pathname.slice(1).toLowerCase();

  if (!username || username.includes('/')) {
    next();
    return;
  }

  try {
    // Try pages table first
    let { data: page } = await supabase
      .from('pages')
      .select('profile_name, profile_bio, profile_image')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    // Fallback to stores table
    if (!page) {
      const { data: store } = await supabase
        .from('stores')
        .select('profile_name, profile_bio, profile_image')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (store) {
        page = store;
      }
    }

    if (!page) {
      next();
      return;
    }

    // Determine base URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'biolanding.com';
    const baseUrl = `${protocol}://${host}`;

    // Send dynamic HTML with meta tags
    const html = generateMetaHtml(page, username, baseUrl);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error serving SSR meta tags:', error);
    next();
  }
}
