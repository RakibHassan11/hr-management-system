import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  toggleShowPassword
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[#1F2328]">
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
  const token = useSelector((state: RootState) => state.auth.userToken)
  const API_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async e => {
    e.preventDefault()

    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        duration: 3000
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        position: "top-right",
        duration: 3000
      })
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-right",
        duration: 3000
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to change password")
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password has been changed successfully", {
        position: "top-right",
        duration: 3000
      })
      // navigate("/user/home");
    } catch (error) {
      toast.error(
        error.message || "An error occurred while changing the password",
        {
          position: "top-right",
          duration: 3000
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-[100vh text-[#1F2328] flex flex-col">
      <div className="">
        <h1 className="text-2xl font-bold text-left">Change Password</h1>
      </div>

      <div className="flex justify-center mt-4">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
            <form onSubmit={handleSubmit} className="space-y-3">
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
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                  <span className="flex items-center justify-center">
                    Update Password
                    <CheckCircle size={16} className="ml-2" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
            <h2 className="text-lg font-semibold mb-4">
              Password Requirements
            </h2>
            <div className="space-y-4">
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Minimum 8 characters long</li>
                <li>Should include letters, numbers, and special characters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
