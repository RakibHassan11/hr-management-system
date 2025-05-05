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
import api from "@/axiosConfig"
import moment from "moment-timezone"
import { formatDate, formatTimeToUTC } from "@/components/utils/dateHelper"

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

export default function MyAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(30)
  const [totalItems, setTotalItems] = useState(0)

  const startOfCurrentMonth = moment().startOf("month").format("YYYY-MM-DD");
  const today = moment().format("YYYY-MM-DD")
  const [startDate, setStartDate] = useState(startOfCurrentMonth)
  const [endDate, setEndDate] = useState(today)

  // Function to calculate duration and check if above 9 hours
  const calculateDuration = (inTime: string | null, outTime: string | null) => {
    if (!inTime || !outTime || inTime === "Invalid date" || outTime === "Invalid date") {
      return { duration: "--:--", isAbove9Hours: false }
    }
  
    const inMoment = moment.tz(inTime, "UTC").tz("Asia/Dhaka")
    const outMoment = moment.tz(outTime, "UTC").tz("Asia/Dhaka")
  
    if (!inMoment.isValid() || !outMoment.isValid() || outMoment.isBefore(inMoment)) {
      return { duration: "--:--", isAbove9Hours: false }
    }
  
    const duration = moment.duration(outMoment.diff(inMoment))
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes().toString().padStart(2, "0")
    const isAbove9Hours = duration.asHours() > 8.75
  
    return {
      duration: `${hours}:${minutes}`,
      isAbove9Hours
    }
  }

  // Function to check if check-in is at or before 10:15 AM
  const isCheckInOnTime = (time: string | null): boolean => {
    if (!time || time === "Invalid date") return false
    const checkIn = moment.tz(time, "UTC").tz("Asia/Dhaka")
    const threshold = moment.tz(checkIn.format("YYYY-MM-DD"), "Asia/Dhaka").set({ hour: 10, minute: 15 })
    return checkIn.isValid() && checkIn.isSameOrBefore(threshold)
  }

  // Function to check if check-out is after 7:00 PM
  const isCheckOutLate = (time: string | null): boolean => {
    if (!time || time === "Invalid date") return false
    const checkOut = moment.tz(time, "UTC").tz("Asia/Dhaka")
    const threshold = moment.tz(checkOut.format("YYYY-MM-DD"), "Asia/Dhaka").set({ hour: 19, minute: 0 })
    return checkOut.isValid() && checkOut.isAfter(threshold)
  }

  // Function to check if date is a weekend (Saturday or Sunday)
  const isWeekend = (date: string): boolean => {
    const momentDate = moment.tz(date, "UTC").tz("Asia/Dhaka")
    return momentDate.isValid() && [6, 0].includes(momentDate.day()) // 6 = Saturday, 0 = Sunday
  }

  // Function to format statistics keys for display
  const formatStatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  // Function to determine text and background classes for values
  const getValueStyles = (key: string, value?: string | number | boolean, employee?: Employee) => {
    switch (key.toLowerCase()) {
      case 'present':
      case 'holiday':
        return { textClass: 'text-green-800', bgClass: 'bg-green-100' }
      case 'sickleave':
      case 'annualleave':
        return { textClass: 'text-blue-700', bgClass: 'bg-blue-50' }
      case 'absent':
        return { textClass: 'text-red-800', bgClass: 'bg-red-100' }
      case 'halfday':
      case 'latein':
      case 'earlyout':
        return { textClass: 'text-orange-800', bgClass: 'bg-orange-100' }
      case 'total punch':
        return { textClass: 'text-blue-700', bgClass: 'bg-blue-50' }

      case 'check in':
      case 'check out':{
        if (!employee?.check_in_time || !employee?.check_out_time) {
          return { textClass: '', bgClass: '' };
        }
      
          const isOnTime =
          key.toLowerCase() === 'check in' 
            ? isCheckInOnTime(employee.check_in_time)
            : isCheckOutLate(employee.check_out_time);

      
        return isOnTime
          ? { textClass: 'text-green-800', bgClass: 'bg-green-100' }
          : { textClass: 'text-red-800', bgClass: 'bg-red-100' };
      }
          
      case 'duration':
        if (!employee?.check_in_time || !employee?.check_out_time) {
          return { textClass: '', bgClass: '' }; 
        }
        return employee && calculateDuration(employee.check_in_time, employee.check_out_time).isAbove9Hours
          ? { textClass: 'text-green-800', bgClass: 'bg-green-100' }
          : { textClass: 'text-red-800', bgClass: 'bg-red-100' }
      case 'date':
        return isWeekend(employee?.created_at)
          ? { textClass: 'text-blue-700', bgClass: 'bg-blue-50' }
          : { textClass: '', bgClass: '' }
      case 'comment':
        if (typeof value === 'string') {
          switch (value.toLowerCase()) {
            case 'present':
            case 'holiday':
              return { textClass: 'text-green-800', bgClass: 'bg-green-100' }
            case 'sick leave':
            case 'annual leave':
              return { textClass: 'text-blue-700', bgClass: 'bg-blue-50' }
            case 'weekend':
              return { textClass: 'text-blue-700', bgClass: 'bg-blue-50' }  
            case 'absent':
              return { textClass: 'text-red-800', bgClass: 'bg-red-100' }
            case 'half day':
            case 'late in':
            case 'early out':
              return { textClass: 'text-orange-800', bgClass: 'bg-orange-100' }
            default:
              return { textClass: '', bgClass: '' }
          }
        }
        return { textClass: '', bgClass: '' }
      case 'employee name':
        return { textClass: '', bgClass: '' }
      default:
        return { textClass: '', bgClass: '' }
    }
  }

  const fetchAttendanceData = async (
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

    let url = `${API_URL}/employee-attendance/attendance-list?needPagination=true&perPage=${itemsPerPage}&page=${page}`
    if (start && end) {
      url += `&startdate=${start}&enddate=${end}`
    }

    try {
      setLoading(true)
      const response = await api({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const result = response.data
      if (
        result.success &&
        Array.isArray(result.data.attendanceRecords) &&
        result.data.statistics
      ) {
        setEmployees(result.data.attendanceRecords)
        setStatistics(result.data.statistics)
        setTotalPages(result.extraData.totalPages)
        setCurrentPage(result.extraData.currentPage)
        setPerPage(result.extraData.perPage)
        setTotalItems(result.extraData.total)
        setTotalRecords(result.extraData.total)
        setError(null)
      } else {
        setEmployees([])
        setStatistics(null)
        setTotalRecords(0)
        setError("No attendance or statistics data available")
      }
    } catch (error) {
      setError(error.message || "Failed to fetch attendance data")
      setEmployees([])
      setStatistics(null)
      setTotalRecords(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [token, API_URL, startDate, endDate, perPage, currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

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
                <div className="h-4 bg-gray-200 rounded-xl  w-1/4 mx-auto animate-pulse"></div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="p-6 bg-white text-c min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
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

      <div className="bg-white shadow-lg rounded-xl  p-6 border border-gray-300 mb-6">
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          Attendance Statistics</h2>
        
        {loading ? (
          <StatisticsSkeletonLoader />
        ) : statistics ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                {Object.keys(statistics).map((key) => (
                  <TableHead key={key} className="text-[#1F2328] text-center font-semibold">
                    {formatStatKey(key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {Object.entries(statistics).map(([key, value], index) => (
                  <TableCell key={index} className="text-center font-semibold text-slate-700">
                    <span className={`px-2 py-1 ${getValueStyles(key, value).textClass} ${getValueStyles(key, value).bgClass} rounded-xl `}>
                      {value}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-red-500">No statistics data available for the selected period.</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          Attendance Records</h2>
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : employees.length === 0 ? (
          <p className="text-center text-gray-600">No attendance data available for the selected period.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {["Employee Name", "Date", "Check In", "Check Out", "Duration", "Total Punch", "Comment"].map((header) => (
                    <TableHead key={header} className="text-[#1F2328] text-center font-semibold">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee, index) => {
                  const checkIn = formatTimeToUTC(employee.check_in_time)
                  const checkOut = formatTimeToUTC(employee.check_out_time)
                  const { duration } = calculateDuration(employee.check_in_time, employee.check_out_time)
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-center font-semibold text-gray-700">
                        <span className={`px-2 py-1 ${getValueStyles('employee name').textClass} ${getValueStyles('employee name').bgClass} rounded-xl `}>
                          {employee.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-800">
                          <span className="px-2 py-1 bg-slate-100 rounded-xl">
                          {formatDate(employee.created_at)}
                          </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className={`px-2 py-1 ${getValueStyles('check in', checkIn, employee).textClass} ${getValueStyles('check in', checkIn, employee).bgClass} rounded-xl `}>
                          {checkIn}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className={`px-2 py-1 ${getValueStyles('check out', checkOut, employee).textClass} ${getValueStyles('check out', checkOut, employee).bgClass} rounded-xl `}>
                          {checkOut}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className={`px-2 py-1 ${getValueStyles('duration', duration, employee).textClass} ${getValueStyles('duration', duration, employee).bgClass} rounded-xl `}>
                          {duration}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className={`px-2 py-1 rounded-xl  ${getValueStyles('total punch').textClass} ${getValueStyles('total punch').bgClass} rounded-xl `}>
                          {employee.total_punch}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className={`px-2 py-1 rounded-xl ${getValueStyles('comment', employee.comment).textClass} ${getValueStyles('comment', employee.comment).bgClass} `}>
                          {employee.comment || "N/A"}
                        </span>
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