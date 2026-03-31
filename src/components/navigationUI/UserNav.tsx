import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import ama from '../../assets/pet.jpg';
import { useAuth } from "@/features/auth/hooks/useAuth"

export function UserNav() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full bg-[#F97316] text-white hover:bg-[#EA580C] transition-colors">
          <img src={ama} alt="User" className="h-10 w-10 rounded-full" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white border border-[rgb(74,182,201,0.2)] shadow-lg"
        align="end"
      >
        <DropdownMenuLabel className="bg-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-[#1F2328]">{user?.name || user?.username || "User"}</p>
            <p className="text-xs text-[#1F2328]">{user?.designation || "employee"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
          onClick={() => navigate("/user/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
          onClick={() => navigate("/user/change-password")}
        >
          Change Password
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
  )
}