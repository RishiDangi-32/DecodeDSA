import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, BookOpen, RefreshCw, Milestone, 
  ArrowRight, AlertTriangle, CheckCircle2, 
  Circle, ChevronDown, GraduationCap,
  Trophy, Check, Play
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import projectLogo from '../../assets/images/Project_logo.png';

// Theme configuration per track to ensure 100% visual continuity with Explore page
interface CourseTheme {
  trackName: string;
  courseNumber: string;
  level: string;
  duration: string;
  primary: string;
  primaryHover: string;
  lightBg: string;
  borderAccent: string;
  badgeGradient: string;
  chipHover: string;
}

const courseThemes: Record<string, CourseTheme> = {
  cpp: {
    trackName: 'C++ Fundamentals',
    courseNumber: '01 COURSE',
    level: 'Beginner → Intermediate',
    duration: '~28 Hours',
    primary: '#EA580C',
    primaryHover: '#C2410C',
    lightBg: '#FFF1EB',
    borderAccent: '#FDBA74',
    badgeGradient: 'from-[#FF6B4A] to-[#EA580C]',
    chipHover: 'hover:bg-[#FFF5F1]',
  },
  data: {
    trackName: 'Data Structures',
    courseNumber: '02 COURSE',
    level: 'Intermediate → Advanced',
    duration: '~36 Hours',
    primary: '#059669',
    primaryHover: '#047857',
    lightBg: '#ECFDF5',
    borderAccent: '#A7F3D0',
    badgeGradient: 'from-[#10B981] to-[#059669]',
    chipHover: 'hover:bg-[#F0FDF4]',
  },
  algo: {
    trackName: 'Algorithms',
    courseNumber: '03 COURSE',
    level: 'Advanced → Master',
    duration: '~42 Hours',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    lightBg: '#FFF1F2',
    borderAccent: '#FECDD3',
    badgeGradient: 'from-[#F43F5E] to-[#BE123C]',
    chipHover: 'hover:bg-[#FFF1F2]',
  }
};

export default function CourseDetailsPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track open/collapsed module state (first module open by default)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    '0': true
  });

  const toggleModule = (idOrIndex: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [idOrIndex]: !prev[idOrIndex]
    }));
  };

  // Determine course theme based on course slug
  const theme = useMemo(() => {
    const slug = (courseSlug || '').toLowerCase();
    if (slug.includes('data')) return courseThemes.data;
    if (slug.includes('algo')) return courseThemes.algo;
    return courseThemes.cpp;
  }, [courseSlug]);

  // Fetch actual course details, modules, and lessons from MongoDB Atlas
  const fetchCourseDetails = async () => {
    if (!courseSlug) return;
    setLoading(true);
    try {
      const data = await api.getStudentCourseDetails(courseSlug);
      setCourse(data.course);
      // Sort modules by order if present
      const sortedModules = [...(data.modules || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      setModules(sortedModules);
      setLessons(data.lessons || []);
    } catch (e) {
      console.error('Failed to load course details from MongoDB:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseSlug]);

  // Map lessons into their respective modules strictly from MongoDB data
  const roadmapModules = useMemo(() => {
    return modules.map((mod, idx) => {
      // Find lessons belonging to this module in MongoDB
      const modLessons = lessons.filter(l => {
        if (!l.moduleId) return false;
        if (typeof l.moduleId === 'object' && l.moduleId !== null) {
          return l.moduleId._id === mod._id;
        }
        return l.moduleId === mod._id;
      });

      return {
        id: mod._id,
        number: String(idx + 1).padStart(2, '0'),
        title: mod.name,
        description: mod.description || '',
        topics: modLessons
      };
    });
  }, [modules, lessons]);


  const totalTopics = lessons.length;
  const courseDisplayName = course?.name || theme.trackName;
  const courseDisplayDesc = course?.description || 'Learn core concepts and hands-on exercises.';

  // Find the very first lesson to start/resume
  const firstLesson = useMemo(() => {
    if (roadmapModules.length > 0 && roadmapModules[0].topics.length > 0) {
      return roadmapModules[0].topics[0];
    }
    if (lessons.length > 0) {
      return lessons[0];
    }
    return null;
  }, [roadmapModules, lessons]);

  // Handle clicking a lesson/topic
  const handleTopicClick = (lessonSlug: string) => {
    if (!courseSlug || !lessonSlug) return;
    navigate(`/student/courses/${courseSlug}/lessons/${lessonSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="animate-spin text-[#EA580C]" size={36} />
        <span className="text-sm font-semibold text-slate-600">Loading curriculum from MongoDB Atlas...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-center select-none">
        <AlertTriangle className="text-amber-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold font-serif text-[#0B1B2B]">Course Not Found</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-sm">The course you are looking for does not exist or has not been created in MongoDB Atlas yet.</p>
        <button
          onClick={() => navigate('/student/courses')}
          className="mt-6 px-6 py-2.5 bg-black text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#0F172A] relative selection:bg-[#0284C7]/20 selection:text-[#0B1B2B] flex flex-col justify-between">
      
      {/* Subtle warm background textures & grid pattern matching Explore page */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.3] z-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Soft warm corner gradient shapes */}
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-orange-100/35 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-rose-50/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-16 right-1/3 w-80 h-80 bg-sky-50/50 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ========================================================
          1. TOP NAVIGATION HEADER (Compact, elegant, with black border)
         ======================================================== */}
      <header className="sticky top-0 z-40 w-full h-16 sm:h-[70px] bg-[#EEF2F6]/95 backdrop-blur-md border-b border-black flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 h-full flex items-center justify-between relative z-10">
          
          {/* Left: Back to Courses List Button */}
          <button
            onClick={() => navigate('/student/courses')}
            className="group inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-slate-50 text-slate-800 hover:text-black text-xs sm:text-sm font-bold rounded-xl border border-black shadow-xs hover:shadow transition-all duration-200 active:scale-95"
          >
            <ChevronLeft size={16} className="text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>Courses List</span>
          </button>

          {/* Right: DecodeDSA Logo & Brand */}
          <a href="/student/courses" className="flex items-center gap-2.5 select-none">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-white shadow-xs border border-slate-200 flex items-center justify-center p-0.5">
              <img 
                src={projectLogo} 
                alt="DecodeDSA Logo" 
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="flex items-center tracking-tight font-black text-xl">
              <span className="text-[#0B1B2B]">Decode</span>
              <span className="text-[#0284C7] ml-0.5">DSA</span>
            </div>
          </a>

        </div>
      </header>

      {/* ========================================================
          2. MAIN CONTENT WRAPPER
         ======================================================== */}
      <main className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 w-full flex-1 py-6 sm:py-10 space-y-8 sm:space-y-12">
        
        {/* ========================================================
            COURSE HERO SECTION
           ======================================================== */}
        <section className="space-y-3 sm:space-y-4">

          {/* Large Course Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-bold text-[#0B1B2B] tracking-tight leading-[1.1]"
          >
            {courseDisplayName}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-3xl"
          >
            {courseDisplayDesc}
          </motion.p>
        </section>


        {/* ========================================================
            ROADMAP & SIDEBAR PROGRESS SECTION
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8/12: THE VERTICAL SYLLABUS ROADMAP */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-2xl sm:text-[28px] font-serif font-bold text-[#0B1B2B] tracking-tight">
                  Your Learning Path
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 font-normal mt-0.5">
                  Follow the modules in order or jump directly to any topic below.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-500 whitespace-nowrap self-start sm:self-auto">
                <span className="text-[#0B1B2B] font-extrabold">{modules.length}</span> Modules •{' '}
                <span className="text-[#0B1B2B] font-extrabold">{totalTopics}</span> Topics
              </div>
            </div>

            {/* Vertical Timeline Container */}
            {roadmapModules.length > 0 ? (
              <div className="relative pl-6 sm:pl-10 space-y-6 sm:space-y-8">
                
                {/* Continuous vertical timeline guideline running down the left */}
                <div className="absolute left-[17px] sm:left-[21px] top-6 bottom-8 w-[2px] bg-slate-300 rounded-full" />

                {/* Module Cards attached to the timeline */}
                {roadmapModules.map((mod, index) => {
                  const isOpen = !!expandedModules[String(index)];

                  return (
                    <div key={mod.id} className="relative group">
                      
                      {/* Numbered Circular Node on the Timeline */}
                      <div 
                        onClick={() => toggleModule(String(index))}
                        className="absolute -left-[24px] sm:-left-[32px] top-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs transition-transform duration-200 group-hover:scale-110 cursor-pointer z-10 select-none"
                        style={{ color: theme.primary }}
                      >
                        {mod.number}
                      </div>

                      {/* Main Module Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] transition-all duration-200"
                      >
                        
                        {/* Top Header Row of Card: Module Number + Title + Topics Count + Toggle */}
                        <div 
                          onClick={() => toggleModule(String(index))}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="space-y-1">
                            
                            {/* Module Number Label */}
                            <div className="flex items-center gap-2">
                              <span 
                                className="text-[11px] font-black uppercase tracking-wider"
                                style={{ color: theme.primary }}
                              >
                                MODULE {mod.number}
                              </span>
                              {index === 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                                  Current
                                </span>
                              )}
                            </div>

                            {/* Module Title */}
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1B2B] tracking-tight leading-snug group-hover:text-black">
                              {mod.title}
                            </h3>
                          </div>

                          {/* Right side: Topic Count & Accordion Arrow */}
                          <div className="flex items-center gap-2 shrink-0 pt-1">
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              {mod.topics.length} {mod.topics.length === 1 ? 'Topic' : 'Topics'}
                            </span>
                            <button
                              type="button"
                              aria-label="Toggle Module"
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                            >
                              <ChevronDown 
                                size={16} 
                                className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                              />
                            </button>
                          </div>
                        </div>

                        {/* Module Description */}
                        {mod.description && (
                          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal mt-2.5">
                            {mod.description}
                          </p>
                        )}

                        {/* COLLAPSED STATE: Quick Preview Chips */}
                        {!isOpen && mod.topics.length > 0 && (
                          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            {mod.topics.slice(0, 4).map((top, tIdx) => (
                              <div 
                                key={top._id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTopicClick(top.slug);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
                              >
                                <span className="font-bold text-[10px] text-slate-400">{String(tIdx + 1).padStart(2, '0')}</span>
                                <span className="truncate max-w-[180px]">{top.title}</span>
                              </div>
                            ))}
                            {mod.topics.length > 4 && (
                              <button
                                type="button"
                                onClick={() => toggleModule(String(index))}
                                className="text-xs font-bold text-slate-500 hover:text-black px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                +{mod.topics.length - 4} more topics
                              </button>
                            )}
                          </div>
                        )}

                        {/* EXPANDED STATE: Full Structured Topic List from MongoDB */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28, ease: 'easeInOut' }}
                              className="mt-5 pt-4 border-t border-slate-200 space-y-2 overflow-hidden"
                            >
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Module Curriculum ({mod.topics.length} {mod.topics.length === 1 ? 'Lesson' : 'Lessons'})
                              </div>

                              {mod.topics.length > 0 ? (
                                mod.topics.map((topic, tIdx) => (
                                  <div
                                    key={topic._id}
                                    onClick={() => handleTopicClick(topic.slug)}
                                    className={`group/topic p-3 rounded-xl border border-slate-200 hover:border-black bg-white hover:bg-slate-50/80 transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${theme.chipHover}`}
                                  >
                                    
                                    {/* Left: Status Icon + Topic Number + Title */}
                                    <div className="flex items-center gap-3 min-w-0">
                                      
                                      {/* Status Indicator */}
                                      <div className="shrink-0 flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center">
                                          <Circle size={8} className="text-slate-300 fill-slate-300" />
                                        </div>
                                      </div>

                                      {/* Topic Index Number */}
                                      <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                                        {String(tIdx + 1).padStart(2, '0')}
                                      </span>

                                      {/* Topic Title */}
                                      <span className="text-xs sm:text-sm font-bold text-[#0B1B2B] truncate group-hover/topic:text-black">
                                        {topic.title}
                                      </span>

                                    </div>

                                    {/* Right: Action Button */}
                                    <div className="flex items-center gap-3 shrink-0 text-slate-500 text-xs">
                                      <span 
                                        className="font-bold flex items-center gap-1 group-hover/topic:translate-x-0.5 transition-transform"
                                        style={{ color: theme.primary }}
                                      >
                                        <span>Start</span>
                                        <ArrowRight size={12} />
                                      </span>
                                    </div>

                                  </div>
                                ))
                              ) : (
                                <div className="py-4 text-center text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                  No lessons published in this module yet.
                                </div>
                              )}

                            </motion.div>
                          )}
                        </AnimatePresence>

                      </motion.div>
                    </div>
                  );
                })}

              </div>
            ) : (
              /* Clean empty state when MongoDB Atlas has no modules for this course yet */
              <div className="p-8 sm:p-12 bg-white border-2 border-black rounded-2xl text-center space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-500">
                  <Milestone size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-[#0B1B2B]">
                    Syllabus Modules Coming Soon
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    No modules are stored in MongoDB Atlas for this course yet. Once you frame the curriculum and save the modules, they will appear here automatically.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/student/courses')}
                  className="px-5 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <ChevronLeft size={14} />
                  <span>Return to Courses List</span>
                </button>
              </div>
            )}

          </div>

          {/* RIGHT 4/12: TABULAR COURSE OVERVIEW & DETAILS (Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            
            {/* Overview Card with Tabular Metadata */}
            <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#0B1B2B]">
                  Course Overview
                </span>
                <span 
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                  style={{ 
                    backgroundColor: theme.lightBg, 
                    color: theme.primary,
                    borderColor: theme.borderAccent 
                  }}
                >
                  {theme.courseNumber.split(' ')[0]} Track
                </span>
              </div>

              {/* Tabular Details: Count of modules, Topics, Duration, Level */}
              <div className="overflow-hidden rounded-xl border border-black/15 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <tbody>
                    <tr className="border-b border-black/10 hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-500 bg-slate-50/60 w-2/5">
                        Modules
                      </td>
                      <td className="py-3 px-3.5 font-extrabold text-[#0B1B2B]">
                        <span style={{ color: theme.primary }}>{modules.length}</span> Modules
                      </td>
                    </tr>
                    <tr className="border-b border-black/10 hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-500 bg-slate-50/60">
                        Topics
                      </td>
                      <td className="py-3 px-3.5 font-extrabold text-[#0B1B2B]">
                        <span style={{ color: theme.primary }}>{totalTopics}</span> Topics
                      </td>
                    </tr>
                    <tr className="border-b border-black/10 hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-500 bg-slate-50/60">
                        Duration
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#0B1B2B]">
                        {theme.duration}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-500 bg-slate-50/60">
                        Level
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#0B1B2B]">
                        {theme.level}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Start/Resume Button */}
              {firstLesson ? (
                <button
                  type="button"
                  onClick={() => handleTopicClick(firstLesson.slug)}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Play size={14} className="fill-white" />
                  <span>Start Module 01</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                >
                  <span>Curriculum in Preparation</span>
                </button>
              )}

            </div>
          </div>

        </div>

        {/* ========================================================
            BOTTOM COMPLETION CTA
           ======================================================== */}
        <section className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1B2B]">
              Ready to learn?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {firstLesson 
                ? `Build your ${courseDisplayName.split(' ')[0]} foundation one concept at a time.` 
                : 'Modules and lessons will appear dynamically as they are published to MongoDB Atlas.'}
            </p>
          </div>

          {firstLesson ? (
            <button
              type="button"
              onClick={() => handleTopicClick(firstLesson.slug)}
              className="px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all duration-200 active:scale-95 self-start sm:self-auto shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <span>Start Module 01</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/student/courses')}
              className="px-6 py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs transition-all duration-200 self-start sm:self-auto shrink-0"
            >
              <span>Explore All Courses</span>
              <ArrowRight size={15} />
            </button>
          )}
        </section>

      </main>

      {/* ========================================================
          FOOTER / BOTTOM BRANDING
         ======================================================== */}
      <footer className="relative z-10 w-full py-6 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-500">
        <div className="max-w-[1320px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DecodeDSA Interactive Learning Platform</span>
          <span>Structured Syllabus Track • Powered by MongoDB Atlas</span>
        </div>
      </footer>

    </div>
  );
}
