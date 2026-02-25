// Sitemap Generator for ShiftMyHome SEO Pages
// Automatically generates sitemap.xml with all service/city combinations

import { seoServices, getAllServiceSlugs } from '../config/seoServices';
import { scotlandCities, getAllCitySlugs } from '../config/seoCities';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Generate all URLs for sitemap
export function generateSitemapUrls(): SitemapUrl[] {
  const baseUrl = 'https://shiftmyhome.co.uk';
  const today = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // 1. Main pages (highest priority)
  urls.push(
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/#about`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/#services`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/#booking`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/#contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7
    }
  );

  // 2. Service pages (high priority)
  seoServices.forEach(service => {
    urls.push({
      loc: `${baseUrl}/${service.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // 3. City-specific service pages (medium-high priority)
  seoServices.forEach(service => {
    scotlandCities.forEach(city => {
      urls.push({
        loc: `${baseUrl}/${service.slug}/${city.slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: city.isPopular ? 0.8 : 0.7
      });
    });
  });

  return urls;
}

// Generate XML sitemap string
export function generateSitemapXML(): string {
  const urls = generateSitemapUrls();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  const baseUrl = 'https://shiftmyhome.co.uk';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
User-agent: *
Disallow: /admin
Disallow: /#/admin

# Crawl-delay for nice bots
User-agent: *
Crawl-delay: 1
`;
}

// Get all service/city route combinations
export function getAllSeoRoutes(): Array<{ service: string; city: string }> {
  const routes: Array<{ service: string; city: string }> = [];
  
  seoServices.forEach(service => {
    scotlandCities.forEach(city => {
      routes.push({
        service: service.slug,
        city: city.slug
      });
    });
  });
  
  return routes;
}

// Statistics for admin panel
export function getSitemapStats() {
  const serviceSlugs = getAllServiceSlugs();
  const citySlugs = getAllCitySlugs();
  const totalPages = serviceSlugs.length * citySlugs.length;
  
  return {
    totalServices: serviceSlugs.length,
    totalCities: citySlugs.length,
    totalSeoPages: totalPages,
    totalUrls: generateSitemapUrls().length,
    estimatedTrafficPotential: totalPages * 50 // Rough estimate
  };
}
