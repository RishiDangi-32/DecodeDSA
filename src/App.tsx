import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Landing Page/Navbar';
import Hero from './components/Landing Page/Hero';
import Workflow from './components/Landing Page/Workflow';
import Features from './components/Landing Page/Features';
import Stats from './components/Landing Page/Stats';
import Roadmap from './components/Landing Page/Roadmap';
import Testimonials from './components/Landing Page/Testimonials';
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

function LandingPage() {
  return (
    <>
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Floating particles background mock using animated divs */}
      <div className="absolute top-24 left-[20%] h-1.5 w-1.5 bg-brand-cyan rounded-full animate-ping opacity-30 pointer-events-none"></div>
      <div className="absolute top-[50%] right-[25%] h-2 w-2 bg-brand-purple rounded-full animate-bounce opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-40 left-[8%] h-1 w-1 bg-brand-green rounded-full animate-pulse opacity-40 pointer-events-none"></div>

      {/* Main Layout Elements */}
      <Navbar />
      <Hero />
      <Workflow />
      <Features />
      <Stats />
      <Roadmap />
      <Testimonials />
      <Developer />
      <CTA />
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
