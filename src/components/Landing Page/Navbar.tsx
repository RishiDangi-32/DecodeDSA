import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import mitsLogo from '../../assets/images/mits_logo.png';
import LoginButton from './ui/LoginButton';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Developers', href: '#about' }, // Links to developer bio/about section
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto bg-[#0D2538]/70 backdrop-blur-md border border-brand-border/30 rounded-2xl shadow-cyan-glow pl-3 pr-4 sm:pl-4 sm:pr-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Institution Title */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#home" className="flex items-center gap-3 group text-left">
                <div className="h-14 w-18 bg-white rounded-xl flex items-center justify-center p-0.5 shadow-md border border-white/20 overflow-hidden">
                  <img 
                    src={mitsLogo} 
                    alt="MITS Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide group-hover:text-brand-cyan transition-colors">
                    Madhav Institute of Technology & Science, Gwalior
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-brand-yellow">
                    Deemed University
                  </span>
                </div>
              </a>
            </div>

            {/* Right Side Group: Links + Login Button */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-semibold text-brand-text-muted hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Desktop Login Button */}
              <div className="h-12 w-32 flex items-center justify-end">
                <div className="scale-[0.45] origin-right">
                  <LoginButton onClick={() => navigate('/student/courses')} />
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-brand-text-muted hover:text-brand-cyan p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-2 border border-brand-border/30 bg-[#071A26]/95 backdrop-blur-lg rounded-2xl px-4 py-4 space-y-4 shadow-cyan-glow"
            >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium text-brand-text-muted hover:text-brand-cyan hover:bg-brand-card/40 transition-all"
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} className="text-brand-cyan/60" />
                  </a>
                ))}
              </div>
              <div className="pt-3 border-t border-brand-cyan/10 px-3 flex justify-center py-2">
                <div className="scale-[0.55] origin-center">
                  <LoginButton onClick={() => { setMobileMenuOpen(false); navigate('/student/courses'); }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
