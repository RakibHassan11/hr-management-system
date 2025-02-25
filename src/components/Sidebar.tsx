import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Clock, FileText, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Attendance Report', path: '/attendance' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Clock, label: 'View Attendance', path: '/view-attendance' },
  { icon: FileText, label: 'Apply for Time Update', path: '/time-update' },
  { icon: Users, label: 'Team', path: '/teampage' },  // UPDATED PATH TO MATCH ROUTE IN App.tsx
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`relative hidden lg:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen shadow-lg transition-all duration-300`}>
      <div className="p-4 border-b border-[#1FB77F]/30">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/a93f6f91-35cb-4bfa-bfb4-441228ad1560.png" alt="Logo" className="h-8 w-8" />
          {!isCollapsed && <span className="text-xl font-semibold text-[#1FB77F]">Orange Toolz</span>}
        </Link>
      </div>
      
      <Button
        variant="secondary"
        size="icon"
        className="absolute -right-4 top-20 bg-white border border-[#1FB77F]/30 rounded-full shadow-lg z-50 hover:bg-[#1FB77F]/20"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4 text-[#1FB77F]" /> : <ChevronLeft className="h-4 w-4 text-[#1FB77F]" />}
      </Button>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#1FB77F]/20 text-[#1FB77F]'
                      : 'text-[#1FB77F]/80 hover:bg-[#1FB77F]/10 hover:text-[#1FB77F]'
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#1FB77F]" />
                  {!isCollapsed && <span className="text-[#1FB77F]">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
