import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  LogOut, 
  GraduationCap, 
  Code2, 
  BarChart2, 
  Trophy, 
  RefreshCw,
  BookOpen,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { Course } from '../../types';
import projectLogo from '../../assets/images/Project_logo.png';
import heroIllustration from '../../assets/images/hero_illustration.png';

// Fallback courses to ensure high-fidelity rendering if backend is offline
const defaultCourses: Course[] = [
  {
    _id: 'default-cpp',
    name: 'C++ Fundamentals',
    slug: 'cpp-fundamentals',
    description: 'Core concepts of C++ programming — syntax, variables, data types, operators, control flow, functions, arrays, pointers, and object-oriented design.',
    icon: 'Code2',
    order: 1,
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'default-dsa',
    name: 'Data Structures',
    slug: 'data-structures',
    description: 'Organise, store, and manage data efficiently with arrays, linked lists, stacks, queues, trees, graphs, and hash tables — taught through interactive visualizations and worked examples.',
    icon: 'Layers',
    order: 2,
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'default-algo',
    name: 'Algorithms',
    slug: 'algorithms',
    description: 'Foundational algorithms for searching, sorting, graph traversal, recursion, and optimisation. Learn the paradigms behind efficient problem solving with real-world applications.',
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
          1. HEADER (Clean light shade of grey with black border on all 4 sides)
         ======================================================== */}
      <header className="relative z-30 w-full h-16 sm:h-[72px] bg-[#EEF2F6]/95 backdrop-blur-md border border-black flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between relative z-10">
          
          {/* Left: DecodeDSA Logo & Brand */}
          <a href="/" className="flex items-center gap-3.5 group select-none">
            <div className="h-12 w-12 sm:h-[56px] sm:w-[56px] rounded-full overflow-hidden bg-white shadow-xs border border-slate-200/80 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform flex-shrink-0">
              <img 
                src={projectLogo} 
                alt="DecodeDSA Logo" 
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="flex items-center tracking-tight font-black text-2xl sm:text-[26px]">
              <span className="text-[#0B1B2B]">Decode</span>
              <span className="text-[#0284C7] ml-0.5">DSA</span>
            </div>
          </a>

          {/* Right: Sign Out Button (Light red background, bold black outline, black text) */}
          <button 
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-black text-xs sm:text-sm font-bold rounded-xl border-2 border-black shadow-xs hover:shadow transition-all duration-200 active:scale-95"
          >
            <LogOut size={15} className="text-black transition-colors" strokeWidth={2.2} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. MAIN CONTENT (Tightened top spacing, search shifted upward)
         ======================================================== */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex-1 flex flex-col justify-center pt-1 sm:pt-2 pb-2 sm:pb-3 gap-1.5 sm:gap-2.5">
        
        {/* TOP: HERO SECTION (Split into Left Copy & Right Illustration) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-6 xl:gap-8 items-center flex-shrink-0">
          
          {/* LEFT: Heading, Badge, Description, Feature Row */}
          <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 space-y-1 sm:space-y-1.5 lg:space-y-2">
            
            {/* Small rounded pill badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03, y: -1 }}
              className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#EBF3FE] border border-[#BFDBFE]/60 text-[#1D68E2] text-xs font-semibold shadow-xs cursor-default transition-colors hover:bg-[#DEECFD]"
            >
              <GraduationCap size={14} className="text-[#1D68E2]" />
              <span>Interactive Learning Platform</span>
            </motion.div>

            {/* Editorial Main Heading (Single line) */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-serif font-bold tracking-tight whitespace-nowrap"
            >
              <span className="text-[#0B1B2B]">Explore Course</span>{' '}
              <span className="text-[#EA580C] hover:opacity-90 transition-opacity">Syllabus</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.20, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed max-w-[480px]"
            >
              Choose a learning track. Each course pairs theoretical concepts with an interactive visual sandbox, quiz questions, and a built-in C++ compiler.
            </motion.p>

            {/* Feature Highlights Row */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5"
            >
              
              {/* Feature 1: Interactive Simulations */}
              <motion.div 
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="group/chip flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 rounded-lg hover:bg-white/80 border border-transparent hover:border-slate-200/60 hover:shadow-xs transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FFF1EB] flex items-center justify-center text-[#EA580C] shrink-0 group-hover/chip:scale-110 transition-transform">
                  <Code2 size={13} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-bold text-[#0B1B2B] whitespace-nowrap">
                  Interactive Simulations
                </span>
              </motion.div>

              {/* Feature 2: Visual Learning */}
              <motion.div 
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="group/chip flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 rounded-lg hover:bg-white/80 border border-transparent hover:border-slate-200/60 hover:shadow-xs transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#059669] shrink-0 group-hover/chip:scale-110 transition-transform">
                  <BarChart2 size={13} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-bold text-[#0B1B2B] whitespace-nowrap">
                  Visual Learning
                </span>
              </motion.div>

              {/* Feature 3: Practice & Assessments */}
              <motion.div 
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="group/chip flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 rounded-lg hover:bg-white/80 border border-transparent hover:border-slate-200/60 hover:shadow-xs transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FEF9C3] flex items-center justify-center text-[#CA8A04] shrink-0 group-hover/chip:scale-110 transition-transform">
                  <Trophy size={13} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-bold text-[#0B1B2B] whitespace-nowrap">
                  Practice & Assessments
                </span>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT: Search Box on Top (Shifted Upward) + Seamless Hero Visual Stretched Left */}
          <div className="md:col-span-7 lg:col-span-7 xl:col-span-7 flex flex-col items-center md:items-end justify-center relative overflow-visible">
            
            {/* SEARCH BOX: Slid upward to nearly touch the bottom line of the header without moving the laptop pic or content */}
            <div className="relative z-20 -translate-y-3.5 sm:-translate-y-5 lg:-translate-y-6 mb-0.5 sm:mb-1 w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] bg-[#071523] border border-cyan-900/50 hover:border-cyan-500/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/25 rounded-full px-3.5 py-1.5 sm:py-2 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all flex items-center gap-2.5 self-end">
              <Search size={15} className="text-[#00E5FF] shrink-0" />
              <input
                type="text"
                placeholder="Search active courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none flex-1 font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-full hover:bg-slate-800"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Atmospheric ambient glow behind the laptop and surrounding elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] lg:w-[560px] xl:w-[640px] h-[190px] lg:h-[230px] bg-gradient-to-r from-amber-100/35 via-sky-100/30 to-orange-100/25 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Subtle decorative geometric dots behind the visual */}
            <div 
              className="absolute -top-3 -right-2 w-44 h-28 opacity-25 pointer-events-none -z-10"
              style={{
                backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }}
            />

            {/* Soft warm desk shadow underneath the laptop */}
            <div className="absolute bottom-1 sm:bottom-2 right-6 sm:right-10 w-[360px] lg:w-[460px] xl:w-[520px] h-5 bg-gradient-to-t from-black/[0.04] to-transparent rounded-full blur-md pointer-events-none" />

            {/* Seamless Hero Visual (Stretched to the left to cover whitespace, blending naturally) */}
            <div className="relative select-none pointer-events-none overflow-visible w-full max-w-[540px] sm:max-w-[580px] md:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] flex justify-end -mt-0.5">
              <img 
                src={heroIllustration} 
                alt="DecodeDSA Learning Desk" 
                className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-300"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse 96% 90% at 52% 50%, black 78%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 96% 90% at 52% 50%, black 78%, transparent 100%)',
                }}
              />
            </div>

          </div>

        </div>

        {/* BOTTOM: COURSE CARDS SECTION (Three cards in one row, placed close to search bar) */}
        <div className="w-full mt-1 sm:mt-1.5">
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
                  outlineBtn: 'border border-[#EA580C] text-[#EA580C] hover:bg-[#FFF5F1]',
                  solidBtn: 'bg-[#EA580C] hover:bg-[#DC2626] text-white',
                  titlePart1: 'C++',
                  titlePart2: 'Fundamentals',
                  part1Color: 'text-[#EA580C]',
                };

                if (isSecond) {
                  theme = {
                    badgeText: '2nd',
                    badgeBg: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
                    outlineBtn: 'border border-[#059669] text-[#059669] hover:bg-[#F0FDF4]',
                    solidBtn: 'bg-[#059669] hover:bg-[#047857] text-white',
                    titlePart1: 'Data',
                    titlePart2: 'Structures',
                    part1Color: 'text-[#059669]',
                  };
                } else if (isThird) {
                  theme = {
                    badgeText: '3rd',
                    badgeBg: 'bg-gradient-to-br from-[#F43F5E] to-[#BE123C]',
                    outlineBtn: 'border border-[#E11D48] text-[#E11D48] hover:bg-[#FFF1F2]',
                    solidBtn: 'bg-[#E11D48] hover:bg-[#BE123C] text-white',
                    titlePart1: 'Algorithms',
                    titlePart2: '',
                    part1Color: 'text-[#E11D48]',
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
                      y: -8,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => navigate(`/student/courses/${course.slug}`)}
                    className="relative group rounded-2xl border-2 border-black bg-white p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] cursor-pointer overflow-hidden transition-shadow duration-300"
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

                        {/* Course Title (to the right side of badge) */}
                        <h2 className="text-xl lg:text-[22px] font-serif font-bold tracking-tight leading-tight">
                          <span className={theme.part1Color}>{theme.titlePart1}</span>
                          {theme.titlePart2 && (
                            <span className="text-[#0B1B2B] ml-1.5">{theme.titlePart2}</span>
                          )}
                        </h2>
                      </div>

                      {/* Course Description */}
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {course.description || 'Core syllabus concepts and hands-on exercises.'}
                      </p>

                    </div>

                    {/* Card Bottom: Divider & Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2.5 relative z-10">
                      
                      {/* Syllabus Track Outlined Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/courses/${course.slug}`);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] sm:text-[11px] tracking-wider uppercase transition-all duration-200 text-center ${theme.outlineBtn}`}
                      >
                        Syllabus Track
                      </button>

                      {/* Explore Solid Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/courses/${course.slug}`);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1 shadow-xs hover:shadow-sm ${theme.solidBtn}`}
                      >
                        <span>Explore</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
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
