import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-black/5 dark:border-white/5 bg-white dark:bg-slate-950/80 overflow-hidden">
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <a href="/" className="hover:opacity-90 transition-opacity block">
                <img
                  src="/Logo%20Design%20Sec.png"
                  alt="Netmaxin Logo"
                  className="h-8 md:h-10 w-auto object-contain block dark:hidden transition-all duration-300"
                />
                <img
                  src="/Logo%20Design%20Sec%20White.png"
                  alt="Netmaxin Logo"
                  className="h-8 md:h-10 w-auto object-contain hidden dark:block transition-all duration-300"
                />
              </a>
            </div>
            <p className="text-foreground/70 dark:text-white/60 text-sm leading-relaxed max-w-xs">Building digital solutions that drive business growth and innovation. Experience the future today.</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/careers" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="/album" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">Gallery</a></li>
              <li><a href="/announcements" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">News</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-foreground dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">Services</a></li>
              <li><a href="/courses" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">Courses</a></li>
              <li><a href="/verify-certificate" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">Verify Certificate</a></li>
              <li><a href="/blogs" className="text-foreground/70 dark:text-white/60 hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-foreground dark:text-white mb-6 uppercase tracking-wider text-sm">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-foreground/70 dark:text-white/70 transition-all hover:scale-110 hover:shadow-lg hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-foreground/70 dark:text-white/70 transition-all hover:scale-110 hover:shadow-lg hover:-translate-y-1">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-foreground/70 dark:text-white/70 transition-all hover:scale-110 hover:shadow-lg hover:-translate-y-1">
                <Github size={18} />
              </a>
              <a href="mailto:team@netmaxin.com" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-foreground/70 dark:text-white/70 transition-all hover:scale-110 hover:shadow-lg hover:-translate-y-1">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        {/* Divider */}
        <div className="h-px bg-black/10 dark:bg-white/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-foreground/60 dark:text-white/50">
          <p>&copy; 2024 NETMAXIN. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
