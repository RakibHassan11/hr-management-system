import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-[rgb(74,182,201,0.2)] animate-fadeIn">
          <div className="flex justify-center mb-8">
            <img src="/lovable-uploads/a93f6f91-35cb-4bfa-bfb4-441228ad1560.png" alt="Logo" className="h-12" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-[rgb(74,182,201)]" htmlFor="email">
                Username/Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[rgb(74,182,201,0.3)]"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[rgb(74,182,201)]" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[rgb(74,182,201,0.3)]"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1FB77F] hover:bg-[#189962] text-white"
            >
              LOGIN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
