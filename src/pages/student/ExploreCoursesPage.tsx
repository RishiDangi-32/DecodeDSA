import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  LogOut, 
  Code2, 
  BarChart2, 
  Trophy, 
  RefreshCw,
  BookOpen,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { Course } from '../../types';
import mitsLogo from '../../assets/images/mits_logo.png';
import heroIllustration from '../../assets/images/hero_illustration.png';

// Concise complete descriptions (~110-120 chars) avoiding mid-sentence ellipsis truncation
const curatedDescriptions: Record<string, string> = {
  'cpp-fundamentals': 'Master C++ syntax, memory pointers, functions, and object-oriented design through hands-on compiler exercises.',
  'data-structures': 'Organize and manage data efficiently with linked lists, stacks, queues, trees, and graphs through live visual sandboxes.',
  'algorithms': 'Master algorithmic paradigms for searching, sorting, graph traversal, and recursion with interactive simulations.',
};

// Fallback courses to ensure high-fidelity rendering if backend is offline
const defaultCourses: Course[] = [
  {
    _id: 'default-cpp',
    name: 'C++ Fundamentals',
    slug: 'cpp-fundamentals',
    description: 'Master C++ syntax, memory pointers, functions, and object-oriented design through hands-on compiler exercises.',
    icon: 'Code2',
    order: 1,
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'default-dsa',
    name: 'Data Structure',
    slug: 'data-structures',
    description: 'Organize and manage data efficiently with linked lists, stacks, queues, trees, and graphs through live visual sandboxes.',
    icon: 'Layers',
    order: 2,
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'default-algo',
    name: 'Algorithm',
    slug: 'algorithms',
    description: 'Master algorithmic paradigms for searching, sorting, graph traversal, and recursion with interactive simulations.',
    icon: 'Network',
    order: 3,
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
];

export default function ExploreCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentCourses();
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
      } else {
        setCourses(defaultCourses);
      }
    } catch (e) {
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen md:h-screen md:max-h-screen md:overflow-hidden flex flex-col justify-between bg-[#FFFDF9] text-[#0F172A] relative selection:bg-[#0284C7]/20 selection:text-[#0B1B2B]">
      
      {/* Subtle warm background textures & grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3]" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Soft warm corner gradient shapes matching reference */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-16 right-1/3 w-80 h-80 bg-sky-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================
          1. HEADER (Integrated Search Bar between Logo and Sign Out)
         ======================================================== */}
      <header className="relative z-30 w-full h-16 sm:h-[72px] bg-[#EEF2F6]/95 backdrop-blur-md border border-black flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between gap-4 sm:gap-6 relative z-10">
          
          {/* Left: DecodeDSA Logo & Brand (Vertically centered) */}
          <a href="/" className="flex items-center gap-3.5 group select-none shrink-0 self-center">
            <div className="h-13 sm:h-14 w-16 sm:w-18 bg-white rounded-xl flex items-center justify-center p-0.5 shadow-xs border border-slate-200/80 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src={mitsLogo} 
                alt="MITS Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex items-center tracking-tight font-black text-2xl sm:text-[26px] leading-none">
              <span className="text-[#0B1B2B]">Decode</span>
              <span className="text-[#0284C7] ml-0.5">DSA</span>
            </div>
          </a>

          {/* Middle: Integrated Search Bar (Crisp light surface with Ctrl + K badge) */}
          <div className="flex-1 max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] mx-auto">
            <div className="relative w-full bg-[#FFFFFF] border border-[#CBD5E1] hover:border-slate-400 focus-within:border-[#0284C7] focus-within:ring-2 focus-within:ring-[#0284C7]/15 rounded-xl px-3.5 py-1.5 sm:py-2 shadow-xs hover:shadow-sm transition-all flex items-center gap-2.5">
              <Search size={15} className="text-slate-400 focus-within:text-[#0284C7] shrink-0 transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search active courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none flex-1 font-medium"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
                  >
                    <X size={13} />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md select-none pointer-events-none">
                  Ctrl + K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right: Sign Out Button (Ghost / Secondary button styling) */}
          <button 
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-3.5 py-2 bg-white/70 hover:bg-white text-[#475569] hover:text-[#1E293B] text-xs sm:text-sm font-semibold rounded-xl border border-[#E2E8F0] hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-95 shrink-0 self-center"
          >
            <LogOut size={15} className="text-[#475569] group-hover:text-[#1E293B] transition-colors" strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. MAIN CONTENT (Hero Section & Course Cards - Cohesive, Above the Fold)
         ======================================================== */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex-1 flex flex-col justify-start pt-4 sm:pt-5 pb-6 sm:pb-8 lg:pb-10 gap-5 sm:gap-6 lg:gap-7">
        
        {/* HERO SECTION: Strict two-column grid (1.1fr 0.9fr, 2.5rem gap) */}
        <div 
          className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-10 items-center flex-shrink-0"
          style={{ gap: '2.5rem', alignItems: 'center' }}
        >
          
          {/* LEFT: Heading, Justified Description, Single-line Chips */}
          <div className="relative z-20 flex flex-col items-start gap-2.5 min-w-0">
            
            {/* Technical Sans Main Heading (Plus Jakarta Sans, font-weight: 700, letter-spacing: -0.02em) */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] font-sans font-bold italic tracking-[-0.02em] whitespace-nowrap"
            >
              <span className="text-[#0B1B2B]">EXPLORE</span>{' '}
              <span className="text-[#EA580C] hover:opacity-90 transition-opacity">COURSES</span>
            </motion.h1>

            {/* Description (Left-aligned, comfortable reading width & line-height) */}
            <motion.p 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.20, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-[13px] lg:text-sm text-[#334155] font-medium text-left max-w-[52ch] leading-[1.6]"
              style={{ textAlign: 'left', maxWidth: '52ch', lineHeight: '1.6' }}
            >
              Choose a learning track. Each course pairs theoretical concepts with an interactive visual sandbox, quiz questions, and a built-in C++ compiler.
            </motion.p>

            {/* Feature Highlights Row: Single line of horizontal micro-cards */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 sm:gap-2.5 pt-1 flex-nowrap"
            >
              
              {/* Feature 1: Interactive Simulations */}
              <motion.div 
                whileHover={{ y: -1.5, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="group/pill inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#F8FAFC] hover:bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-default select-none shrink-0"
              >
                <div className="w-5 h-5 rounded-md bg-[#FFF1EB] flex items-center justify-center text-[#EA580C] shrink-0 group-hover/pill:scale-105 transition-transform">
                  <Code2 size={13} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-bold text-[#0B1B2B] whitespace-nowrap tracking-tight">
                  Interactive Simulations
                </span>
              </motion.div>

              {/* Feature 2: Visual Learning */}
              <motion.div 
                whileHover={{ y: -1.5, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="group/pill inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#F8FAFC] hover:bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-default select-none shrink-0"
              >
                <div className="w-5 h-5 rounded-md bg-[#ECFDF5] flex items-center justify-center text-[#059669] shrink-0 group-hover/pill:scale-105 transition-transform">
                  <BarChart2 size={13} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-bold text-[#0B1B2B] whitespace-nowrap tracking-tight">
                  Visual Learning
                </span>
              </motion.div>

              {/* Feature 3: Practice & Assessments */}
              <motion.div 
                whileHover={{ y: -1.5, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="group/pill inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#F8FAFC] hover:bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-default select-none shrink-0"
              >
                <div className="w-5 h-5 rounded-md bg-[#FEF9C3] flex items-center justify-center text-[#CA8A04] shrink-0 group-hover/pill:scale-105 transition-transform">
                  <Trophy size={13} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-bold text-[#0B1B2B] whitespace-nowrap tracking-tight">
                  Practice & Assessments
                </span>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT: Hero Visual (Clean, isolated, directly masked with CSS mask-image) */}
          <div className="relative z-10 flex items-center justify-end w-full overflow-visible">
            
            {/* Subtle decorative geometric dots behind the visual */}
            <div 
              className="absolute -top-3 -right-2 w-44 h-28 opacity-20 pointer-events-none -z-10"
              style={{
                backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }}
            />

            {/* Soft desk shadow directly anchored to image */}
            <div className="absolute bottom-0 right-4 sm:right-8 w-[380px] lg:w-[480px] xl:w-[560px] h-5 bg-gradient-to-t from-black/[0.04] to-transparent rounded-full blur-md pointer-events-none" />

            {/* Hero Visual Container */}
            <div className="relative select-none pointer-events-none w-full max-w-[560px] sm:max-w-[620px] md:max-w-[680px] lg:max-w-[740px] xl:max-w-[800px] flex justify-end">
              <img 
                src={heroIllustration} 
                alt="DecodeDSA Learning Desk" 
                className="w-full h-auto object-contain pointer-events-none select-none"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }}
              />
            </div>

          </div>

        </div>

        {/* BOTTOM: COURSE CARDS SECTION (Three cards in one row, comfortably above the fold) */}
        <div className="w-full">
          {loading ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="animate-spin text-[#0284C7]" size={28} />
              <span className="text-xs font-semibold text-slate-500">Loading syllabus tracks...</span>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-7 items-stretch">
              {filteredCourses.map((course, index) => {
                const isFirst = index === 0 || course.slug.includes('cpp') || course.name.toLowerCase().includes('c++');
                const isSecond = index === 1 || course.slug.includes('data') || course.name.toLowerCase().includes('data');
                const isThird = index === 2 || course.slug.includes('algo') || course.name.toLowerCase().includes('algo');

                let theme = {
                  badgeText: '1st',
                  badgeBg: 'bg-gradient-to-br from-[#FF6B4A] to-[#EA580C]',
                  title: 'C++ Fundamentals',
                  hoverGlow: 'hover:shadow-[0_12px_28px_-4px_rgba(234,88,12,0.18),0_6px_16px_rgba(0,0,0,0.06)]',
                };

                if (isSecond) {
                  theme = {
                    badgeText: '2nd',
                    badgeBg: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
                    title: 'Data Structure',
                    hoverGlow: 'hover:shadow-[0_12px_28px_-4px_rgba(5,150,105,0.18),0_6px_16px_rgba(0,0,0,0.06)]',
                  };
                } else if (isThird) {
                  theme = {
                    badgeText: '3rd',
                    badgeBg: 'bg-gradient-to-br from-[#F43F5E] to-[#BE123C]',
                    title: 'Algorithm',
                    hoverGlow: 'hover:shadow-[0_12px_28px_-4px_rgba(225,29,72,0.18),0_6px_16px_rgba(0,0,0,0.06)]',
                  };
                }

                return (
                  <motion.div
                    key={course._id || index}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      y: -4,
                      transition: { duration: 0.22, ease: 'easeOut' },
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => navigate(`/student/courses/${course.slug}`)}
                    className={`relative group rounded-2xl border border-black bg-white p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] ${theme.hoverGlow} cursor-pointer overflow-hidden transition-all duration-300`}
                  >
                    {/* Subtle light sweep across the card on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    
                    {/* Card Top & Middle Content */}
                    <div className="space-y-2.5 relative z-10">
                      
                      {/* Header Row: Badge on Left, Course Title on Right */}
                      <div className="flex items-center gap-3 select-none">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${theme.badgeBg} text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform duration-200`}>
                          {theme.badgeText}
                        </div>

                        {/* Course Title (Technical Sans, font-weight: 700, letter-spacing: -0.02em, Black Color) */}
                        <h2 className="text-lg sm:text-xl lg:text-[22px] font-sans font-bold tracking-[-0.02em] leading-tight text-black">
                          {theme.title}
                        </h2>
                      </div>

                      {/* Course Description (Curated ~110-120 chars to avoid mid-sentence truncation) */}
                      <p className="text-[11px] sm:text-xs text-[#334155] leading-relaxed font-medium">
                        {curatedDescriptions[course.slug] || course.description || 'Core syllabus concepts and hands-on exercises.'}
                      </p>

                    </div>

                    {/* Card Bottom: Divider & Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end relative z-10">
                      {/* Primary "Explore Syllabus →" Filled Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/courses/${course.slug}`);
                        }}
                        className="py-1.5 sm:py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-xs hover:shadow-sm transition-all duration-200 inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span>Explore Syllabus</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-white border border-slate-200/80 rounded-2xl max-w-md mx-auto shadow-xs">
              <BookOpen size={30} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0B1B2B]">No courses match your search</p>
              <button
                onClick={() => setSearch('')}
                className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
