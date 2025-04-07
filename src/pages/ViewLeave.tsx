import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { RootState } from "@/store"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { formatDate, formatText } from "@/components/utils/dateHelper"
import { FaArrowRotateRight } from "react-icons/fa6"

export default function ViewLeave() {
  const [leaveData, setLeaveData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const fetchLeaveData = async (query = "") => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/employee/leave-record-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch leave records")
      }

      const data = await response.json()
      setLeaveData(data.data || [])
    } catch (err) {
      setError(err.message)
      setLeaveData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveData()
  }, [API_URL, token])

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Loading leave records...</p>
      </div>
    )
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-4">
          <p className="text-red-600">Error: {error}</p>
          <div>
            <FaArrowRotateRight
              className="text-center mx-auto mt-4 cursor-pointer"
              onClick={() => fetchLeaveData()}
            />
          </div>
        </div>
      )
    }

    if (leaveData.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-600">No leave record available</p>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-[#1F2328]">Name</TableHead>
            <TableHead className="text-[#1F2328]">Days</TableHead>
            <TableHead className="text-[#1F2328]">Description</TableHead>
            <TableHead className="text-[#1F2328]">Start Date</TableHead>
            <TableHead className="text-[#1F2328]">End Date</TableHead>
            <TableHead className="text-[#1F2328]">Type</TableHead>
            <TableHead className="text-[#1F2328]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveData.map(leave => (
            <TableRow key={leave.id}>
              <TableCell className="text-[#1F2328]">{leave.name}</TableCell>
              <TableCell className="text-[#1F2328]">{leave.days}</TableCell>
              <TableCell className="text-[#1F2328]">
                {leave.description}
              </TableCell>
              <TableCell className="text-[#1F2328]">
                {formatDate(leave.start_date)}
              </TableCell>
              <TableCell className="text-[#1F2328]">
                {formatDate(leave.end_date)}
              </TableCell>
              <TableCell className="text-[#1F2328] capitalize">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-xs">
                  {formatText(leave.type)}
                </span>
              </TableCell>
              <TableCell className="text-[#1F2328] font-medium">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    leave.status === "APPROVED_BY_LINE_MANAGER" ||
                    leave.status === "APPROVED_BY_HR"
                      ? "bg-green-100 text-green-800"
                      : leave.status === "REJECTED_BY_LINE_MANAGER" ||
                        leave.status === "REJECTED_BY_HR"
                      ? "bg-red-100 text-red-800"
                      : leave.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {formatText(leave.status)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Record</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {renderContent()}
      </div>
    </div>
  )
}
