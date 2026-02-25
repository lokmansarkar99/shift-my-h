import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, User, ArrowLeft, Search, Filter } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Header } from '../Header';
import { Footer } from '../Footer';

interface BlogPageProps {
  onGoBack: () => void;
  onShowLogin: (tab: 'customer' | 'driver' | 'admin') => void;
  onShowCallback: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  onShowSitemap: () => void;
}

export default function BlogPage({ 
  onGoBack, 
  onShowLogin, 
  onShowCallback,
  onShowTerms,
  onShowPrivacy,
  onShowSitemap
}: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const posts = [
    {
      title: '10 Essential Tips for a Stress-Free Move',
      excerpt: 'Planning a move? Follow these expert tips to make your relocation smooth and hassle-free. Learn from professionals who have helped thousands of families relocate successfully.',
      author: 'ShiftMyHome Team',
      date: 'Dec 10, 2024',
      readTime: '5 min read',
      category: 'Moving Tips',
      image: 'https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'How to Pack Fragile Items Like a Pro',
      excerpt: 'Learn the professional techniques for packing delicate belongings safely and securely. Protect your valuables during transit with expert packing methods.',
      author: 'Sarah Johnson',
      date: 'Dec 8, 2024',
      readTime: '7 min read',
      category: 'Packing Guide',
      image: 'https://images.unsplash.com/photo-1609188077093-bafe2e2c118d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwdmFufGVufDF8fHx8MTc2NTc2OTg4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Moving Checklist: Your Complete Guide',
      excerpt: 'A comprehensive checklist to ensure nothing gets forgotten during your move. Stay organized from start to finish with this detailed planning guide.',
      author: 'Michael Brown',
      date: 'Dec 5, 2024',
      readTime: '10 min read',
      category: 'Planning',
      image: 'https://images.unsplash.com/photo-1514739677676-e2c42dc777c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMG1vdmluZ3xlbnwxfHx8fDE3NjU3MjM3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Office Relocation: Best Practices',
      excerpt: 'Moving your business? Here are the essential steps for a successful office relocation. Minimize downtime and maximize efficiency with our proven strategies.',
      author: 'Emma Wilson',
      date: 'Dec 1, 2024',
      readTime: '8 min read',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU4MTQ4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Sustainable Moving: Eco-Friendly Tips',
      excerpt: 'Make your move environmentally friendly with these green moving strategies. Reduce waste and carbon footprint while relocating your home or office.',
      author: 'David Martinez',
      date: 'Nov 28, 2024',
      readTime: '6 min read',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1644079446600-219068676743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzY1ODA1MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Cost-Saving Strategies for Your Move',
      excerpt: 'Discover practical ways to reduce moving costs without compromising quality. Get professional moving services while staying within your budget.',
      author: 'ShiftMyHome Team',
      date: 'Nov 25, 2024',
      readTime: '5 min read',
      category: 'Budget Tips',
      image: 'https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Moving with Pets: A Complete Guide',
      excerpt: 'Ensure your furry friends have a smooth transition to your new home. Expert advice on keeping pets calm and safe during the moving process.',
      author: 'Lisa Anderson',
      date: 'Nov 22, 2024',
      readTime: '6 min read',
      category: 'Moving Tips',
      image: 'https://images.unsplash.com/photo-1514739677676-e2c42dc777c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMG1vdmluZ3xlbnwxfHx8fDE3NjU3MjM3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Storage Solutions: Short vs Long Term',
      excerpt: 'Understanding your storage options can save time and money. Compare short-term and long-term storage solutions for your moving needs.',
      author: 'James McGregor',
      date: 'Nov 20, 2024',
      readTime: '7 min read',
      category: 'Planning',
      image: 'https://images.unsplash.com/photo-1644079446600-219068676743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzY1ODA1MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'First-Time Mover\'s Survival Guide',
      excerpt: 'Never moved before? This comprehensive guide covers everything you need to know for your first relocation experience.',
      author: 'ShiftMyHome Team',
      date: 'Nov 18, 2024',
      readTime: '9 min read',
      category: 'Moving Tips',
      image: 'https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const categories = ['All', 'Moving Tips', 'Packing Guide', 'Planning', 'Business', 'Sustainability', 'Budget Tips'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory && selectedCategory !== 'All'
      ? post.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

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

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-cyan-300" />
              <span className="text-white text-sm tracking-wider uppercase">Our Blog</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Moving Insights &{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Expert Advice
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Stay informed with tips, guides, and industry insights from our moving experts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                      className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                        (category === 'All' && !selectedCategory) || selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-slate-600 text-lg">
              Showing <span className="font-bold text-blue-600">{filteredPosts.length}</span> articles
              {selectedCategory && selectedCategory !== 'All' && ` in "${selectedCategory}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-block bg-gradient-to-r ${post.gradient} text-white text-xs px-3 py-1.5 rounded-full shadow-lg`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <button className="group/btn flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-300">
                      <span className="text-sm font-semibold">Read More</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-8 md:p-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h3 className="text-3xl font-bold text-slate-900">
                  Ready to Make Your Move?
                </h3>
              </div>
              <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                Put these tips into action with Scotland's most trusted moving service
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGoBack}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-xl font-semibold text-lg"
                >
                  Get Instant Quote
                </button>
                <button
                  onClick={onShowCallback}
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Request Callback
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer 
        onShowTerms={onShowTerms}
        onShowPrivacy={onShowPrivacy}
        onShowSitemap={onShowSitemap}
      />

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
