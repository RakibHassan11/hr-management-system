import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import axios from "axios"
import moment from "moment-timezone"

// Define interface for employee data
interface Employee {
  id: number
  employee_id: number
  name: string
  check_in_time: string | null
  check_out_time: string | null
  total_punch: string
}

export default function ViewAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortOn, setSortOn] = useState<string>("name")

  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  // Function to format UTC time to Asia/Dhaka (GMT+6) in HH:mm format
  const formatDateTime = (time: string | null) => {
    if (!time) return "--:--"
    const momentTime = moment.tz(time, "UTC").tz("Asia/Dhaka")
    return momentTime.isValid() ? momentTime.format("HH:mm") : "--:--"
  }

  // Function to calculate duration between check-in and check-out
  const calculateDuration = (inTime: string, outTime: string) => {
    if (inTime === "--:--" || outTime === "--:--") return "--:--"
    const inMoment = moment(inTime, "HH:mm")
    const outMoment = moment(outTime, "HH:mm")
    if (
      !inMoment.isValid() ||
      !outMoment.isValid() ||
      outMoment.isBefore(inMoment)
    ) {
      return "--:--"
    }
    const duration = moment.duration(outMoment.diff(inMoment))
    const hours = Math.floor(duration.asHours()).toString().padStart(2, "0")
    const minutes = duration.minutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const fetchEmployees = async (
    page = currentPage,
    itemsPerPage = perPage,
    sortDir = sortDirection,
    sortField = sortOn,
    start = startDate,
    end = endDate
  ) => {
    if (!token) {
      setError("No authentication token available")
      setLoading(false)
      return
    }

    let url = `${API_URL}/employee-attendance/attendance-list?needPagination=true&page=${page}&perPage=${itemsPerPage}&sortDirection=${sortDir}&sortOn=${sortField}`

    if (start && end) url += `&startdate=${start}&enddate=${end}`

    try {
      setLoading(true)
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const result = response.data
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data)
        setTotalPages(result?.extraData?.totalPages || 1)
        setCurrentPage(result?.extraData?.currentPage || 1)
        setPerPage(result?.extraData?.perPage || 10)
        setTotalItems(result?.extraData?.total || 0)
        setError(null)
      } else {
        setEmployees([])
        setError("No attendance data available")
      }
    } catch (error) {
      setError(error.message || "Failed to fetch employee data")
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  // Consolidated useEffect to prevent double API calls
  useEffect(() => {
    fetchEmployees()
  }, [token, API_URL, startDate, endDate, currentPage, perPage, sortDirection, sortOn])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  const handleSortChange = (field: string) => {
    const newSortDirection = sortOn === field && sortDirection === "asc" ? "desc" : "asc"
    setSortOn(field)
    setSortDirection(newSortDirection)
  }

  if (loading) {
    return <p className="text-center text-gray-600">Loading attendances...</p>
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">View Attendance</h1>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-3">
            <div className="relative flex-1 md:flex-none">
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Calendar size={16} />
              </div>
            </div>

            <div className="relative flex-1 md:flex-none">
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Calendar size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {!loading && !error && (
          <>
            {employees.length === 0 ? (
              <p className="text-center text-gray-600">
                No attendance data available.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead
                        className="text-[#1F2328] cursor-pointer"
                        onClick={() => handleSortChange("name")}
                      >
                        Employee Name {sortOn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-[#1F2328]">Check In</TableHead>
                      <TableHead className="text-[#1F2328]">Check Out</TableHead>
                      <TableHead className="text-[#1F2328]">Duration</TableHead>
                      <TableHead className="text-[#1F2328]">Total Punch</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee, index) => {
                      const checkIn = formatDateTime(employee.check_in_time)
                      const checkOut = formatDateTime(employee.check_out_time)
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-[#1F2328]">
                            {employee.name}
                          </TableCell>
                          <TableCell className="text-[#1F2328]">
                            {checkIn}
                          </TableCell>
                          <TableCell className="text-[#1F2328]">
                            {checkOut}
                          </TableCell>
                          <TableCell className="text-[#1F2328]">
                            {calculateDuration(checkIn, checkOut)}
                          </TableCell>
                          <TableCell className="text-[#1F2328]">
                            {employee.total_punch}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>Show</span>
                    <select
                      value={perPage}
                      onChange={e => handlePerPageChange(Number(e.target.value))}
                      className="border border-gray-300 rounded-md p-1"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>per page</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-[#F97316] text-white hover:bg-[#e06615]"
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-[#F97316] text-white hover:bg-[#e06615]"
                    >
                      Next
                    </Button>
                  </div>

                  <span>Total: {totalItems} attendances</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}