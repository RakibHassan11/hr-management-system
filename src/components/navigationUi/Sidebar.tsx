import { CalendarDays, ChevronLeft } from 'lucide-react';
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
  PlaneLanding,
  History,
  CalendarFold,
  ClockArrowUp,
} from 'lucide-react';
import { Button } from '../ui/button';
import logo from '../../assets/people-flow-logo.png';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  hideCondition: (user: any) => boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'General',
    items: [
      { icon: Home, label: 'Home', path: '/user/home', hideCondition: () => false },
      { icon: User, label: 'Profile', path: '/user/profile', hideCondition: () => false },
    ]
  },
  {
    title: 'Attendance',
    items: [
      { icon: Clock, label: 'My Attendance', path: '/user/view-attendance', hideCondition: () => false },
      {
        icon: CalendarClock,
        label: 'Daily Attendance',
        path: '/user/daily-attendance',
        hideCondition: user => user?.role ? ['teamlead', 'user'].includes(user.role) : true,
      },
      {
        icon: CalendarDays,
        label: 'All Attendance',
        path: '/user/all-attendance',
        hideCondition: user => user?.role ? ['teamlead', 'user'].includes(user.role) : true,
      },
      {
        icon: CalendarFold,
        label: 'Monthly Summary',
        path: '/user/montlhy-summary',
        hideCondition: user => user?.role ? ['teamlead', 'user'].includes(user.role) : true,
      },
      { icon: ClockArrowUp, label: 'Time Update', path: '/user/time-update', hideCondition: () => false },
    ]
  },
  {
    title: 'Leave',
    items: [
      { icon: Plane, label: 'My Leave Records', path: '/user/view-leave', hideCondition: () => false },
      { icon: PlaneTakeoff, label: 'Apply for Leave', path: '/user/apply-leave', hideCondition: () => false },
    ]
  },
  {
    title: 'Organization',
    items: [
      { icon: Calendar, label: 'Holidays', path: '/user/holidays', hideCondition: () => false },
      { icon: HardDrive, label: 'MAC Address', path: '/user/mac-address', hideCondition: () => false },
      { icon: LinkIcon, label: 'Important Links', path: '/user/important-links', hideCondition: () => false },
    ]
  },
  {
    title: 'Management',
    items: [
      {
        icon: UserRoundSearch,
        label: 'Employee (Admin)',
        path: '/user/admin-employee',
        hideCondition: user => user?.role !== 'superadmin',
      },
      {
        icon: UserRoundSearch,
        label: 'Employee',
        path: '/user/employee',
        hideCondition: user => user?.role !== 'hr',
      },
      {
        icon: PlaneLanding,
        label: 'Leave Records',
        path: '/user/employee/leave-records',
        hideCondition: user => user?.role !== 'hr',
      },
      {
        icon: History,
        label: 'Attendance Records',
        path: '/user/employee/attendance-records',
        hideCondition: user => user?.role !== 'hr',
      },
    ]
  },
  {
    title: 'Team',
    items: [
      {
        icon: Users,
        label: 'My Team',
        path: '/user/team',
        hideCondition: user => user?.role ? ['user', 'hr'].includes(user.role) : true,
      },
      {
        icon: Users,
        label: 'Team Leave',
        path: '/user/team/leave-records',
        hideCondition: user => user?.role ? ['user', 'hr'].includes(user.role) : true,
      },
      {
        icon: Users,
        label: 'Team Attendance',
        path: '/user/team/attendance-records',
        hideCondition: user => user?.role ? ['user', 'hr'].includes(user.role) : true,
      },
    ]
  }
];

interface SidebarProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, toggleCollapse = () => { } }: SidebarProps) {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user || null);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="pt-8 px-4 pb-2">
        <Link to="/user" className="flex items-center">
          <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto mb-2"
              onError={() => console.error('Failed to load logo')}
            />
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 pb-4 overflow-y-auto custom-scrollbar transition-all duration-300 mt-2">
        <div className="space-y-6">
          {menuGroups.map((group, index) => {
            const filteredItems = group.items.filter(item => {
              try {
                return !item.hideCondition(user);
              } catch (error) {
                return false;
              }
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 select-none opacity-80">
                    {group.title}
                  </h3>
                )}
                {isCollapsed && index > 0 && (
                   <div className="h-px bg-gray-100 mx-2 mb-4" />
                )}
                <ul className="space-y-1">
                  {filteredItems.map(item => {
                    const Icon = item.icon || (() => <span>?</span>);
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center transition-all duration-200 group ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg ${isActive
                              ? 'bg-[#F97316] text-white shadow-sm shadow-[#F97316]/20'
                              : 'text-gray-600 hover:bg-[#F97316]/5 hover:text-[#F97316]'
                            }`}
                        >
                          <Icon className={`h-[18px] w-[18px] shrink-0 transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                          <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'} text-sm font-medium`}>
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
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