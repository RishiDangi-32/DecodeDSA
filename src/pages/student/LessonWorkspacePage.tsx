import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, BookOpen, RefreshCw, 
  Play, HelpCircle, Code,
  Clock, ArrowRight, ArrowLeft, CheckCircle2,
  Maximize2, Minimize2, Type, Sparkles,
  BookmarkCheck, BookMarked, Compass, Check
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import TiptapRenderer, { YouTubePlayer } from '../../components/ui/TiptapRenderer';
import { extractYouTubeId } from '../../utils/youtube';
import CodeCompiler from '../../components/ui/CodeCompiler';
import LessonQuiz from '../../components/ui/LessonQuiz';
import visualizationNotAvailableImg from '../../assets/images/visualization_not_available.png';

type ActiveTab = 'learn' | 'visualizer' | 'quiz' | 'compiler';
type ReadingTheme = 'cream' | 'sage' | 'linen';
type FontSize = 'normal' | 'comfortable' | 'large';

export default function LessonWorkspacePage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseDetails, setCourseDetails] = useState<{ course: Course; modules: Module[]; lessons: Lesson[] } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');

  // Reader preference settings for long-time, fatigue-free study
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('cream');
  const [fontSize, setFontSize] = useState<FontSize>('comfortable');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const mainScrollRef = useRef<HTMLDivElement>(null);

  const fetchLessonData = async () => {
    if (!lessonSlug || !courseSlug) return;
    setLoading(true);
    try {
      const lessonData = await api.getStudentLesson(lessonSlug);
      setLesson(lessonData);
      
      const courseData = await api.getStudentCourseDetails(courseSlug);
      setCourseDetails(courseData);
    } catch (e) {
      // Handled in api helper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonData();
    // Reset scroll to top on lesson change
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    setScrollProgress(0);
  }, [lessonSlug, courseSlug]);

  // Track scroll reading progress inside the container
  const handleScroll = () => {
    if (!mainScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainScrollRef.current;
    if (scrollHeight <= clientHeight) {
      setScrollProgress(100);
      return;
    }
    const progress = Math.min(100, Math.max(0, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)));
    setScrollProgress(progress);
  };

  // Function to navigate between lessons (supports both slug and _id)
  const navigateToLesson = (targetLesson: Lesson) => {
    const targetIdentifier = targetLesson.slug || targetLesson._id;
    if (!targetIdentifier || !courseSlug) return;
    navigate(`/student/courses/${courseSlug}/lessons/${targetIdentifier}`);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  };

  // Compute navigation metrics: current lesson index, module name, prev/next lesson
  const navigationData = useMemo(() => {
    if (!courseDetails || !lesson) {
      return {
        currentIndex: 0,
        totalLessons: 1,
        currentModule: null,
        prevLesson: null,
        nextLesson: null,
        estimatedReadTime: 10,
      };
    }

    const { modules, lessons } = courseDetails;
    const currentIndex = lessons.findIndex(l => 
      (lessonSlug && (l.slug === lessonSlug || l._id === lessonSlug)) || 
      (lesson && (l._id === lesson._id || (l.slug && l.slug === lesson.slug)))
    );
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const totalLessons = Math.max(lessons.length, 1);

    const prevLesson = safeIndex > 0 ? lessons[safeIndex - 1] : null;
    const nextLesson = safeIndex < lessons.length - 1 ? lessons[safeIndex + 1] : null;

    const currentModule = modules.find(m => {
      if (typeof lesson.moduleId === 'string') return m._id === lesson.moduleId;
      return m._id === (lesson.moduleId as any)?._id;
    }) || null;

    // Estimate reading time from content
    let textLength = 0;
    const extractText = (node: any) => {
      if (!node) return;
      if (node.text) textLength += node.text.split(/\s+/).filter(Boolean).length;
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extractText);
      }
    };
    extractText(lesson.content);
    const estimatedReadTime = Math.max(4, Math.ceil(textLength / 180));

    return {
      currentIndex: safeIndex,
      totalLessons,
      currentModule,
      prevLesson,
      nextLesson,
      estimatedReadTime,
    };
  }, [courseDetails, lesson, lessonSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFE9DF] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E2ECE5] border border-[#BFD5C6] flex items-center justify-center text-[#235338] shadow-sm">
          <RefreshCw className="animate-spin text-[#235338]" size={24} />
        </div>
        <span className="text-sm font-semibold text-[#546059]">Preparing soothing workspace...</span>
      </div>
    );
  }

  if (!lesson || !courseDetails) {
    return (
      <div className="min-h-screen bg-[#EFE9DF] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center text-[#DC2626] mb-4 shadow-sm">
          <BookOpen size={30} />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2623]">Lesson Not Found</h2>
        <p className="text-sm text-[#5D6761] mt-2 max-w-sm">The requested lesson page could not be located in this course.</p>
        <button
          onClick={() => navigate('/student/courses')}
          className="mt-6 px-6 py-2.5 bg-[#26533B] hover:bg-[#1E432F] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Return to All Courses
        </button>
      </div>
    );
  }

  const { course } = courseDetails;
  const { currentIndex, totalLessons, currentModule, prevLesson, nextLesson, estimatedReadTime } = navigationData;

  const tabItems = [
    { id: 'learn', name: 'Learn & Read', icon: BookOpen },
    { id: 'visualizer', name: 'Interactive Visualizer', icon: Play },
    { id: 'quiz', name: 'Practice Quiz', icon: HelpCircle },
    { id: 'compiler', name: 'C++ Compiler', icon: Code },
  ];

  // Theme-specific styles
  const themeStyles = {
    cream: {
      bg: 'bg-[#EFE9DF]',
      cardBg: 'bg-[#EFE9DF]',
      border: 'border-[#DFD8CC]',
      textMuted: 'text-[#58635D]',
    },
    sage: {
      bg: 'bg-[#F2F6F3]',
      cardBg: 'bg-[#F2F6F3]',
      border: 'border-[#D9E4DD]',
      textMuted: 'text-[#4D5A52]',
    },
    linen: {
      bg: 'bg-[#FCFBF7]',
      cardBg: 'bg-[#FCFBF7]',
      border: 'border-[#ECE6D8]',
      textMuted: 'text-[#5E5E54]',
    },
  }[readingTheme];

  // Font size classes
  const fontSizeClass = {
    normal: 'text-base',
    comfortable: 'text-[17px]',
    large: 'text-[19px]',
  }[fontSize];

  return (
    <div className={`h-screen ${activeTab === 'compiler' ? 'bg-[#E3C4A8]' : themeStyles.bg} text-[#1F2623] flex flex-col relative overflow-hidden select-none transition-colors duration-300 font-sans`}>
      
      {/* Top Workspace Header (Hidden during full Focus Mode in Learn Tab) */}
      {(!focusMode || activeTab !== 'learn') && (
        <header className="h-16 border-b border-[#DCE4EC] bg-[#EFF3F7] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 select-none shadow-2xs">
          {/* Left: Back to Course */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(`/student/courses/${course.slug}`)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D1DCE6] bg-white hover:border-[#2D5A43] hover:text-[#2D5A43] transition-all text-xs font-bold text-[#2A342E] shadow-2xs"
            >
              <ChevronLeft size={16} />
              <span className="font-bold text-xs sm:text-[13px] truncate max-w-[150px] sm:max-w-[260px]">
                {currentModule?.name || course.name}
              </span>
            </button>
          </div>

          {/* Center: Workspace Tabs */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#DFE7EF] border border-[#D1DCE6] p-1 rounded-2xl shadow-inner">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active 
                      ? 'bg-[#E2ECE5] border border-[#BFD5C6] text-[#204A33] shadow-xs' 
                      : 'bg-transparent border-transparent text-[#52606D] hover:text-[#1F2623] hover:bg-white/50'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-[#204A33]' : 'text-[#6C7770]'} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Reader Controls & Student Mode Badge */}
          <div className="flex items-center gap-2">
            {/* Reading preferences only shown in Learn tab */}
            {activeTab === 'learn' && (
              <div className="hidden sm:flex items-center gap-1.5 border border-[#D1DCE6] bg-white rounded-xl p-1 shadow-2xs">
                {/* Font Size Toggle */}
                <button
                  onClick={() => {
                    if (fontSize === 'normal') setFontSize('comfortable');
                    else if (fontSize === 'comfortable') setFontSize('large');
                    else setFontSize('normal');
                  }}
                  className="px-2 py-1 rounded-lg hover:bg-[#F2EFE8] text-[11px] font-bold text-[#45524B] flex items-center gap-1"
                  title="Adjust font size"
                >
                  <Type size={13} />
                  <span className="uppercase text-[10px]">{fontSize === 'normal' ? 'A' : fontSize === 'comfortable' ? 'A+' : 'A++'}</span>
                </button>

                {/* Theme Selector Pill */}
                <div className="flex items-center border-l border-[#D1DCE6] pl-1 ml-0.5 gap-0.5">
                  <button
                    onClick={() => setReadingTheme('cream')}
                    className={`w-4.5 h-4.5 rounded-full border ${readingTheme === 'cream' ? 'border-[#26533B] scale-110' : 'border-transparent'} bg-[#EFE9DF] shadow-2xs`}
                    title="Warm Cream Theme"
                  />
                  <button
                    onClick={() => setReadingTheme('sage')}
                    className={`w-4.5 h-4.5 rounded-full border ${readingTheme === 'sage' ? 'border-[#26533B] scale-110' : 'border-transparent'} bg-[#EAF2ED] shadow-2xs`}
                    title="Soft Sage Theme"
                  />
                  <button
                    onClick={() => setReadingTheme('linen')}
                    className={`w-4.5 h-4.5 rounded-full border ${readingTheme === 'linen' ? 'border-[#26533B] scale-110' : 'border-transparent'} bg-[#FCFBF7] shadow-2xs`}
                    title="Cozy Linen Theme"
                  />
                </div>

                {/* Focus Mode button */}
                <button
                  onClick={() => setFocusMode(true)}
                  className="ml-1 p-1 rounded-lg hover:bg-[#F2EFE8] text-[#55625A] hover:text-[#1F2623]"
                  title="Focus Reading Mode (Distraction-free)"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            )}

            {/* Student Mode Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#D1DCE6] bg-white shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#2C3630]">Student Mode</span>
            </div>
          </div>
        </header>
      )}

      {/* Floating Exit Button for Focus Mode */}
      {focusMode && activeTab === 'learn' && (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
          <div className="bg-white/90 backdrop-blur-md border border-[#D1DCE6] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#4A554E] shadow-sm flex items-center gap-2">
            <span>Reading Focus</span>
            <span className="text-[11px] font-bold text-[#235338] bg-[#E2ECE5] px-2 py-0.5 rounded-md">
              {scrollProgress}%
            </span>
          </div>
          <button
            onClick={() => setFocusMode(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D1DCE6] bg-white/90 backdrop-blur-md text-xs font-bold text-[#2A342E] hover:border-[#2D5A43] hover:text-[#2D5A43] shadow-md transition-all"
          >
            <Minimize2 size={14} />
            <span>Exit Focus</span>
          </button>
        </div>
      )}

      {/* Mobile Tab Selector */}
      {(!focusMode || activeTab !== 'learn') && (
        <div className="md:hidden flex items-center justify-around border-b border-[#DCE4EC] bg-[#EFF3F7] p-2 z-20 flex-shrink-0 select-none">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`p-2 rounded-xl transition-all ${
                  active ? 'text-[#204A33] bg-[#E2ECE5] border border-[#BFD5C6]' : 'text-[#6C7770]'
                }`}
                title={tab.name}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      )}

      {/* Workspace Panel layout */}
      <div className="flex-1 flex min-h-0 relative z-10">
        <main 
          ref={mainScrollRef}
          onScroll={handleScroll}
          className={`flex-1 ${activeTab === 'visualizer' ? 'p-1.5 sm:p-2.5 overflow-hidden' : 'overflow-y-auto ' + (focusMode ? 'p-4 sm:p-8 lg:p-14' : 'p-4 sm:p-6 lg:p-10')} soothing-scrollbar h-full ${activeTab === 'compiler' ? 'bg-[#E3C4A8]' : ''}`}
        >
          <div className={`mx-auto h-full flex flex-col ${activeTab === 'compiler' || activeTab === 'visualizer' ? 'w-full max-w-none' : 'max-w-4xl'}`}>
            
            {/* ======================================================== */}
            {/* 1. LEARN & READ TAB (Soothing Educational Editorial View) */}
            {/* ======================================================== */}
            {activeTab === 'learn' && (
              <article className={`space-y-8 select-text ${fontSizeClass}`}>
                
                {/* Reading Page Paper Boundary Card */}
                <div className="bg-white rounded-3xl border border-[#DDD7CD] shadow-xs p-6 sm:p-10 lg:p-12 space-y-8">
                  {/* Lesson Title Header */}
                  <div className="border-b border-[#E6E1D6] pb-6 pt-1 text-center space-y-3">
                    {/* Rectangular Module Badge */}
                    <div>
                      <span className="inline-block px-3 py-1 rounded-[3px] bg-[#E5EDE7] border border-[#BFD5C6] text-[#204A33] text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
                        {currentModule?.name || course.name}
                      </span>
                    </div>

                    {/* Main Lesson Heading */}
                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#141E18] tracking-tight leading-[1.25] w-full mx-auto sm:whitespace-nowrap">
                      {lesson.title}
                    </h1>
                  </div>

                  {/* Main Rich Text Content (Rendered with soothing styling) */}
                  <div className="pt-2">
                    <TiptapRenderer json={lesson.content} />
                  </div>

                  {/* Optional YouTube Video Tutorial */}
                  {lesson.youtubeUrl && extractYouTubeId(lesson.youtubeUrl) && (
                    <div className="mt-10 pt-8 border-t border-[#E6E1D6]">
                      <YouTubePlayer 
                        videoId={extractYouTubeId(lesson.youtubeUrl)!} 
                        src={lesson.youtubeUrl} 
                      />
                    </div>
                  )}

                </div>

                {/* Practice Quiz Callout Banner with #F8E8E0 Pastel Peach Background & Outline */}
                <div className="my-8 rounded-2xl border border-black bg-[#F8E8E0] px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F5DCD0] border border-[#E5C3B3] flex items-center justify-center text-[#964724] flex-shrink-0">
                      <Code size={18} className="stroke-[2.2]" />
                    </div>
                    <div className="h-6 w-[1.5px] bg-[#E2BFA9] hidden sm:block flex-shrink-0" />
                    <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-[#1F2623] whitespace-nowrap">
                      Ready to put your Knowledge into Practice ?
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        setActiveTab('quiz');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 sm:px-4.5 sm:py-2.5 bg-[#15452D] hover:bg-[#0E3320] text-white font-bold text-xs sm:text-[13px] rounded-full shadow-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>Take the practice quiz</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('compiler');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#DFD5C7] bg-white hover:bg-[#F9F8F6] text-[#1F2623] font-bold text-xs sm:text-[13px] rounded-full transition-all shadow-2xs cursor-pointer whitespace-nowrap"
                    >
                      Open Compiler
                    </button>
                  </div>
                </div>

                {/* Bottom Prev / Next Lesson Navigation (Matching reference!) */}
                <div className="pt-8 pb-12 border-t border-[#E6E1D6] grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                  {/* Previous Lesson */}
                  {prevLesson ? (
                    <motion.button
                      type="button"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.985, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      onClick={() => navigateToLesson(prevLesson)}
                      className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-black bg-[#E5EEF2] hover:bg-[#D9E7ED] transition-colors group shadow-xs cursor-pointer text-left overflow-hidden"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#CADBE2] border border-[#B8CCD5] flex items-center justify-center text-[#15452D] flex-shrink-0 group-hover:bg-[#BFD4DD] transition-all">
                        <motion.span
                          animate={{ x: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                          className="inline-flex items-center"
                        >
                          <ArrowLeft size={16} className="stroke-[2.5]" />
                        </motion.span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                        <span className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-[#15452D] truncate">
                          PREVIOUS LESSON
                        </span>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#111827] truncate">
                          {prevLesson.title}
                        </span>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.985, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      onClick={() => navigate(`/student/courses/${courseSlug}`)}
                      className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-black bg-[#E5EEF2] hover:bg-[#D9E7ED] transition-colors group shadow-xs cursor-pointer text-left overflow-hidden"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#CADBE2] border border-[#B8CCD5] flex items-center justify-center text-[#15452D] flex-shrink-0 group-hover:bg-[#BFD4DD] transition-all">
                        <motion.span
                          animate={{ x: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                          className="inline-flex items-center"
                        >
                          <ArrowLeft size={16} className="stroke-[2.5]" />
                        </motion.span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                        <span className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-[#15452D] truncate">
                          COURSE OVERVIEW
                        </span>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#111827] truncate">
                          {course.name}
                        </span>
                      </div>
                    </motion.button>
                  )}

                  {/* Next Lesson */}
                  {nextLesson ? (
                    <motion.button
                      type="button"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.985, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      onClick={() => navigateToLesson(nextLesson)}
                      className="flex items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-black bg-[#ECEFE3] hover:bg-[#E3E8D7] transition-colors group shadow-xs cursor-pointer text-left overflow-hidden"
                    >
                      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                        <span className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-[#15452D] truncate">
                          NEXT LESSON
                        </span>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#111827] truncate">
                          {nextLesson.title}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#DCE4D3] border border-[#CCD6C2] flex items-center justify-center text-[#15452D] flex-shrink-0 group-hover:bg-[#D1DDC5] transition-all">
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                          className="inline-flex items-center"
                        >
                          <ArrowRight size={16} className="stroke-[2.5]" />
                        </motion.span>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.985, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      onClick={() => navigate(`/student/courses/${courseSlug}`)}
                      className="flex items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-black bg-[#ECEFE3] hover:bg-[#E3E8D7] transition-colors group shadow-xs cursor-pointer text-left overflow-hidden"
                    >
                      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                        <span className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-[#15452D] truncate">
                          COURSE COMPLETED
                        </span>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#111827] truncate">
                          Review Course Modules
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#DCE4D3] border border-[#CCD6C2] flex items-center justify-center text-[#15452D] flex-shrink-0 group-hover:bg-[#D1DDC5] transition-all">
                        <motion.span
                          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="inline-flex items-center"
                        >
                          <Sparkles size={16} className="stroke-[2.5]" />
                        </motion.span>
                      </div>
                    </motion.button>
                  )}
                </div>

              </article>
            )}

            {/* ======================================================== */}
            {/* 2. INTERACTIVE VISUALIZER TAB                            */}
            {/* ======================================================== */}
            {activeTab === 'visualizer' && (
              lesson.simulationHtml && lesson.simulationHtml.trim().length > 0 ? (
                <div className="w-full h-full flex-1 flex flex-col min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-85px)] rounded-xl sm:rounded-2xl overflow-hidden border border-[#DDD7CD] bg-white shadow-xs">
                  <iframe
                    srcDoc={lesson.simulationHtml}
                    title={`${lesson.title} Simulation`}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                    className="w-full h-full flex-1 min-h-[calc(100vh-125px)] sm:min-h-[calc(100vh-90px)] border-0 block"
                  />
                </div>
              ) : (
                <div className="w-full flex items-center justify-center py-6 sm:py-10">
                  <div className="w-full max-w-4xl rounded-3xl overflow-hidden border border-[#DDD7CD] shadow-md bg-white transition-all p-4">
                    <img 
                      src={visualizationNotAvailableImg} 
                      alt="Interactive Visualization Not Available" 
                      className="w-full h-auto object-contain select-none block rounded-2xl"
                    />
                  </div>
                </div>
              )
            )}

            {/* ======================================================== */}
            {/* 3. PRACTICE QUIZ TAB                                     */}
            {/* ======================================================== */}
            {activeTab === 'quiz' && (
              <div className="py-2">
                <LessonQuiz 
                  questions={lesson.practiceQuestions} 
                  lessonTitle={lesson.title} 
                  lessonIndex={currentIndex + 1}
                  totalLessons={totalLessons}
                  courseLevel={course.slug === 'algo' ? 'Advanced' : course.slug === 'data' ? 'Intermediate' : 'Beginner'}
                  onBackToLearn={() => {
                    setActiveTab('learn');
                    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
                  }}
                  onNextLesson={nextLesson ? () => navigateToLesson(nextLesson) : undefined}
                />
              </div>
            )}

            {/* ======================================================== */}
            {/* 4. C++ COMPILER TAB                                      */}
            {/* ======================================================== */}
            {activeTab === 'compiler' && (
              <CodeCompiler />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
