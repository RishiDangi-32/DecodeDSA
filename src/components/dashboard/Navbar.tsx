import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, LogOut, Search, BookOpen, Milestone, Clipboard, X } from 'lucide-react';
import mitsLogo from '../../assets/images/mits_logo.png';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ courses: any[]; modules: any[]; lessons: any[] }>({
    courses: [],
    modules: [],
    lessons: []
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results on query change
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const results = await api.search(searchQuery);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          // Toast handled in api helper
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ courses: [], modules: [], lessons: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleResultClick = (route: string) => {
    navigate(route);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-brand-border/30 bg-[#071A26]/80 backdrop-blur-md px-4 flex items-center justify-between"
    >
      {/* Left side: Hamburger Toggle & Logo */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-brand-text-muted hover:text-brand-cyan hover:bg-brand-card/40 rounded-lg border border-brand-border/20 transition-all focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Institution Brand Link */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-2 group text-left"
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 bg-white rounded-lg flex items-center justify-center p-0.5 shadow-md border border-white/20 overflow-hidden flex-shrink-0">
            <img 
              src={mitsLogo} 
              alt="MITS Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="hidden md:flex flex-col select-none">
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide group-hover:text-brand-cyan transition-colors line-clamp-1">
              MITS Gwalior
            </span>
            <span className="text-[9px] font-semibold text-brand-cyan tracking-wider uppercase">
              DSA Visualizer
            </span>
          </div>
        </a>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-4 z-50">
        <div className="relative flex items-center bg-[#0D2538]/50 border border-brand-border/25 rounded-xl px-3.5 py-2 text-brand-text-muted focus-within:border-brand-cyan transition-all">
          <Search size={16} className="text-brand-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Global search courses, modules, lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length > 1 && setShowResults(true)}
            className="w-full bg-transparent border-none text-xs text-brand-text-white placeholder-brand-text-muted focus:outline-none pl-2.5 pr-6"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-brand-text-muted hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown Overlay */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-13 left-0 right-0 rounded-2xl bg-[#071A26]/95 border border-brand-border/40 backdrop-blur-xl shadow-2xl p-4 space-y-4 max-h-[380px] overflow-y-auto no-scrollbar"
            >
              {/* Courses Results */}
              {searchResults.courses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen size={10} />
                    <span>Courses</span>
                  </span>
                  <div className="divide-y divide-brand-border/5">
                    {searchResults.courses.map(course => (
                      <div
                        key={course._id}
                        onClick={() => handleResultClick('/admin/courses')}
                        className="py-2 text-xs font-bold text-brand-text-white hover:text-brand-cyan cursor-pointer transition-colors"
                      >
                        {course.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modules Results */}
              {searchResults.modules.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-1.5">
                    <Milestone size={10} />
                    <span>Modules</span>
                  </span>
                  <div className="divide-y divide-brand-border/5">
                    {searchResults.modules.map(mod => (
                      <div
                        key={mod._id}
                        onClick={() => handleResultClick('/admin/modules')}
                        className="py-2 text-xs font-semibold text-brand-text-white hover:text-brand-cyan cursor-pointer transition-colors"
                      >
                        <div className="font-bold">{mod.name}</div>
                        <div className="text-[9px] text-brand-text-muted mt-0.5">
                          course: {typeof mod.courseId === 'object' ? mod.courseId?.name : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons Results */}
              {searchResults.lessons.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest flex items-center gap-1.5">
                    <Clipboard size={10} />
                    <span>Lessons</span>
                  </span>
                  <div className="divide-y divide-brand-border/5">
                    {searchResults.lessons.map(lesson => {
                      const moduleName = typeof lesson.moduleId === 'object' ? lesson.moduleId?.name : '';
                      const courseName = typeof lesson.moduleId === 'object' && typeof lesson.moduleId?.courseId === 'object'
                        ? (lesson.moduleId.courseId as any)?.name
                        : '';
                      return (
                        <div
                          key={lesson._id}
                          onClick={() => handleResultClick('/admin/lessons')}
                          className="py-2 text-xs font-semibold text-brand-text-white hover:text-brand-cyan cursor-pointer transition-colors"
                        >
                          <div className="font-bold">{lesson.title}</div>
                          <div className="text-[9px] text-brand-text-muted mt-0.5">
                            {courseName} &gt; {moduleName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {searchResults.courses.length === 0 && 
               searchResults.modules.length === 0 && 
               searchResults.lessons.length === 0 && (
                <div className="text-center py-4 text-xs font-bold text-brand-text-muted">
                  No records match "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side: Notifications & Profile Placeholders */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Notification Icon */}
        <button 
          className="p-2 text-brand-text-muted hover:text-brand-cyan hover:bg-brand-card/40 rounded-lg border border-brand-border/10 transition-all relative focus:outline-none"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Tiny active notification dot */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-brand-cyan rounded-full shadow-cyan-glow animate-pulse"></span>
        </button>

        {/* User Profile Avatar Placeholder */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg border border-brand-border/10 bg-brand-card/25">
          <div className="h-7 w-7 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-xs font-bold text-brand-cyan">
            RD
          </div>
          <span className="hidden sm:inline text-xs font-bold text-brand-text-white max-w-[80px] truncate">
            Rishi Dangi
          </span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="p-2 text-brand-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all focus:outline-none"
          aria-label="Logout"
          title="Return to Landing Page"
        >
          <LogOut size={18} />
        </button>
      </div>
    </motion.nav>
  );
}
