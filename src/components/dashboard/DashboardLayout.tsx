import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-collapse sidebar on smaller screens initially
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // run initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#071A26] grid-bg text-brand-text-white relative overflow-x-hidden">
      
      {/* Background Glows specific to the dashboard layout */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header Navbar */}
      <Navbar 
        onToggleSidebar={handleToggleSidebar} 
        sidebarOpen={sidebarOpen} 
      />

      {/* Left Navigation Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={handleToggleSidebar} 
      />

      {/* Main Container */}
      <main 
        className={`min-h-[calc(100vh-4rem)] pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-[72px]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
          
          {/* Main Content Column */}
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Right Sidebar Slot (Empty for now - Reserved for future widgets) */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0 border-l border-brand-border/10 min-h-[calc(100vh-4rem)]" />
          
        </div>
      </main>
      
    </div>
  );
}
