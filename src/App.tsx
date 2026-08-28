import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from './components/Landing Page/Navbar';
import Hero from './components/Landing Page/Hero';
import Workflow from './components/Landing Page/Workflow';
import Features from './components/Landing Page/Features';
import Stats from './components/Landing Page/Stats';
import Roadmap from './components/Landing Page/Roadmap';
import Developer from './components/Landing Page/Developer';
import CTA from './components/Landing Page/CTA';
import Footer from './components/Landing Page/Footer';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import CoursesPage from './pages/admin/CoursesPage';
import ModulesPage from './pages/admin/ModulesPage';
import LessonsPage from './pages/admin/LessonsPage';
import MediaLibraryPage from './pages/admin/MediaLibraryPage';
import SettingsPage from './pages/admin/SettingsPage';

// Student Pages
import ExploreCoursesPage from './pages/student/ExploreCoursesPage';
import CourseDetailsPage from './pages/student/CourseDetailsPage';
import LessonWorkspacePage from './pages/student/LessonWorkspacePage';

const fallingSymbols = [
  { symbol: '{ }', left: '4%', size: '1rem', duration: 17, delay: 0, color: '#d9f3ff' },
  { symbol: ';', left: '9%', size: '.8rem', duration: 13, delay: 4, color: '#a8d8ef' },
  { symbol: '#', left: '14%', size: '1.2rem', duration: 20, delay: 8, color: '#e5f6ff' },
  { symbol: '<>', left: '20%', size: '.9rem', duration: 15, delay: 2, color: '#b9e6f7' },
  { symbol: '()', left: '26%', size: '1rem', duration: 18, delay: 11, color: '#d7e9f5' },
  { symbol: '*', left: '32%', size: '1.3rem', duration: 14, delay: 6, color: '#f1fbff' },
  { symbol: '{ }', left: '38%', size: '.8rem', duration: 22, delay: 1, color: '#9fd4ea' },
  { symbol: '<>', left: '44%', size: '1.1rem', duration: 16, delay: 13, color: '#d9f3ff' },
  { symbol: ';', left: '50%', size: '.9rem', duration: 19, delay: 7, color: '#b5d9e8' },
  { symbol: '()', left: '56%', size: '1.2rem', duration: 14, delay: 3, color: '#e5f6ff' },
  { symbol: '#', left: '62%', size: '.8rem', duration: 21, delay: 15, color: '#add8ed' },
  { symbol: '*', left: '68%', size: '1.1rem', duration: 17, delay: 9, color: '#f1fbff' },
  { symbol: '{ }', left: '74%', size: '.9rem', duration: 15, delay: 5, color: '#d1edf7' },
  { symbol: '<>', left: '80%', size: '1.2rem', duration: 20, delay: 12, color: '#a8d8ef' },
  { symbol: ';', left: '86%', size: '.8rem', duration: 18, delay: 10, color: '#e5f6ff' },
  { symbol: '#', left: '92%', size: '1rem', duration: 23, delay: 16, color: '#b9e6f7' },
  { symbol: '*', left: '97%', size: '.9rem', duration: 16, delay: 14, color: '#d9f3ff' },
  { symbol: '()', left: '2%', size: '.75rem', duration: 19, delay: 9, color: '#b9e6f7' },
  { symbol: '*', left: '11%', size: '.85rem', duration: 16, delay: 15, color: '#f1fbff' },
  { symbol: '<>', left: '18%', size: '.7rem', duration: 21, delay: 12, color: '#9fd4ea' },
  { symbol: ';', left: '23%', size: '1rem', duration: 14, delay: 17, color: '#d9f3ff' },
  { symbol: '#', left: '29%', size: '.75rem', duration: 18, delay: 4, color: '#e5f6ff' },
  { symbol: '{ }', left: '35%', size: '.9rem', duration: 22, delay: 16, color: '#add8ed' },
  { symbol: '*', left: '41%', size: '.8rem', duration: 15, delay: 10, color: '#d1edf7' },
  { symbol: '()', left: '47%', size: '1rem', duration: 20, delay: 18, color: '#f1fbff' },
  { symbol: ';', left: '54%', size: '.7rem', duration: 17, delay: 14, color: '#a8d8ef' },
  { symbol: '<>', left: '59%', size: '.9rem', duration: 23, delay: 6, color: '#d9f3ff' },
  { symbol: '#', left: '66%', size: '.8rem', duration: 16, delay: 19, color: '#b5d9e8' },
  { symbol: '{ }', left: '72%', size: '1rem', duration: 18, delay: 3, color: '#e5f6ff' },
  { symbol: '*', left: '78%', size: '.75rem', duration: 21, delay: 11, color: '#9fd4ea' },
  { symbol: '()', left: '84%', size: '.9rem', duration: 15, delay: 20, color: '#d7e9f5' },
  { symbol: ';', left: '90%', size: '1.1rem', duration: 19, delay: 5, color: '#f1fbff' },
  { symbol: '<>', left: '99%', size: '.75rem', duration: 22, delay: 13, color: '#b9e6f7' },
];

function FallingCodeParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {fallingSymbols.map((particle, index) => (
        <motion.span
          key={`${particle.symbol}-${index}`}
          className="absolute select-none font-mono font-bold"
          style={{ left: particle.left, fontSize: particle.size, color: particle.color }}
          animate={{
            top: ['-2%', '102%'],
            x: [0, index % 2 === 0 ? 12 : -12, 0],
            rotate: [0, index % 2 === 0 ? 18 : -18, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {particle.symbol}
        </motion.span>
      ))}
    </div>
  );
}

function StartupLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (!isLoading) setShowLoader(false);
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020a18]"
      aria-label="Loading DecodeDSA"
      role="status"
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(126, 211, 238, .12) 1px, transparent 1px), linear-gradient(90deg, rgba(126, 211, 238, .12) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
        <motion.div
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.96, 1, 0.96] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8 font-mono text-sm font-bold tracking-[0.35em] text-cyan-300"
        >
          INITIALIZING LEARNING PATH
        </motion.div>
        <motion.div
          className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-slate-800"
          aria-hidden="true"
        >
          <motion.div className="h-full rounded-full bg-cyan-300" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function LandingPage() {
  return (
    <>
      <StartupLoader />
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main Layout Elements */}
      <Navbar />
      <Hero />
      <Workflow />

      {/* Scoped dropping symbols section: starts at Core Functionalities (Features) and ends at Syllabus Roadmap (Roadmap) */}
      <div className="relative overflow-hidden">
        <FallingCodeParticles />
        <Features />
        <Stats />
        <Roadmap />
      </div>

      <CTA />
      <Developer />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#071A26] overflow-x-hidden selection:bg-brand-cyan/35 selection:text-[#071A26]">
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0D2538',
              color: '#F8FAFC',
              border: '1px solid rgba(0, 229, 255, 0.15)',
              boxShadow: '0 8px 32px 0 rgba(0, 229, 255, 0.08)',
              borderRadius: '16px',
            },
          }}
        />

        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin CMS Panel */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="modules" element={<ModulesPage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Student Panel */}
          <Route path="/student/courses" element={<ExploreCoursesPage />} />
          <Route path="/student/courses/:courseSlug" element={<CourseDetailsPage />} />
          <Route path="/student/courses/:courseSlug/lessons/:lessonSlug" element={<LessonWorkspacePage />} />

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
