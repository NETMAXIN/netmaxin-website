'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { Calendar, User, ArrowRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const blogs = [
  {
    id: 1,
    title: 'The Future of Web Development in 2025',
    excerpt: 'Explore the latest trends and technologies shaping the web development landscape.',
    author: 'Sarah Johnson',
    date: 'Mar 20, 2025',
    category: 'Technology',
    image: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Digital Marketing Strategies for SMBs',
    excerpt: 'Practical tips and strategies to help small businesses maximize their digital presence.',
    author: 'Mike Chen',
    date: 'Mar 18, 2025',
    category: 'Marketing',
    image: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Building Scalable Cloud Architectures',
    excerpt: 'A comprehensive guide to designing and implementing scalable cloud solutions.',
    author: 'Emma Davis',
    date: 'Mar 15, 2025',
    category: 'Cloud',
    image: 'bg-gradient-to-br from-green-500 to-green-600'
  },
  {
    id: 4,
    title: 'Mobile-First Design: Best Practices',
    excerpt: 'Learn how to design web applications that work seamlessly on all devices.',
    author: 'Alex Martinez',
    date: 'Mar 12, 2025',
    category: 'Design',
    image: 'bg-gradient-to-br from-pink-500 to-pink-600'
  },
  {
    id: 5,
    title: 'AI in Business Automation',
    excerpt: 'Discover how artificial intelligence is revolutionizing business processes.',
    author: 'Lisa Wang',
    date: 'Mar 10, 2025',
    category: 'AI',
    image: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
  },
  {
    id: 6,
    title: 'Security Best Practices for Web Apps',
    excerpt: 'Essential security measures every developer should implement.',
    author: 'Tom Wilson',
    date: 'Mar 8, 2025',
    category: 'Security',
    image: 'bg-gradient-to-br from-red-500 to-red-600'
  }
]

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Technology', 'Marketing', 'Cloud', 'Design', 'AI', 'Security']

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-28 pb-10 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-block mb-4">
              <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Latest Insights</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">NETMAXIN </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 font-bold">Blog</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Insights, tips, and trends on digital transformation, technology, and business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-black/5 dark:bg-white/5 text-foreground dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map(blog => (
                <a key={blog.id} href={`/blogs/${blog.id}`} className="group h-full">
                  <div className="relative rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 overflow-hidden h-full hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer flex flex-col">
                    {/* Image */}
                    <div className={`h-48 ${blog.image} relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                          {blog.category}
                        </span>
                        <span className="text-xs text-foreground/50 dark:text-white/50">•</span>
                        <span className="text-xs text-foreground/50 dark:text-white/50">{blog.date}</span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground dark:text-white mb-3 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all">
                        {blog.title}
                      </h3>

                      <p className="text-sm text-foreground/70 dark:text-white/60 line-clamp-2 mb-4 flex-1">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-foreground/60 dark:text-white/50">
                          <User size={14} />
                          {blog.author}
                        </div>
                        <ArrowRight size={18} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/70 dark:text-white/60">
                No articles found. Try adjusting your search or filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
