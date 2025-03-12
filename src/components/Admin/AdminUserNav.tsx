import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logoutAdmin } from '@/store/authSlice';
import adminDrop from '../../lovable-uploads/pet.jpg';
import { RootState } from '@/store/store';

export function AdminUserNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.auth.admin);

  const handleLogout = () => {
    console.log('handleLogout function called');
    dispatch(logoutAdmin());
    console.log('Redux state cleared');
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("mockRole");
    console.log('localStorage cleared');
    toast.success("Logged out successfully");
    navigate("/adminlogin");
    console.log('Navigating to admin login page');
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative h-10 w-10 rounded-full bg-[#F97316] text-white hover:bg-[#EA580C] transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={adminDrop} alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-[rgb(74,182,201,0.2)] shadow-lg" align="end">
        <DropdownMenuLabel className="bg-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-[#1F2328]">
              {admin?.full_name || 'Admin User'}
            </p>
            <p className="text-xs text-[#1F2328]">Admin Role</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem 
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
          onClick={() => navigate("/admin/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/admin/edit-profile")}
        >
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
