import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser, logoutAdmin } from "@/store/authSlice"
import { RootState } from "@/store"
import ama from '../../assets/pet.jpg';
import axios from "axios"

export function UserNav() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = useSelector((state: RootState) => state.auth.isAuthenticatedAdmin)
  const access_token = useSelector((state: RootState) =>
    isAdmin ? state.auth.adminToken : state.auth.userToken
  )
  const refresh_token = useSelector((state: RootState) =>
    isAdmin ? state.auth.adminRefreshToken : state.auth.userRefreshToken
  )
  const API_URL = import.meta.env.VITE_API_URL

  const handleLogout = async () => {
    const currentPath = window.location.pathname

    try {
      // Check if access_token exists
      if (!access_token) {
        throw new Error("Authentication token is missing")
      }

      // Make API call to logout endpoint
      const response = await axios.post(
        `${API_URL}/auth/logout`,
        {
          access_token,
          refresh_token: refresh_token || "" // Use empty string if refresh_token is not available
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
          }
        }
      )


      // Check if logout was successful
      if (response.data.success) {
        if (currentPath.startsWith("/user")) {
          dispatch(logoutUser())
          navigate("/login")
        } else if (currentPath.startsWith("/admin")) {
          dispatch(logoutAdmin())
          navigate("/adminlogin")
        } else {
          dispatch(logoutUser())
          navigate("/login")
        }
      } else {
        throw new Error(response.data.message?.join(", ") || "Logout failed")
      }
    } catch (error) {
      // Proceed with client-side logout even if API call fails
      if (currentPath.startsWith("/user")) {
        dispatch(logoutUser())
        navigate("/login")
      } else if (currentPath.startsWith("/admin")) {
        dispatch(logoutAdmin())
        navigate("/adminlogin")
      } else {
        dispatch(logoutUser())
        navigate("/login")
      }
    }
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
            <p className="text-sm font-medium text-[#1F2328]">{user?.name || "User"}</p>
            <p className="text-xs text-[#1F2328]">{user?.designation || "employee"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
          onClick={() => navigate(isAdmin ? "/admin/profile" : "/user/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
          onClick={() => navigate(isAdmin ? "/admin/change-password" : "/user/change-password")}
        >
          Change Password
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem
          onClick={() => {
            handleLogout()
          }}
          className="text-[#1F2328] hover:bg-[#F97316] hover:text-white"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}