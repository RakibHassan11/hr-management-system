import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function TimeUpdate() {
  const [type, setType] = useState("")
  const [date, setDate] = useState("")
  const [timeHour, setTimeHour] = useState("")
  const [timeMinute, setTimeMinute] = useState("")
  const [description, setDescription] = useState("")
  const [updating, setUpdating] = useState(false)
  const [errorUpdating, setErrorUpdating] = useState(null)
  const navigate = useNavigate()

  const token = useSelector((state: RootState) => state.auth.userToken)
  const API_URL = import.meta.env.VITE_API_URL

  const resetForm = () => {
    setType("")
    setDate("")
    setTimeHour("")
    setTimeMinute("")
    setDescription("")
  }

  const handleTimeUpdate = async () => {
    if (!type || !date || !timeHour || !timeMinute || !description) {
      toast.error("All fields are required")
      return
    }

    const timeValue = `${timeHour.padStart(2, "0")}:${timeMinute.padStart(
      2,
      "0"
    )}:00`

    const payload = {
      type,
      date: new Date(date).toISOString(),
      time: timeValue,
      description
    }

    let toastId
    try {
      setUpdating(true)
      toastId = toast.loading("Updating time...")

      const response = await fetch(`${API_URL}/employee/update-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message, { id: toastId })
        resetForm()
      } else {
        toast.error(data.message || "Error updating time", { id: toastId })
      }
    } catch (error) {
      toast.error("Error updating time", { id: toastId })
      setErrorUpdating(error)
    } finally {
      setUpdating(false)
    }
  }

  if (errorUpdating)
    return <p className="text-center text-red-500">{errorUpdating}</p>

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Time Update Request</h1>
        <Button
          onClick={() => navigate("/user/time-update/time-update-list")}
          style={{ cursor: "pointer" }}
        >
          View Time Update Records
        </Button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Update Type:
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full border border-gray-300 bg-white">
                  <SelectValue placeholder="-- Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  <SelectItem value="IN">Check In</SelectItem>
                  <SelectItem value="OUT">Check Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date:</label>
              <Input
                type="date"
                className="w-full border border-gray-300"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time:</label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={timeHour} onValueChange={setTimeHour}>
                <SelectTrigger className="border border-gray-300 bg-white">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  {[...Array(23).keys()].map(i => {
                    const hour = i + 1 // Starts from 1 to 23
                    return (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, "0")}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Select value={timeMinute} onValueChange={setTimeMinute}>
                <SelectTrigger className="border border-gray-300 bg-white">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  {[...Array(60).keys()].map(minute => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description:
            </label>
            <Textarea
              className="w-full border border-gray-300"
              placeholder="Enter details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <Button disabled={updating} onClick={handleTimeUpdate}>
            {updating ? "Updating Time..." : "Apply for Time Update"}
          </Button>
        </div>
      </div>
    </div>
  )
}
