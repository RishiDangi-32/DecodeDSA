import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, BookOpen, Milestone, Clipboard, RefreshCw, 
  Menu, Play, HelpCircle, Code, LayoutList, CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import TiptapRenderer from '../../components/ui/TiptapRenderer';
import InteractiveVisualizer from '../../components/ui/InteractiveVisualizer';
import CodeCompiler from '../../components/ui/CodeCompiler';
import LessonQuiz from '../../components/ui/LessonQuiz';

type ActiveTab = 'learn' | 'visualizer' | 'quiz' | 'compiler';

export default function LessonWorkspacePage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseDetails, setCourseDetails] = useState<{ course: Course; modules: Module[]; lessons: Lesson[] } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  }, [lessonSlug, courseSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A26] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="animate-spin text-brand-cyan" size={32} />
        <span className="text-sm font-semibold text-brand-text-muted">Loading workspace...</span>
      </div>
    );
  }

  if (!lesson || !courseDetails) {
    return (
      <div className="min-h-screen bg-[#071A26] flex flex-col items-center justify-center p-6 text-center select-none">
        <BookOpen className="text-red-400 mb-4" size={48} />
        <h2 className="text-2xl font-black text-brand-text-white">Workspace Not Available</h2>
        <p className="text-sm text-brand-text-muted mt-2 max-w-sm">The requested lesson page could not be loaded.</p>
        <button
          onClick={() => navigate('/student/courses')}
          className="mt-6 px-6 py-2.5 bg-brand-cyan text-[#071A26] font-bold text-xs rounded-xl shadow-cyan-glow hover:opacity-90"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const { course, modules, lessons } = courseDetails;

  const tabItems = [
    { id: 'learn', name: 'Learn & Read', icon: BookOpen },
    { id: 'visualizer', name: 'Interactive Visualizer', icon: Play },
    { id: 'quiz', name: 'Practice Quiz', icon: HelpCircle },
    { id: 'compiler', name: 'C++ Compiler', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-[#071A26] text-brand-text-white flex flex-col relative overflow-hidden select-none">
      
      {/* Background blurs */}
      <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[10%] w-[350px] h-[350px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Workspace Bar */}
      <header className="h-16 border-b border-brand-border/10 bg-[#071A26]/80 backdrop-blur-md px-4 flex items-center justify-between z-30 flex-shrink-0 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-brand-text-muted hover:text-white rounded-lg border border-brand-border/10 bg-[#071A26]/40 transition-colors"
            title="Toggle Syllabus Sidebar"
          >
            <Menu size={16} />
          </button>
          
          <button
            onClick={() => navigate(`/student/courses/${course.slug}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-text-muted hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="max-w-[120px] sm:max-w-none truncate">{course.name}</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="hidden md:flex items-center gap-1 bg-[#0D2538]/70 border border-brand-border/25 p-1 rounded-xl">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  active 
                    ? 'bg-brand-cyan/15 border border-brand-cyan/35 text-brand-cyan shadow-[0_0_10px_rgba(0,229,255,0.06)]' 
                    : 'bg-transparent border-transparent text-brand-text-muted hover:text-white'
                }`}
              >
                <Icon size={12} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-brand-border/10 bg-[#0D2538]/40">
          <div className="w-5 h-5 rounded-full bg-brand-cyan/25 border border-brand-cyan/40 flex items-center justify-center text-[10px] font-black text-brand-cyan">
            S
          </div>
          <span className="text-[10px] font-bold text-brand-text-white">Student Mode</span>
        </div>
      </header>

      {/* Tabs Selector on Mobile */}
      <div className="md:hidden flex items-center justify-around border-b border-brand-border/10 bg-[#071A26]/80 p-2 z-20 flex-shrink-0 select-none">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`p-2 rounded-lg transition-colors ${
                active ? 'text-brand-cyan bg-brand-cyan/10' : 'text-brand-text-muted'
              }`}
              title={tab.name}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      {/* Workspace Panel layout */}
      <div className="flex-1 flex min-h-0 relative z-10">
        
        {/* Left Sidebar Curriculum Navigation Panel */}
        {sidebarOpen && (
          <aside className="w-72 border-r border-brand-border/10 bg-[#071A26]/90 backdrop-blur-md flex-shrink-0 flex flex-col justify-between select-none h-full z-20">
            <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
              <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest block border-b border-brand-border/5 pb-2">
                Course Syllabus
              </span>
              
              <div className="space-y-4">
                {modules.map((mod, idx) => {
                  const moduleLessons = lessons.filter(l => 
                    typeof l.moduleId === 'object' ? l.moduleId._id === mod._id : l.moduleId === mod._id
                  );

                  return (
                    <div key={mod._id} className="space-y-2">
                      <h4 className="text-[11px] font-extrabold text-brand-text-white truncate flex items-center gap-1.5">
                        <Milestone size={10} className="text-brand-cyan" />
                        <span>M{idx + 1}: {mod.name}</span>
                      </h4>

                      <div className="pl-3 space-y-1.5 border-l border-brand-border/10">
                        {moduleLessons.map((l) => {
                          const isCurrent = l.slug === lessonSlug;
                          return (
                            <Link
                              key={l._id}
                              to={`/student/courses/${course.slug}/lessons/${l.slug}`}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors truncate block ${
                                isCurrent 
                                  ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 font-bold' 
                                  : 'text-brand-text-muted hover:text-white hover:bg-brand-card/20 border border-transparent'
                              }`}
                            >
                              <Clipboard size={10} className="flex-shrink-0" />
                              <span className="truncate">{l.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Central Workspace Tab panel */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar h-full">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            
            {/* Active Tab rendering */}
            {activeTab === 'learn' && (
              <div className="glass p-6 sm:p-10 rounded-3xl border border-brand-border/15 space-y-6 select-text">
                {/* Lesson Header */}
                <div className="border-b border-brand-border/10 pb-5 space-y-2">
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block">Learn Topic</span>
                  <h1 className="text-2xl sm:text-4xl font-black text-brand-text-white tracking-tight leading-tight">
                    {lesson.title}
                  </h1>
                  {lesson.shortDescription && (
                    <p className="text-sm text-brand-text-muted font-medium italic leading-relaxed">
                      {lesson.shortDescription}
                    </p>
                  )}
                </div>

                {/* Featured image if exists */}
                {lesson.featuredImage && (
                  <div className="rounded-2xl border border-brand-border/25 overflow-hidden aspect-video shadow-md max-h-[300px] w-full">
                    <img src={lesson.featuredImage} className="w-full h-full object-cover" alt="" />
                  </div>
                )}

                {/* Rich text node compiler */}
                <div className="pt-2">
                  <TiptapRenderer json={lesson.content} />
                </div>
              </div>
            )}

            {activeTab === 'visualizer' && (
              <InteractiveVisualizer />
            )}

            {activeTab === 'quiz' && (
              <LessonQuiz />
            )}

            {activeTab === 'compiler' && (
              <CodeCompiler />
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
