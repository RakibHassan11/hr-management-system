import { ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/orangetoolz-logo-orange.png';

const menuItems = [
  { icon: Home, label: 'Home', path: '/admin/home' },
  { icon: Building2, label: 'Employee List', path: '/admin/employee' },
];

export function AdminSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`relative flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
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
        <Link to="/admin" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-17 transition-transform duration-500"
          />
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'
                    } py-3 rounded-lg transition-all duration-300 ${isActive
                      ? 'bg-[#F97316] text-white'
                      : 'text-[#1F2328] hover:bg-[#F97316]/10 hover:text-[#F97316]'
                    }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'scale-110' : ''}`} />
                  <span
                    className={`whitespace-nowrap transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
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