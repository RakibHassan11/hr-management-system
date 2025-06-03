import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { UserNav } from './UserNav';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);

  // Update sidebar state on window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50/30 flex">
      {/* Fixed Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 bg-white border-r border-blue-100 shadow-sm z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <Sidebar
          isCollapsed={!isSidebarOpen}
          toggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Fixed Navbar */}
        <header
          className={`fixed top-0 right-0 h-16 bg-white border-b border-blue-100 shadow-sm flex items-center justify-end px-6 z-10 transition-all duration-300 ${
            isSidebarOpen ? 'left-64' : 'left-20'
          }`}
        >
          <UserNav />
        </header>
        {/* Scrollable Main Content */}
        <main className="pt-20 px-6 pb-6 h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}