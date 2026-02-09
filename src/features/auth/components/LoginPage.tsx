import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from '../../../assets/orangetoolz-logo-orange.png';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { loginUser, setUserCredentials } from "@/store/authSlice";

import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loadingUser, errorUser } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/user");
    } catch (err) {
      console.error("User login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-[#1F2328]/20 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="OrangeToolz" className="h-14" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorUser && <p className="text-red-500 text-sm">{errorUser}</p>}

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
              />
            </div>

            <div className="space-y-2 relative">
              <label
                className="text-sm font-medium text-[#1F2328]"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#1F2328]/50 rounded-md px-3 py-2"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600"
              >
                {showPassword ? <EyeOff size={20} className="opacity-75" /> : <Eye size={20} className="opacity-75" />}
              </button>
              <Link className="text-[#F97316] hover:text-[#EA580C] text-sm font-medium" to="/forgot-password">Forgotten Password?</Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
              disabled={loadingUser}
            >
              {loadingUser ? "Logging in..." : "LOGIN"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;