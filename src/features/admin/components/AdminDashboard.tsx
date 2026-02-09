// src/components/AdminHome.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ama from '../../../assets/pet.jpg';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminHome = () => {
  // Retrieve admin info from Redux state
  const auth = useSelector((state: RootState) => state.auth);
  const admin = auth?.admin;

  return (
    <div className="animate-fadeIn p-6 bg-white text-[#1F2328] min-h-screen">
      {/* Admin Info Section */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-6 flex-1">
          <img
            src={ama}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-orange-500"
          />
          <div>
            <h1 className="text-2xl font-semibold">
              {admin ? admin.full_name : 'Admin Name'}
            </h1>
            <p className="text-lg text-gray-700">
              {admin ? admin.email : 'admin@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Actions Section */}
      <div>
        <h1 className='text-5xl p-8'>Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminHome;
