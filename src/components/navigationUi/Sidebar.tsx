import { ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Clock,
  FileEdit,
  Plane,
  Calendar,
  HardDrive,
  Link as LinkIcon,
  Users,
  UserRoundSearch,
  CalendarClock,
  PlaneTakeoff,
  History,
} from 'lucide-react';
import { Button } from '../ui/button';
import logo from '../../lovable-uploads/orangetoolz-logo-orange.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const menuItems = [
  { icon: Home, label: 'Home', path: '/user/home', hideCondition: () => false },
  { icon: User, label: 'Profile', path: '/user/profile', hideCondition: () => false },
  { icon: Clock, label: 'My Attendance', path: '/user/view-attendance', hideCondition: () => false },
  {
    icon: CalendarClock,
    label: 'Daily Attendance',
    path: '/user/daily-attendance',
    hideCondition: user => user?.permission_value ? [2, '2', 3, '3'].includes(user.permission_value) : true,
  },
  {
    icon: CalendarClock,
    label: 'All Attendance',
    path: '/user/all-attendance',
    hideCondition: user => user?.permission_value ? [2, '2', 3, '3'].includes(user.permission_value) : true,
  },
  { icon: FileEdit, label: 'Time Update', path: '/user/time-update', hideCondition: () => false },
  { icon: Plane, label: 'My Leave Records', path: '/user/view-leave', hideCondition: () => false },
  { icon: FileEdit, label: 'Apply for Leave', path: '/user/apply-leave', hideCondition: () => false },
  { icon: Calendar, label: 'Holidays', path: '/user/holidays', hideCondition: () => false },
  { icon: HardDrive, label: 'MAC Address', path: '/user/mac-address', hideCondition: () => false },
  { icon: LinkIcon, label: 'Important Links', path: '/user/important-links', hideCondition: () => false },
  {
    icon: UserRoundSearch,
    label: 'Employee',
    path: '/user/employee',
    hideCondition: user => user?.permission_value ? [3, '3', 2, '2'].includes(user.permission_value) : true,
  },
  {
    icon: PlaneTakeoff,
    label: 'Leave Records',
    path: '/user/employee/leave-records',
    hideCondition: user => user?.permission_value ? [3, '3', 2, '2'].includes(user.permission_value) : true,
  },
  {
    icon: History,
    label: 'Attendance Records',
    path: '/user/employee/attendance-records',
    hideCondition: user => user?.permission_value ? [3, '3', 2, '2'].includes(user.permission_value) : true,
  },
  {
    icon: Users,
    label: 'Team',
    path: '/user/team',
    hideCondition: user => user?.permission_value ? [3, '3', 1, '1'].includes(user.permission_value) : true,
  },
  {
    icon: Users,
    label: 'Leave Records',
    path: '/user/team/leave-records',
    hideCondition: user => user?.permission_value ? [3, '3', 1, '1'].includes(user.permission_value) : true,
  },
  {
    icon: Users,
    label: 'Attendance Records',
    path: '/user/team/attendance-records',
    hideCondition: user => user?.permission_value ? [3, '3', 1, '1'].includes(user.permission_value) : true,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, toggleCollapse = () => {} }: SidebarProps) {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user || null);

  // Debug user and menu items
  const filteredMenuItems = menuItems.filter(item => {
    try {
      return !item.hideCondition(user);
    } catch (error) {
      console.error(`Error in hideCondition for ${item.label}:`, error);
      return false; // Hide item if condition fails
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-2"> {/* Reduced padding from p-4 */}
        <Link to="/user" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className={`transition-transform duration-500 ${isCollapsed ? 'mb-8' : 'h-18 mb-1'}`} // Reduced logo size
            onError={() => console.error('Failed to load logo')}
          />
        </Link>
      </div>
      <nav className="flex-1 px-2 pb-0"> {/* Reduced padding from px-4 pb-4 */}
        <ul className="gap-1"> {/* Reduced from space-y-1.5 for more items */}
          {filteredMenuItems.map(item => {
            const Icon = item.icon || (() => <span>?</span>); // Fallback for invalid 
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-2 px-3'} py-2 rounded-lg  ${
                    isActive ? 'bg-[#F97316] text-white' : 'text-[#1F2328] hover:bg-[#F97316]/10 hover:text-[#F97316]'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'scale-110' : ''}`} /> {/* Reduced icon size */}
                  <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} text-base`}> {/* Reduced text size */}
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={`p-2  transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}> 
        <p className="text-xs text-[#1F2328]">Copyright © 2025 - 2027</p> 
      </div>
      {toggleCollapse && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-5 top-4 z-50 rounded-full bg-white shadow-md hover:bg-gray-200 transition-all" // Adjusted top position
          onClick={toggleCollapse}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} /> {/* Reduced icon size */}
        </Button>
      )}
    </div>
  );
}