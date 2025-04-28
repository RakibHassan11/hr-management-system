import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User, Mail, Key, BadgeCheck } from "lucide-react"

export default function CreateEmployee() {
  const [employeeId, setEmployeeId] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [updating, setUpdating] = useState(false)
  const [errorUpdating, setErrorUpdating] = useState(null)
  const token = useSelector((state: RootState) => state.auth.userToken)
  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const resetForm = () => {
    setEmployeeId("")
    setFullName("")
    setEmail("")
    setPassword("")
  }

  const handleCreateEmployee = async () => {
    if (!employeeId || !fullName || !email || !password) {
      toast.error("All fields are required")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    const payload = {
      employee_id: employeeId,
      name: fullName,
      email: email,
      password: password
    }

    let toastId
    try {
      setUpdating(true)
      toastId = toast.loading("Creating employee...")

      const response = await fetch(`${API_URL}/employee/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(data.message, { id: toastId })
        resetForm()
      } else {
        toast.error(data.message || "Failed to create employee.", {
          id: toastId
        })
      }
      // navigate("/user/employee")
    } catch (error) {
      toast.error("Error creating employee", { id: toastId })
      setErrorUpdating(error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (errorUpdating)
    return <p className="text-center text-red-500">{errorUpdating}</p>

  return (
    <div className="min-h-screen relative  bg-white text-[#1F2328] p-6 md:p-12">
      <div className="mx-auto">
        <h1 className="absolute top-0 left-10 m-6 text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          <User size={24} className="text-[#F97316]" />
          Create New Employee
        </h1>

        <Card className=" ">

          <CardContent className="p-6 space-y-5 bg-white">
            <div className="space-y-1.5 w-1/2">
              <Label
                htmlFor="employee-id"
                className="text-sm font-medium text-gray-700"
              >
                Employee ID
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <BadgeCheck size={18} />
                </span>
                <Input
                  id="employee-id"
                  type="text"
                  placeholder="Enter employee ID..."
                  className="pl-10 py-2 text-[#1F2328] border-gray-400"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 w-1/2">
              <Label
                htmlFor="full-name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </span>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Enter full name..."
                  className="pl-10 py-2 text-[#1F2328] border-gray-400"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 w-1/2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  className="pl-10 py-2 text-[#1F2328] border-gray-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 w-1/2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Key size={18} />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  className="pl-10 py-2 text-[#1F2328] border-gray-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Password must be at least 8 characters
              </p>
            </div>

            <Button
              disabled={updating}
              onClick={handleCreateEmployee}
              className="bg-[#F97316] hover:bg-[#e06615] text-white px-6 py-2 rounded-md transition-colors"
            >
              {updating ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <span className="animate-spin">⟳</span>
                </>
              ) : (
                "Create Employee"
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-2">
          All employee information is securely stored and managed according to
          company policy.
        </p>
      </div>
    </div>
  )
}
