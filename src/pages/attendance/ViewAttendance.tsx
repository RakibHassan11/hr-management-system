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
  created_at: string
  comment: string
}

export default function ViewAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(30)
  const [totalItems, setTotalItems] = useState(0)

  // Set default startDate and endDate to current month
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD")
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD")
  const [startDate, setStartDate] = useState(currentMonthStart)
  const [endDate, setEndDate] = useState(currentMonthEnd)

  // Function to format UTC time to Dhaka time (Asia/Dhaka, UTC+6) in HH:mm format
  const formatDateTime = (time: string | null) => {
    if (!time) return "--:--"
    // Parse time as UTC and convert to Dhaka time (UTC+6)
    const momentTime = moment.tz(time, "UTC").tz("Asia/Dhaka")
    return momentTime.isValid() ? momentTime.format("HH:mm") : "--:--"
  }

  // Function to format created_at to YYYY-MM-DD (no time zone conversion)
  const formatDate = (createdAt: string) => {
    if (!createdAt) return "--"
    const momentDate = moment.tz(createdAt, "UTC")
    return momentDate.isValid() ? momentDate.format("YYYY-MM-DD") : "--"
  }

  // Function to calculate duration between check-in and check-out in Dhaka time
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
    start = startDate,
    end = endDate
  ) => {
    if (!token) {
      setError("No authentication token available")
      setLoading(false)
      return
    }

    let url = `${API_URL}/employee-attendance/attendance-list?needPagination=true&page=${page}&perPage=${itemsPerPage}`

    if (start && end) url += `&startdate=${start}&enddate=${end}`

    try {
      setLoading(true)
      const response = await axios({
        method: 'GET',
        url: url,
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
        setPerPage(result?.extraData?.perPage || 30)
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
  }, [token, API_URL, startDate, endDate, currentPage, perPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  // Skeleton Loader Component
  const SkeletonLoader = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-[#1F2328] text-center">Employee Name</TableHead>
            <TableHead className="text-[#1F2328] text-center">Date</TableHead>
            <TableHead className="text-[#1F2328] text-center">Check In</TableHead>
            <TableHead className="text-[#1F2328] text-center">Check Out</TableHead>
            <TableHead className="text-[#1F2328] text-center">Duration</TableHead>
            <TableHead className="text-[#1F2328] text-center">Total Punch</TableHead>
            <TableHead className="text-[#1F2328] text-center">Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (loading) {
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
                  className="pl-3 pr-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled
                />
              </div>
              <div className="relative flex-1 md:flex-none">
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="pl-3 pr-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <SkeletonLoader />
        </div>
      </div>
    )
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
                className="pl-3 pr-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative flex-1 md:flex-none">
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="pl-3 pr-3 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
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
                      <TableHead className="text-[#1F2328] text-center">Employee Name</TableHead>
                      <TableHead className="text-[#1F2328] text-center">Date</TableHead>
                      <TableHead className="text-[#1F2328] text-center">Check In</TableHead>
                      <TableHead className="text-[#1F2328] text-center">Check Out</TableHead>
                      <TableHead className="text-[#1F2328] text-center">Duration</TableHead>
                      <TableHead className="text-[#1F2328] text-center">Total Punch</TableHead>
                      <TableHead className="text-[#1F2328] text-center">Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee, index) => {
                      const checkIn = formatDateTime(employee.check_in_time)
                      const checkOut = formatDateTime(employee.check_out_time)
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-[#1F2328] text-center">
                            {employee.name}
                          </TableCell>
                          <TableCell className="text-[#1F2328] text-center">
                            {formatDate(employee.created_at)}
                          </TableCell>
                          <TableCell className="text-[#1F2328] text-center">
                            {checkIn}
                          </TableCell>
                          <TableCell className="text-[#1F2328] text-center">
                            {checkOut}
                          </TableCell>
                          <TableCell className="text-[#1F2328] text-center">
                            {calculateDuration(checkIn, checkOut)}
                          </TableCell>
                          <TableCell className="text-[#1F2328] text-center">
                            {employee.total_punch}
                          </TableCell>
                          <TableCell className="text-[#1F2328] text-center">
                            {employee.comment || "N/A"}
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
                      <option value={30}>30</option>
                      <option value={60}>60</option>
                      <option value={120}>120</option>
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