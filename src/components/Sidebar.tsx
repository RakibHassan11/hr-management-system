import { ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Clock, FileEdit, Plane, Calendar, HardDrive, Link as LinkIcon, Users, Building2, Timer } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import logo from '../lovable-uploads/orangetoolz-logo-orange.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const menuItems = [
  { icon: Home, label: 'Home', path: '/user/home', hideCondition: () => false },
  { icon: User, label: 'Profile', path: '/user/profile', hideCondition: () => false },
  { icon: Clock, label: 'View Attendance', path: '/user/view-attendance', hideCondition: () => false },
  { 
    icon: Clock, 
    label: 'All Attendance', 
    path: '/user/all-attendance', 
    hideCondition: (user) => user?.permission_value === 'TEAM LEAD' 
  },
  { icon: FileEdit, label: 'Time Update', path: '/user/time-update', hideCondition: () => false },
  { icon: Plane, label: 'View Leave', path: '/user/view-leave', hideCondition: () => false },
  { icon: FileEdit, label: 'Apply for Leave', path: '/user/apply-leave', hideCondition: () => false },
  { icon: Calendar, label: 'Holidays', path: '/user/holidays', hideCondition: () => false },
  { icon: HardDrive, label: 'MAC Address', path: '/user/mac-address', hideCondition: () => false },
  { icon: LinkIcon, label: 'Important Links', path: '/user/important-links', hideCondition: () => false },
  { 
    icon: Building2, 
    label: 'Employee', 
    path: '/user/employee', 
    hideCondition: (user) => user?.permission_value === 'TEAM LEAD' || user?.permission_value === 'EMPLOYEE' 
  },
  { 
    icon: Users, 
    label: 'Team', 
    path: '/user/team', 
    hideCondition: (user) => user?.permission_value === 'HR' || user?.permission_value === 'EMPLOYEE' 
  },
  { 
    icon: Users, 
    label: 'Leave Records', 
    path: '/user/teamleaverecords', 
    hideCondition: (user) => user?.permission_value === 'HR' || user?.permission_value === 'EMPLOYEE'
  },
  { 
    icon: Users, 
    label: 'Attendance Records', 
    path: '/user/teamattendancerecords', 
    hideCondition: (user) => user?.permission_value === 'HR' || user?.permission_value === 'EMPLOYEE'
  },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const filteredMenuItems = menuItems.filter(item => !item.hideCondition(user));

  return (
    <div 
      className={`relative flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen bg-white shadow-sm transition-all duration-500 ease-in-out`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-5 top-6 z-50 rounded-full bg-white shadow-md hover:bg-gray-200 transition-all"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </Button>

      <div className="p-4">
        <Link to="/user" className="flex items-center space-x-2">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-17 transition-transform duration-500" 
          />
        </Link>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'
                  } py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-[#F97316] text-white'
                      : 'text-[#1F2328] hover:bg-[#F97316]/10 hover:text-[#F97316]'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'scale-110' : ''}`} />
                  <span 
                    className={`whitespace-nowrap transition-all duration-500 ${
                      isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className={`p-4 transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-xs text-[#1F2328]">Copyright © 2023 - 2025 - All Rights Reserved</p>
      </div>
    </div>
  );
}