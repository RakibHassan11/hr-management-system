import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  toggleShowPassword
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  showPassword: boolean
  toggleShowPassword: () => void
}) => {
  return (
    <div className="animate-fade-in mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-md border border-gray-200 focus-ring form-input-transition"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 form-input-transition"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff size={20} className="opacity-75" />
          ) : (
            <Eye size={20} className="opacity-75" />
          )}
        </button>
      </div>
    </div>
  )
}

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password has been changed successfully")
      // navigate("/user/home")
    }, 1500)
  }

  console.log(currentPassword, newPassword, confirmPassword)

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">
        Change Password
      </h1>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5">
              <Lock size={24} className="text-primary animate-pulse-subtle" />
            </div>
          </div>

          <div className="glassmorphism rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <PasswordInput
                id="current-password"
                label="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                showPassword={showCurrentPassword}
                toggleShowPassword={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
              />

              <div className="w-full h-px bg-gray-200 my-4"></div>

              <PasswordInput
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                showPassword={showNewPassword}
                toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
              />

              <PasswordInput
                id="confirm-password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                showPassword={showConfirmPassword}
                toggleShowPassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              <Button
                type="submit"
                className="w-full py-6 mt-8 hover-scale button-press"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Update Password
                    <CheckCircle size={16} className="ml-2 animate-float" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Password must be at least 8 characters long and should include
              letters, numbers, and special characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
