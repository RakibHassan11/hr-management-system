import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { FaCheck, FaTimes } from "react-icons/fa"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import {
  formatDate,
  formatText,
  formatTime
} from "@/components/utils/dateHelper"

interface AttendanceRecord {
  id: number
  employee_id: number
  employee_name: string
  date: string
  time: string
  type: string
  status:
    | "PENDING"
    | "APPROVED_BY_LINE_MANAGER"
    | "REJECTED_BY_LINE_MANAGER"
    | "APPROVED_BY_HR"
    | "REJECTED_BY_HR"
    | string
  description: string
  created_at: string
  updated_at?: string
  cancelled_at?: string | null
  active?: boolean
}

const TeamAttendanceRecord = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const recordsPerPage = 10
  const { userToken } = useSelector((state: RootState) => state.auth)
  const { id } = useSelector((state: RootState) => state.auth.user)
  const API_BASE_URL = import.meta.env.VITE_API_URL
  const storedToken = localStorage.getItem("token_user") || userToken

  if (!storedToken) {
    setError("No authentication token found. Please log in.")
    setIsLoading(false)
    return
  }

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const url = `${API_BASE_URL}/employee/all-time-record-list`

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        })

        const result = await response.json()
        setAttendanceRecords(result)
      } catch (error) {
        console.error("Fetch error:", error)
        setError(
          "Network error: Failed to fetch attendance records. Please try again later."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendanceRecords()
  }, [userToken, id, API_BASE_URL])

  const handleAction = async (
    recordId: number,
    newStatus: "APPROVED_BY_HR" | "REJECTED_BY_HR"
  ) => {
    const actionText = newStatus === "APPROVED_BY_HR" ? "approve" : "reject"
    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this attendance record?`,
      text: "This action will update the attendance status.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      const payload = { id: recordId, status: newStatus }
      const url = `${API_BASE_URL}/employee/update-time-status`
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setAttendanceRecords(prevRecords =>
          prevRecords.map(record =>
            record.id === recordId ? { ...record, ...result.data } : record
          )
        )
        toast.success("Attendance status updated successfully")
      } else {
        toast.error(result.message || "Failed to update attendance record.")
      }
    } catch (error) {
      console.error("Network error:", error)
      toast.error("Network error: Failed to update attendance record.")
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = attendanceRecords?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  )
  const totalPages = Math.ceil(attendanceRecords?.length / recordsPerPage) || 1

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  return (
    <div className="bg-white text-[#1F2328] p-6">
      <h1 className="text-2xl font-bold text-[#1F2328] mb-6">
        Employee Attendance Records
      </h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-[#1F2328]">Employee Name</TableHead>
              <TableHead className="text-[#1F2328]">Date</TableHead>
              <TableHead className="text-[#1F2328]">Time</TableHead>
              <TableHead className="text-[#1F2328]">Type</TableHead>
              <TableHead className="text-[#1F2328]">Description</TableHead>
              <TableHead className="text-[#1F2328]">Status</TableHead>
              <TableHead className="text-[#1F2328]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[#1F2328]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentRecords?.length > 0 ? (
              currentRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="text-[#1F2328]">
                    {record.employee_name || record.employee_id}
                  </TableCell>
                  <TableCell className="text-[#1F2328]">
                    {formatDate(record.date)}
                  </TableCell>
                  <TableCell className="text-[#1F2328]">
                    {formatTime(record.time)}
                  </TableCell>
                  <TableCell className="text-[#1F2328]">
                    {formatText(record.type)}
                  </TableCell>
                  <TableCell className="text-[#1F2328] truncate max-w-xs">
                    {record.description}
                  </TableCell>
                  <TableCell className="text-[#1F2328]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.status === "APPROVED_BY_LINE_MANAGER" ||
                        record.status === "APPROVED_BY_HR"
                          ? "bg-green-100 text-green-800"
                          : record.status === "REJECTED_BY_LINE_MANAGER" ||
                            record.status === "REJECTED_BY_HR"
                          ? "bg-red-100 text-red-800"
                          : record.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formatText(record.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium space-x-2">
                    {record.status === "APPROVED_BY_LINE_MANAGER" && (
                      <>
                        <button
                          className="p-2 rounded bg-gray-500 text-white hover:bg-green-600"
                          onClick={() =>
                            handleAction(record.id, "APPROVED_BY_HR")
                          }
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="p-2 rounded bg-gray-500 text-white hover:bg-red-600"
                          onClick={() =>
                            handleAction(record.id, "REJECTED_BY_HR")
                          }
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[#1F2328]">
                  No attendance records available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center p-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-[#1F2328]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamAttendanceRecord
