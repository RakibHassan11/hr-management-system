import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "../lovable-uploads/orangetoolz-logo-orange.png";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication logic
    if (email === "admin@orangetoolz.com" && password === "admin123") {
      const mockResponse = {
        user: {
          id: "1",
          name: "Admin User",
          email: email,
          role: "admin",
        },
        accessToken: "mock-token-admin",
      };
      const { user, accessToken } = mockResponse;
      handleLogin(user, accessToken, "/admin");
    } else if (email && password) {
      const mockResponse = {
        user: {
          id: "2",
          name: "Regular User",
          email: email,
          role: "user",
        },
        accessToken: "mock-token-user",
      };
      const { user, accessToken } = mockResponse;
      handleLogin(user, accessToken, "/user");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleLogin = (user: User, accessToken: string, path: string) => {
    try {
      dispatch(setCredentials({ user, accessToken }));
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("mockRole", user.role);
      setTimeout(() => navigate(path), 0);
    } catch (err) {
      setError("Failed to log in. Please try again.");
      console.error("Dispatch error:", err);
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
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2328]" htmlFor="email">
                Username/Email
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2328]" htmlFor="password">
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
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
            >
              LOGIN
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/adminlogin")}
              className="w-full text-[#EA580C]"
            >
              Login as Super Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;