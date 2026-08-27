import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#071A26] border-t border-brand-border/20 pt-16 pb-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-brand-border/20">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#home" className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-cyan shadow-cyan-glow"></span>
              <span className="text-lg font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-cyan-blue">
                DSA Visualizer
              </span>
            </a>
            <p className="text-sm text-brand-text-muted leading-relaxed font-medium max-w-sm">
              An educational platform dedicated to teaching Basic C++, Data Structures, and Algorithms through state-of-the-art interactive canvas visualizers and memory simulators.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-brand-bg-secondary border border-brand-border/30 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/40 rounded-lg transition-colors"
              >
                <Github size={16} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-brand-bg-secondary border border-brand-border/30 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/40 rounded-lg transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="mailto:contact@dsaverse.com"
                className="p-2 bg-brand-bg-secondary border border-brand-border/30 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/40 rounded-lg transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#home" className="text-brand-text-muted hover:text-brand-cyan transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="text-brand-text-muted hover:text-brand-cyan transition-colors">Platform Features</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Resources & Licensing</h4>
            <p className="text-sm text-brand-text-muted font-medium leading-relaxed">
              Fully free for academic university courses, BCA syllabus modules, and self-learning programmers worldwide.
            </p>
            <div className="text-[11px] font-semibold text-brand-cyan">
              <span>Licensed under MIT License</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs font-medium text-brand-text-muted">
            &copy; {new Date().getFullYear()} DSA Visualizer (DSAverse). All rights reserved.
          </p>
          <button 
            onClick={handleScrollTop}
            className="p-2 bg-[#0D2538] border border-brand-border/30 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/50 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
