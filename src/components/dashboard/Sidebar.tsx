import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Milestone, 
  ClipboardCheck, 
  Image, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Modules', path: '/admin/modules', icon: Milestone },
    { name: 'Lessons', path: '/admin/lessons', icon: ClipboardCheck },
    { name: 'Media Library', path: '/admin/media', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay (only visible when sidebar is open on mobile) */}
      <div 
        onClick={onToggle}
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Container */}
      <motion.aside
        animate={{ 
          width: isOpen ? 256 : 72,
          x: 0 // Keep on-screen
        }}
        initial={false}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-16 bottom-0 left-0 z-30 flex flex-col justify-between border-r border-brand-border/30 bg-[#071A26]/90 backdrop-blur-md transition-all duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Menu */}
        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl border transition-all duration-200 group text-left relative overflow-hidden ${
                  isActive 
                    ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,229,255,0.08)]' 
                    : 'bg-transparent border-transparent text-brand-text-muted hover:text-white hover:bg-brand-card/30'
                }`}
                title={item.name}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-brand-cyan rounded-r-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <span className={`transition-colors duration-200 flex-shrink-0 ${
                  isActive ? 'text-brand-cyan' : 'text-brand-text-muted group-hover:text-white'
                }`}>
                  <Icon size={20} />
                </span>

                {/* Text (hidden when sidebar collapsed on desktop) */}
                <span className={`text-sm font-semibold transition-opacity duration-200 select-none ${
                  isOpen ? 'opacity-100' : 'lg:opacity-0 lg:pointer-events-none lg:w-0'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Collapse Arrow Button at Bottom */}
        <div className="hidden lg:flex items-center justify-center p-4 border-t border-brand-border/10">
          <button
            onClick={onToggle}
            className="p-2 text-brand-text-muted hover:text-brand-cyan hover:bg-brand-card/40 rounded-lg border border-brand-border/10 transition-all focus:outline-none"
            aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
