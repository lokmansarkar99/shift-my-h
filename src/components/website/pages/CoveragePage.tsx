import React from 'react';
import { MapPin, TrendingUp, Clock, CheckCircle, ArrowLeft, Truck, Package, Users, Target } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';

interface CoveragePageProps {
  onGoBack: () => void;
  onShowLogin: (tab: 'customer' | 'driver' | 'admin') => void;
  onShowCallback: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  onShowSitemap: () => void;
}

export default function CoveragePage({ 
  onGoBack, 
  onShowLogin, 
  onShowCallback,
  onShowTerms,
  onShowPrivacy,
  onShowSitemap
}: CoveragePageProps) {
  const scotlandCities = [
    { name: 'Edinburgh', population: '525k', region: 'East Scotland' },
    { name: 'Glasgow', population: '635k', region: 'West Scotland' },
    { name: 'Aberdeen', population: '230k', region: 'North East' },
    { name: 'Dundee', population: '148k', region: 'East Scotland' },
    { name: 'Inverness', population: '70k', region: 'Highlands' },
    { name: 'Stirling', population: '37k', region: 'Central Scotland' },
    { name: 'Perth', population: '48k', region: 'Central Scotland' },
    { name: 'Paisley', population: '77k', region: 'West Scotland' },
    { name: 'East Kilbride', population: '75k', region: 'West Scotland' },
    { name: 'Livingston', population: '57k', region: 'East Scotland' },
    { name: 'Hamilton', population: '54k', region: 'West Scotland' },
    { name: 'Cumbernauld', population: '52k', region: 'Central Scotland' },
    { name: 'Kirkcaldy', population: '49k', region: 'East Scotland' },
    { name: 'Dunfermline', population: '51k', region: 'East Scotland' },
    { name: 'Ayr', population: '46k', region: 'South West' },
    { name: 'Kilmarnock', population: '46k', region: 'South West' },
    { name: 'Greenock', population: '44k', region: 'West Scotland' },
    { name: 'Glenrothes', population: '39k', region: 'East Scotland' },
    { name: 'Falkirk', population: '36k', region: 'Central Scotland' },
    { name: 'Dumfries', population: '33k', region: 'South Scotland' },
    { name: 'Motherwell', population: '32k', region: 'West Scotland' },
  ];

  const northernEnglandCities = [
    { name: 'Newcastle upon Tyne', population: '302k', region: 'North East England' },
    { name: 'Sunderland', population: '275k', region: 'North East England' },
    { name: 'Carlisle', population: '75k', region: 'Cumbria' },
    { name: 'Berwick-upon-Tweed', population: '12k', region: 'Northumberland' },
    { name: 'Durham', population: '48k', region: 'County Durham' },
  ];

  const expandingSoon = [
    { name: 'Isle of Skye', eta: 'Q2 2025', type: 'Island Coverage' },
    { name: 'Orkney Islands', eta: 'Q3 2025', type: 'Island Coverage' },
    { name: 'Shetland Islands', eta: 'Q3 2025', type: 'Island Coverage' },
    { name: 'Western Isles', eta: 'Q2 2025', type: 'Island Coverage' },
    { name: 'Manchester', eta: 'Q1 2025', type: 'Major City' },
    { name: 'Liverpool', eta: 'Q2 2025', type: 'Major City' },
  ];

  const stats = [
    { icon: MapPin, value: '21+', label: 'Cities Covered', color: 'from-blue-500 to-cyan-500' },
    { icon: Truck, value: '5,000+', label: 'Deliveries/Month', color: 'from-purple-500 to-pink-500' },
    { icon: Clock, value: '24/7', label: 'Service Available', color: 'from-green-500 to-emerald-500' },
    { icon: CheckCircle, value: '98%', label: 'On-Time Delivery', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onGetPrice={onGoBack}
        onShowLogin={onShowLogin}
        onShowCallback={onShowCallback}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.1
        }} />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              We cover all of Scotland
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              From Edinburgh to Inverness, and beyond into Northern England
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-105 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scotland Coverage Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold mb-4">
              <MapPin className="w-5 h-5" />
              <span>Scotland Coverage</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Scotland – All major cities & towns
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive coverage across all of Scotland, from the Highlands to the Borders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scotlandCities.map((city, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-blue-300 group cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-slate-500">{city.region}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{city.population} residents</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Northern England Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold mb-4">
              <Target className="w-5 h-5" />
              <span>Cross-Border Service</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Northern England – Cross-border coverage
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Seamless service extending into key locations in Northern England
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {northernEnglandCities.map((city, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all border border-purple-200 hover:border-purple-300 group cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-slate-500">{city.region}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{city.population} residents</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanding Soon Section */}
      <div className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.1
        }} />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold mb-4">
              <TrendingUp className="w-5 h-5" />
              <span>Coming Soon</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Expanding Soon
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We're constantly growing our network to serve you better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expandingSoon.map((location, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {location.name}
                    </h3>
                    <p className="text-sm text-blue-200">{location.type}</p>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold">
                    {location.eta}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Package className="w-4 h-4" />
                  <span>Pre-register for early access</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to move with ShiftMyHome?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Get an instant quote and experience Scotland's most reliable moving service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGoBack}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Instant Quote
            </button>
            <button
              onClick={onShowCallback}
              className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Request Callback
            </button>
          </div>
        </div>
      </div>

      <Footer 
        onShowTerms={onShowTerms}
        onShowPrivacy={onShowPrivacy}
        onShowSitemap={onShowSitemap}
      />
    </div>
  );
}
