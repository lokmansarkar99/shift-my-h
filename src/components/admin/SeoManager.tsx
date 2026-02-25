import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, Download, BarChart3, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { seoServices } from '../../config/seoServices';
import { scotlandCities } from '../../config/seoCities';
import { generateSitemapXML, generateRobotsTxt, getSitemapStats } from '../../utils/sitemapGenerator';
import { router } from '../../utils/router';

export function SeoManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const stats = getSitemapStats();

  const filteredServices = selectedService 
    ? seoServices.filter(s => s.slug === selectedService)
    : seoServices;

  const filteredCities = searchTerm
    ? scotlandCities.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : scotlandCities;

  const displayCities = selectedCity
    ? filteredCities.filter(c => c.slug === selectedCity)
    : filteredCities.slice(0, 20); // Show first 20 by default

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRobots = () => {
    const txt = generateRobotsTxt();
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenPage = (serviceSlug: string, citySlug: string) => {
    router.navigate({ page: 'seo-service-city', service: serviceSlug, city: citySlug });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            SEO Manager
          </h1>
          <p className="text-slate-600 mt-1">Manage SEO pages, sitemap, and organic traffic strategy</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadSitemap}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Sitemap
          </button>
          <button
            onClick={handleDownloadRobots}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download robots.txt
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm">Total Services</span>
            <CheckCircle2 className="w-5 h-5 text-blue-200" />
          </div>
          <div className="text-3xl font-bold">{stats.totalServices}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm">Total Cities</span>
            <MapPin className="w-5 h-5 text-green-200" />
          </div>
          <div className="text-3xl font-bold">{stats.totalCities}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm">SEO Pages</span>
            <Globe className="w-5 h-5 text-purple-200" />
          </div>
          <div className="text-3xl font-bold">{stats.totalSeoPages}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100 text-sm">Total URLs</span>
            <BarChart3 className="w-5 h-5 text-orange-200" />
          </div>
          <div className="text-3xl font-bold">{stats.totalUrls}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Cities</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by city or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Service</label>
            <select
              value={selectedService || ''}
              onChange={(e) => setSelectedService(e.target.value || null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Services</option>
              {seoServices.map(service => (
                <option key={service.id} value={service.slug}>{service.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by City</label>
            <select
              value={selectedCity || ''}
              onChange={(e) => setSelectedCity(e.target.value || null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Cities</option>
              {filteredCities.map(city => (
                <option key={city.id} value={city.slug}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SEO Pages Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          SEO Pages ({filteredServices.length} services × {displayCities.length} cities = {filteredServices.length * displayCities.length} pages)
        </h2>
        
        <div className="space-y-4">
          {filteredServices.map(service => (
            <div key={service.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-600">{service.shortDescription}</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    £{service.priceRange.min} - £{service.priceRange.max} / {service.priceRange.unit}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {displayCities.map(city => (
                    <button
                      key={city.id}
                      onClick={() => handleOpenPage(service.slug, city.slug)}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${city.isPopular ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {city.name}
                          </div>
                          <div className="text-xs text-slate-500">{city.region}</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>

                {!selectedCity && filteredCities.length > 20 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setSelectedCity('all')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Show all {filteredCities.length} cities →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Best Practices */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-2">SEO Best Practices</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>✓ All pages have unique titles and meta descriptions</li>
              <li>✓ Canonical URLs set to avoid duplicate content</li>
              <li>✓ Schema.org structured data implemented</li>
              <li>✓ Dynamic content prevents thin/duplicate pages</li>
              <li>✓ Sitemap auto-updates with new services/cities</li>
              <li>✓ Mobile-friendly and fast loading pages</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('https://search.google.com/search-console', '_blank')}
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
          >
            <Globe className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-slate-900">Google Search Console</div>
              <div className="text-xs text-slate-500">Submit sitemap & monitor performance</div>
            </div>
          </button>

          <button
            onClick={() => window.open('https://www.bing.com/webmasters', '_blank')}
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
          >
            <Globe className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-slate-900">Bing Webmaster Tools</div>
              <div className="text-xs text-slate-500">Submit to Bing search engine</div>
            </div>
          </button>

          <button
            onClick={handleDownloadSitemap}
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
          >
            <Download className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-slate-900">Export Sitemap</div>
              <div className="text-xs text-slate-500">Download XML for manual submission</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
