import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; 
import { logoutUser, logoutAdmin } from "@/store/authSlice";
import drop from '../lovable-uploads/pet.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function UserNav() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    const currentPath = window.location.pathname;

    try {
      if (currentPath.startsWith('/user')) {
        dispatch(logoutUser());
        navigate("/login");
      }
      else if (currentPath.startsWith('/admin')) {
        dispatch(logoutAdmin());
        navigate("/adminlogin");
      }
      else {
        dispatch(logoutUser());
        navigate("/login");
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative h-10 w-10 rounded-full bg-[#F97316] text-white hover:bg-[#EA580C] transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={drop} alt="User" />
            <AvatarFallback>RZ</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-[rgb(74,182,201,0.2)] shadow-lg" align="end">
        <DropdownMenuLabel className="bg-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-[#1F2328]">{user?.name}</p>
            <p className="text-xs text-[#1F2328]">{user?.designation}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem 
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
          onClick={() => navigate("/profile")} 
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/profile")} 
        >
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}