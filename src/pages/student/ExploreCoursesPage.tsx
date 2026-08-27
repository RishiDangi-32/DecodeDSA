import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, LayoutGrid, Search, Play } from 'lucide-react';
import { api } from '../../services/api';
import { Course } from '../../types';

export default function ExploreCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentCourses();
      setCourses(data);
    } catch (e) {
      // Handled in api helper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#071A26] pb-20 relative overflow-hidden select-none">
      
      {/* Background ambient blurs */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Top logo strip */}
      <header className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-brand-border/10">
        <a href="/" className="flex items-center gap-3 select-none">
          <div className="h-10 w-10 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl flex items-center justify-center text-brand-cyan shadow-cyan-glow">
            <LayoutGrid size={20} />
          </div>
          <span className="text-base font-black text-brand-text-white uppercase tracking-wider">DSAverse Portal</span>
        </a>

        {/* Back to landing page */}
        <button 
          onClick={() => navigate('/')}
          className="text-xs font-bold text-brand-text-muted hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-brand-text-white tracking-tight leading-tight">
              Explore Our <span className="bg-clip-text text-transparent bg-gradient-cyan-blue font-black">Syllabus Courses</span>
            </h1>
            <p className="text-sm text-brand-text-muted font-medium max-w-xl">
              Choose a dynamic learning track. Each course features theoretical content, interactive visual sandboxes, quiz questions, and a C++ compiler.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative flex items-center bg-[#0D2538]/50 border border-brand-border/25 rounded-xl px-3.5 py-2.5 text-brand-text-muted focus-within:border-brand-cyan transition-all w-full max-w-xs self-start md:self-end">
            <Search size={16} className="text-brand-text-muted" />
            <input
              type="text"
              placeholder="Search active courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-xs text-brand-text-white placeholder-brand-text-muted focus:outline-none pl-2.5 flex-1"
            />
          </div>
        </div>

        {/* Grid course list */}
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="animate-spin text-brand-cyan" size={32} />
            <span className="text-sm font-semibold text-brand-text-muted">Loading syllabus tracks...</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                variants={cardVariants}
                onClick={() => navigate(`/student/courses/${course.slug}`)}
                className="relative group bg-gradient-to-b from-[#0D2538]/40 to-[#071A26]/85 backdrop-blur-xl border border-white/[0.04] hover:border-brand-cyan/30 rounded-[24px] p-7 flex flex-col justify-between shadow-xl transition-all duration-400 overflow-hidden cursor-pointer h-64 hover:-translate-y-1.5"
              >
                {/* Glow highlights */}
                <div className="absolute -inset-px bg-gradient-to-b from-brand-cyan/15 to-brand-blue/15 rounded-[24px] opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* Icon badge */}
                  <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan shadow-cyan-glow group-hover:scale-105 transition-transform duration-300">
                    <BookOpen size={20} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-brand-text-white group-hover:text-brand-cyan transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-xs text-brand-text-muted line-clamp-3 leading-relaxed font-semibold">
                      {course.description || 'No description provided. Explore to view full curriculum.'}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="relative z-10 flex items-center justify-between border-t border-brand-border/10 pt-4">
                  <span className="text-[10px] font-black text-brand-cyan tracking-wider uppercase">Syllabus Track</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-text-white group-hover:text-brand-cyan transition-colors">
                    <span>Explore</span>
                    <Play size={12} fill="currentColor" className="mt-0.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-[#0D2538]/20 border border-brand-border/10 rounded-2xl max-w-4xl mx-auto">
            <BookOpen size={40} className="text-brand-text-muted mx-auto mb-3" />
            <p className="text-sm font-semibold text-brand-text-white">No courses match your search</p>
            <p className="text-xs text-brand-text-muted mt-1">Try modifying the search text or check back later.</p>
          </div>
        )}

      </main>
    </div>
  );
}
