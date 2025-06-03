import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import api from '@/axiosConfig';
import Logo from "../../lovable-uploads/orangetoolz-logo-orange.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(90);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (step === 2) {
      timerId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [step]);

  const handleSendCode = async () => {
    try {
      await api.put('/auth/forget-password', { email });
      setStep(2);
      setTimer(90); // Reset timer when sending new code
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await api.put('/auth/verify-forget-password-code', { email, code: verificationCode });
      setStep(3);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      if (new_password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await api.put('/auth/reset-password', { email, new_password });
      setSuccess('Password reset successfully! You can now login.');
      navigate('/login');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await api.put('/auth/resend-verification-code', { email, resent_type: "forgetPassword" });
      if (response.status === 200) {
        setTimer(90);
      } else {
        throw new Error(response.data?.message || 'Failed to resend verification code');
      }
    } catch (err) {
      console.error('Resend code error:', err);
      setError(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-[#1F2328]/20 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="OrangeToolz" className="h-14" />
          </div>
          <div className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {step === 1 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSendCode();
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Email</label>
                  <Input
                    id='email'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-[#1F2328]/50 rounded-md px-3 py-2"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
                >
                  Send Verification Code
                </Button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-[#1F2328]">
                  We've sent a verification code to {email}. Please enter it below:
                </p>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="border border-[#1F2328]/50 rounded-md px-3 py-2"
                    placeholder="Enter verification code"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    onClick={handleVerifyCode}
                    className="w-1/2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
                  >
                    Verify Code
                  </Button>
                  <Button
                    onClick={handleResendCode}
                    className="w-1/2 bg-[#EA580C]/10 hover:bg-[#EA580C]/20 text-[#EA580C] font-semibold py-2 rounded-md"
                    disabled={timer > 0}
                  >
                    {timer > 0 ? `${timer}s left` : 'Resend Code'}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }} className="space-y-6">
                <div className="space-y-2 relative">
                <label className="text-sm font-medium text-[#1F2328]">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={new_password}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border border-[#1F2328]/50 rounded-md px-3 py-2 pr-10"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600"
                    >
                      {showPassword ? <EyeOff size={20} className="opacity-75" /> : <Eye size={20} className="opacity-75" />}
                    </button>
                  </div>
                  <label className="text-sm font-medium text-[#1F2328]">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border border-[#1F2328]/50 rounded-md px-3 py-2 pr-10"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600"
                    >
                      {showPassword ? <EyeOff size={20} className="opacity-75" /> : <Eye size={20} className="opacity-75" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-md"
                >
                  Reset Password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;