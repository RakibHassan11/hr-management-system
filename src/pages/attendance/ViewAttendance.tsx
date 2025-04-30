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
  email: string
  designation: string
  check_in_time: string | null
  check_out_time: string | null
  total_punch: string
  created_at: string
  comment: string
}

// Define interface for statistics data
interface Statistics {
  present: number
  absent: number
  halfDay: number
  lateIn: number
  earlyOut: number
  sickLeave: number
  annualLeave: number
  holiday: number
}

export default function ViewAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [totalRecords, setTotalRecords] = useState(0) // Store dynamic total from extraData
  const [lastFetchedRange, setLastFetchedRange] = useState<string | null>(null) // Track last date range
  const API_URL = "https://hrm-api.orangetoolz.com/api/otz-hrm"
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(15) // Default to 15 for fetchEmployees
  const [totalItems, setTotalItems] = useState(0)

  // Set default startDate and endDate to current month
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD")
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD")
  const [startDate, setStartDate] = useState(currentMonthStart)
  const [endDate, setEndDate] = useState(currentMonthEnd)

  // Function to format UTC time to Dhaka time (Asia/Dhaka, UTC+6) in HH:mm format
  const formatDateTime = (time: string | null) => {
    if (!time) return "--:--"
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

  // Function to format statistics keys for display
  const formatStatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim()
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

    // Attendance API with pagination
    let url = `${API_URL}/employee-attendance/attendance-list?needPagination=true&perPage=${itemsPerPage}&page=${page}`
    if (start && end) {
      url += `&startdate=${start}&enddate=${end}`
    }

    try {
      setLoading(true)
      const response = await axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const result = response.data
      if (result.success && Array.isArray(result.data.attendanceRecords)) {
        setEmployees(result.data.attendanceRecords)
        setTotalPages(result.extraData.totalPages)
        setCurrentPage(result.extraData.currentPage)
        setPerPage(result.extraData.perPage )
        setTotalItems(result.extraData.total)
        setTotalRecords(result.extraData.total) // Dynamically set totalRecords
        setError(null)
      } else {
        setEmployees([])
        setStatistics(null)
        setTotalRecords(0)
        setError("No attendance data available")
      }
    } catch (error) {
      setError(error.message || "Failed to fetch employee data")
      setEmployees([])
      setStatistics(null)
      setTotalRecords(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async (start: string, end: string, total: number) => {
    if (!token) {
      setStatsError("No authentication token available")
      setLoading(false)
      return
    }

    // Skip if total is invalid or zero
    if (!total || total <= 0) {
      setStatsError("Invalid total records count")
      setLoading(false)
      setStatistics(null)
      return
    }

    // Skip if already fetched for this date range
    const currentRange = `${start}-${end}`
    if (lastFetchedRange === currentRange && statistics) {
      return
    }

    // Statistics API to fetch all records (perPage=total)
    let url = `${API_URL}/employee-attendance/attendance-list?needPagination=true&perPage=${total}`
    if (start && end) {
      url += `&startdate=${start}&enddate=${end}`
    }

    try {
      setLoading(true)
      const response = await axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const result = response.data
      if (result.success && result.data.statistics) {
        setStatistics(result.data.statistics)
        setStatsError(null)
        setLastFetchedRange(currentRange) // Update last fetched range
      } else {
        setStatistics(null)
        setStatsError("No statistics data available")
      }
    } catch (error) {
      setStatsError(error.message || "Failed to fetch statistics data")
      setStatistics(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch employees when token, API_URL, startDate, endDate, perPage, or currentPage changes
  useEffect(() => {
    fetchEmployees()
  }, [token, API_URL, startDate, endDate, perPage, currentPage])

  // Fetch statistics only when startDate, endDate, or totalRecords changes
  useEffect(() => {
    if (totalRecords > 0) {
      fetchStatistics(startDate, endDate, totalRecords)
    } else {
      setStatistics(null)
      setStatsError("No records available to fetch statistics")
    }
  }, [startDate, endDate, totalRecords])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  // Skeleton Loader Component for Attendance Table
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

  // Skeleton Loader Component for Statistics Table
  const StatisticsSkeletonLoader = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {["Present", "Absent", "Half Day", "Late In", "Early Out", "Sick Leave", "Annual Leave", "Holiday"].map((title) => (
              <TableHead key={title} className="text-[#1F2328] text-center">{title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {[...Array(8)].map((_, index) => (
              <TableCell key={index} className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    )
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

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Statistics</h2>
        {loading ? (
          <StatisticsSkeletonLoader />
        ) : statsError ? (
          <p className="text-center text-red-500">{statsError}</p>
        ) : statistics ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                {Object.keys(statistics).map((key) => (
                  <TableHead key={key} className="text-[#1F2328] text-center">
                    {formatStatKey(key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {Object.values(statistics).map((value, index) => (
                  <TableCell key={index} className="text-[#1F2328] text-center">
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-600">No statistics data available for the current month.</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Records</h2>
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : employees.length === 0 ? (
          <p className="text-center text-gray-600">No attendance data available for the current month.</p>
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
                  <option value={15}>15</option>
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
      </div>
    </div>
  )
}
