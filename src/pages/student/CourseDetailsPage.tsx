import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, BookOpen, RefreshCw, Milestone, 
  Clipboard, ArrowRight, AlertTriangle, Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';

export default function CourseDetailsPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourseDetails = async () => {
    if (!courseSlug) return;
    setLoading(true);
    try {
      const data = await api.getStudentCourseDetails(courseSlug);
      setCourse(data.course);
      setModules(data.modules);
      setLessons(data.lessons);
    } catch (e) {
      // Handled in api helper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A26] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="animate-spin text-brand-cyan" size={32} />
        <span className="text-sm font-semibold text-brand-text-muted">Loading curriculum...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#071A26] flex flex-col items-center justify-center p-6 text-center select-none">
        <AlertTriangle className="text-brand-yellow mb-4" size={48} />
        <h2 className="text-2xl font-black text-brand-text-white">Curriculum Not Found</h2>
        <p className="text-sm text-brand-text-muted mt-2 max-w-sm">The course you are trying to view is either inactive or doesn't exist.</p>
        <button
          onClick={() => navigate('/student/courses')}
          className="mt-6 px-6 py-2.5 bg-brand-cyan text-[#071A26] font-bold text-xs rounded-xl shadow-cyan-glow hover:opacity-90"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071A26] pb-20 relative overflow-hidden select-none">
      
      {/* Background Glows */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header toolbar */}
      <header className="h-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-brand-border/10">
        <button
          onClick={() => navigate('/student/courses')}
          className="flex items-center gap-2 text-xs font-bold text-brand-text-muted hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Courses List</span>
        </button>
      </header>

      {/* Course Info Frame */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-12">
        <div className="glass p-6 sm:p-8 rounded-3xl border border-brand-border/15 space-y-5">
          <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan shadow-cyan-glow">
            <BookOpen size={22} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Syllabus Track</span>
            <h1 className="text-2xl sm:text-4xl font-black text-brand-text-white tracking-tight">
              {course.name}
            </h1>
            <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed font-semibold select-text">
              {course.description || 'Welcome to this learning curriculum. Expand the modules below to read topics.'}
            </p>
          </div>
        </div>

        {/* Modules Accordion list */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-brand-text-white border-b border-brand-border/10 pb-3">
            Syllabus Modules ({modules.length})
          </h2>

          {modules.length > 0 ? (
            <div className="space-y-6">
              {modules.map((mod, idx) => {
                // Find lessons belonging to this module
                const moduleLessons = lessons.filter(lesson => 
                  typeof lesson.moduleId === 'object' 
                    ? lesson.moduleId._id === mod._id 
                    : lesson.moduleId === mod._id
                );

                return (
                  <div 
                    key={mod._id}
                    className="relative pl-8 md:pl-10 group"
                  >
                    {/* Visual checkpoint vertical indicator line & node dot */}
                    <div className="absolute left-[9px] top-1.5 bottom-0 w-px bg-brand-cyan/25 group-last:bg-transparent" />
                    <div className="absolute left-[3px] top-1.5 h-3.5 w-3.5 rounded-full bg-[#071A26] border-2 border-brand-cyan flex items-center justify-center shadow-cyan-glow group-hover:scale-110 transition-transform">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                    </div>

                    <div className="glass p-6 rounded-2xl border border-brand-border/10 space-y-4 hover:border-brand-cyan/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/5 pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black text-brand-cyan uppercase tracking-wider">Module {idx + 1}</span>
                          <h3 className="text-lg font-bold text-brand-text-white">
                            {mod.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold text-brand-text-muted flex items-center gap-1.5 self-start sm:self-center">
                          <Clock size={12} />
                          <span>{moduleLessons.length} Topics</span>
                        </span>
                      </div>

                      {/* Description */}
                      {mod.description && (
                        <p className="text-xs text-brand-text-muted leading-relaxed font-semibold select-text">
                          {mod.description}
                        </p>
                      )}

                      {/* Lessons nested lists */}
                      {moduleLessons.length > 0 ? (
                        <div className="space-y-3 pt-2">
                          {moduleLessons.map((lesson) => (
                            <div
                              key={lesson._id}
                              onClick={() => navigate(`/student/courses/${course.slug}/lessons/${lesson.slug}`)}
                              className="p-3.5 border border-brand-border/10 rounded-xl bg-[#071A26]/50 hover:bg-brand-card hover:border-brand-cyan/20 transition-all flex items-center justify-between cursor-pointer group/item"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Clipboard size={14} className="text-brand-cyan flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-bold text-brand-text-white truncate">
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-text-muted group-hover/item:text-brand-cyan transition-colors flex-shrink-0">
                                <span>Start</span>
                                <ArrowRight size={12} className="group-hover/item:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-xs font-semibold text-brand-text-muted">
                          No published lessons in this module yet.
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0D2538]/20 border border-brand-border/10 rounded-2xl">
              <Milestone size={36} className="text-brand-text-muted mx-auto mb-3" />
              <p className="text-sm font-semibold text-brand-text-white">Curriculum is empty</p>
              <p className="text-xs text-brand-text-muted mt-1">Admin has not added modules to this course yet.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
