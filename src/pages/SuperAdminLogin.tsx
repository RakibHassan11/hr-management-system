import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from '../lovable-uploads/orangetoolz-logo-orange.png';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuperAdmin } from '../store/authSlice';
import { toast } from 'sonner';
import { RootState } from '../store/store';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => {
    console.log('Redux state in SuperAdminLogin:', state);
    return state.auth;
  });
  const loading = authState?.loading ?? false;
  const error = authState?.error ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting login with:', { email, password });
    try {
      await dispatch(loginSuperAdmin({ email, password }) as any).unwrap();
      console.log('Login succeeded');
      toast.success('Logged in as Super Admin');
      navigate('/admin/home');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(error || 'Failed to log in. Please try again.');
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2328]" htmlFor="email">
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="w-full text-[#EA580C]"
              disabled={loading}
            >
              Login as Employee/Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;