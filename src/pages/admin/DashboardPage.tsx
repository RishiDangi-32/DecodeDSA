import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Milestone, Clipboard, CheckCircle, 
  Edit3, ArrowRight, Eye, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';
import { Lesson } from '../../types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      // toast shown in api request helper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="animate-spin text-brand-cyan" size={32} />
        <span className="text-sm font-semibold text-brand-text-muted">Loading metrics...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, glow: 'shadow-cyan-glow', text: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
    { label: 'Total Modules', value: stats?.totalModules || 0, icon: Milestone, glow: 'shadow-blue-glow', text: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/20' },
    { label: 'Total Lessons', value: stats?.totalLessons || 0, icon: Clipboard, glow: 'shadow-purple-glow', text: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
    { label: 'Published Lessons', value: stats?.publishedLessons || 0, icon: CheckCircle, glow: 'shadow-green-glow', text: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
    { label: 'Draft Lessons', value: stats?.draftLessons || 0, icon: Edit3, glow: 'shadow-yellow-glow', text: 'text-brand-yellow', bg: 'bg-brand-yellow/10 border-brand-yellow/20' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-brand-text-muted font-medium mt-1">
          Review core metrics and manage curriculum content for DSAverse.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`glass p-6 rounded-2xl border flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 ${card.bg} ${card.glow}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  {card.label}
                </span>
                <span className={card.text}>
                  <Icon size={20} />
                </span>
              </div>
              <h2 className="text-3xl font-black text-brand-text-white mt-4 tracking-tight">
                {card.value}
              </h2>
            </motion.div>
          );
        })}
      </div>

      {/* Recently Updated Lessons */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-brand-border/20 space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border/10 pb-4">
          <h3 className="text-lg font-bold text-brand-text-white">
            Recently Updated Lessons
          </h3>
          <button 
            onClick={() => window.location.pathname = '/admin/lessons'}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:underline hover:opacity-80 transition-opacity"
          >
            <span>Manage Lessons</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {stats?.recentlyUpdatedLessons?.length > 0 ? (
          <div className="divide-y divide-brand-border/10">
            {stats.recentlyUpdatedLessons.map((lesson: Lesson) => {
              const moduleName = typeof lesson.moduleId === 'object' ? lesson.moduleId?.name : '';
              const courseName = typeof lesson.moduleId === 'object' && typeof lesson.moduleId?.courseId === 'object' 
                ? (lesson.moduleId.courseId as any)?.name 
                : '';

              return (
                <div key={lesson._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-brand-text-white leading-tight">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-brand-text-muted font-semibold flex flex-wrap items-center gap-1.5">
                      <span className="text-brand-cyan">{courseName || 'Course'}</span>
                      <span>•</span>
                      <span>{moduleName || 'Module'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      lesson.status === 'published' 
                        ? 'bg-brand-green/10 border border-brand-green/20 text-brand-green' 
                        : 'bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow'
                    }`}>
                      {lesson.status}
                    </span>
                    <span className="text-[10px] font-bold text-brand-text-muted">
                      Updated {new Date(lesson.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-sm font-semibold text-brand-text-muted">
            No lessons created yet. Start by setting up a Course!
          </div>
        )}
      </div>

    </div>
  );
}
