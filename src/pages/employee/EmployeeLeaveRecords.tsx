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
import { formatDate, formatText } from "@/components/utils/dateHelper"
import Swal from "sweetalert2"

interface LeaveRecord {
  id: number
  employee_id: number
  name: string
  type: string
  start_date: string
  end_date: string
  days: number
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
  without_pay?: boolean
}

const EmployeeLeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10
  const { userToken } = useSelector((state: RootState) => state.auth)
  const { id } = useSelector((state: RootState) => state.auth.user)
  const API_BASE_URL = import.meta.env.VITE_API_URL
  const storedToken = localStorage.getItem("token_user") || userToken

  // Move token check inside the component body
  if (!storedToken) {
    setError("No authentication token found. Please log in.")
    setIsLoading(false)
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  useEffect(() => {
    const fetchLeaveRecords = async () => {
      const url = `${API_BASE_URL}/employee/all-leave-record-list`
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        })

        const result = await response.json()
        if (response.status === 200) {
          // Ensure result is an array; adjust based on actual API response structure
          const records = Array.isArray(result) ? result : result.data || []
          setLeaveRecords(records)
        } else {
          setError(result.message || "Failed to fetch leave records.")
        }
      } catch (error) {
        setError("Network error: " + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaveRecords()
  }, [storedToken, id, API_BASE_URL])

  const handleAction = async (
    recordId: number,
    newStatus: "APPROVED_BY_HR" | "REJECTED_BY_HR"
  ) => {
    const actionText = newStatus === "APPROVED_BY_HR" ? "approve" : "reject"
    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this leave request?`,
      text: "This action will update the leave status.",
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
      const response = await fetch(
        `${API_BASE_URL}/employee/update-leave-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      )

      const result = await response.json()
      if (response.ok && result.success) {
        setLeaveRecords(prevRecords =>
          prevRecords.map(record =>
            record.id === recordId ? { ...record, ...result.data } : record
          )
        )
        toast.success("Leave status updated successfully")
      } else {
        toast.error(result.message || "Failed to update leave record.")
      }
    } catch (error) {
      console.error("Network error:", error)
      toast.error("Network error: Failed to update leave record.")
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = leaveRecords?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  )
  const totalPages = Math.ceil(leaveRecords?.length / recordsPerPage) || 1

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  return (
    <div className="animate-fadeIn bg-white text-[#1F2328] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1F2328]">
          Employee Leave Records
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-[#1F2328]">Employee Name</TableHead>
              <TableHead className="text-[#1F2328]">Type</TableHead>
              <TableHead className="text-[#1F2328]">Start Date</TableHead>
              <TableHead className="text-[#1F2328]">End Date</TableHead>
              <TableHead className="text-[#1F2328]">Days</TableHead>
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
                  <TableCell className="text-[#1F2328] font-medium">
                    {record.name}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    {formatText(record.type)}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    {formatDate(record.start_date)}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    {formatDate(record.end_date)}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    {record.days}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                  No leave records available
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

export default EmployeeLeaveRecords
