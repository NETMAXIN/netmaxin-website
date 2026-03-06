'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { X } from 'lucide-react'
import { useState } from 'react'

const albums = [
  {
    id: 1,
    category: 'Office & Team',
    images: [
      { id: 1, title: 'Team Meeting', gradient: 'from-blue-400 to-blue-600' },
      { id: 2, title: 'Office Space', gradient: 'from-purple-400 to-purple-600' },
      { id: 3, title: 'Team Celebration', gradient: 'from-pink-400 to-pink-600' },
      { id: 4, title: 'Brainstorming Session', gradient: 'from-green-400 to-green-600' }
    ]
  },
  {
    id: 2,
    category: 'Events & Conferences',
    images: [
      { id: 5, title: 'Tech Conference 2024', gradient: 'from-orange-400 to-orange-600' },
      { id: 6, title: 'Workshop Series', gradient: 'from-cyan-400 to-cyan-600' },
      { id: 7, title: 'Client Summit', gradient: 'from-indigo-400 to-indigo-600' },
      { id: 8, title: 'Networking Event', gradient: 'from-rose-400 to-rose-600' }
    ]
  },
  {
    id: 3,
    category: 'Projects & Work',
    images: [
      { id: 9, title: 'Project Kickoff', gradient: 'from-violet-400 to-violet-600' },
      { id: 10, title: 'Development Sprint', gradient: 'from-fuchsia-400 to-fuchsia-600' },
      { id: 11, title: 'Product Launch', gradient: 'from-teal-400 to-teal-600' },
      { id: 12, title: 'Client Presentation', gradient: 'from-emerald-400 to-emerald-600' }
    ]
  },
  {
    id: 4,
    category: 'Company Culture',
    images: [
      { id: 13, title: 'Team Building', gradient: 'from-amber-400 to-amber-600' },
      { id: 14, title: 'Wellness Program', gradient: 'from-lime-400 to-lime-600' },
      { id: 15, title: 'Charity Event', gradient: 'from-sky-400 to-sky-600' },
      { id: 16, title: 'Annual Party', gradient: 'from-slate-400 to-slate-600' }
    ]
  }
]

export default function AlbumPage() {
  const [selectedImage, setSelectedImage] = useState<{ category: string; image: any } | null>(null)

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-32 pb-16 dark:bg-gradient-to-b dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 rounded-full glass dark:glass-dark">
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Memories</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">NETMAXIN </span>
              <span className="gradient-text font-black">Photo Gallery</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Explore behind-the-scenes moments from our team, events, and projects.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 lg:py-32 dark:bg-gradient-to-b dark:from-slate-900/50 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {albums.map(album => (
            <div key={album.id} className="mb-16">
              <h2 className="text-3xl font-bold text-foreground dark:text-white mb-8">{album.category}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {album.images.map(image => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage({ category: album.category, image })}
                    className="group relative overflow-hidden rounded-xl h-64 cursor-pointer"
                  >
                    {/* Image */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient} transition-transform duration-300 group-hover:scale-110`} />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-bold text-lg">{image.title}</h3>
                      </div>
                    </div>

                    {/* Border */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-xl transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <div className={`bg-gradient-to-br ${selectedImage.image.gradient} rounded-xl w-full h-96`} />

            {/* Details */}
            <div className="mt-6 glass dark:glass-dark p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">
                {selectedImage.image.title}
              </h3>
              <p className="text-foreground/70 dark:text-white/60">
                {selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
