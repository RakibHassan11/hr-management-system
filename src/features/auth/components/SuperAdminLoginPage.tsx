import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from '../../../assets/orangetoolz-logo-orange.png';
import { useDispatch, useSelector } from "react-redux";
import { loginSuperAdmin } from "@/store/authSlice";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "@/store/store";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loadingAdmin, errorAdmin } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      await dispatch(loginSuperAdmin({ email, password })).unwrap();
      toast.success("Logged in as Super Admin");
      navigate("/admin/home");
    } catch (err) {
      toast.error(errorAdmin || "Failed to log in. Please try again.");
      if (process.env.NODE_ENV === "development") {
        console.error("Admin login failed:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-[#1F2328]/20 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="OrangeToolz" className="h-14" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2328] mb-4">Super Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorAdmin && (
              <p className="text-red-500 text-sm" aria-live="polite">
                {errorAdmin}
              </p>
            )}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#1F2328]"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#1F2328]/50 rounded-md px-3 py-2"
                placeholder="Enter your email"
                required
                disabled={loadingAdmin}
                aria-label="Email"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#1F2328]"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#1F2328]/50 rounded-md px-3 py-2"
                placeholder="Enter your password"
                required
                disabled={loadingAdmin}
                aria-label="Password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
              disabled={loadingAdmin}
              aria-label={loadingAdmin ? "Logging in" : "Login"}
            >
              {loadingAdmin ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="w-full text-[#EA580C]"
              disabled={loadingAdmin}
              aria-label="Login as User"
            >
              Login as User
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;