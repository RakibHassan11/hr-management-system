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
import { Search, Download, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import axios from "axios"
import moment from "moment-timezone"
import { formatDate } from "@/components/utils/dateHelper"

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

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function AllAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(30)
  const [totalItems, setTotalItems] = useState(0)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortOn, setSortOn] = useState<string>("name")
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500) // 500ms debounce delay

  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  // State for export file type (CSV or EXCEL)
  const [exportType, setExportType] = useState("CSV")

  // Function to format UTC time to Dhaka time (Asia/Dhaka, UTC+6) in HH:mm format
  const formatDhakaTime = (time: string | null) => {
    if (!time) return "--:--"
    // Parse time as UTC and convert to Dhaka time (UTC+6) using moment-timezone
    const momentTime = moment.utc(time).tz("Asia/Dhaka")
    return momentTime.isValid() ? momentTime.format("HH:mm") : "--:--"
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
    sortDir = sortDirection,
    sortField = sortOn,
    searchQuery = debouncedQuery,
    start = startDate,
    end = endDate
  ) => {
    if (!token) {
      setError("No authentication token available")
      setLoading(false)
      return
    }

    let url = `${API_URL}/employee-attendance/all-employee-attendance-list?needPagination=true&page=${page}&perPage=${itemsPerPage}&sortDirection=${sortDir}&sortOn=${sortField}`

    if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`
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

      const data = response.data
      if (data.success && Array.isArray(data.data)) {
        setEmployees(data.data)
        setTotalPages(data?.extraData?.totalPages || 1)
        setCurrentPage(data?.extraData?.currentPage || 1)
        setPerPage(data?.extraData?.perPage || 30)
        setTotalItems(data?.extraData?.total || 0)
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

  // Function to handle the export API call
  const handleExport = async () => {
    let exportUrl = `${API_URL}/employee-attendance/attendance-export?needPagination=false&sortDirection=${sortDirection}&sortOn=${sortOn}&status=active`

    if (debouncedQuery) exportUrl += `&query=${encodeURIComponent(debouncedQuery)}`
    if (startDate && endDate) exportUrl += `&startdate=${startDate}&enddate=${endDate}`
    exportUrl += `&type=${exportType}`

    try {
      const response = await axios({
        method: 'GET',
        url: exportUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        responseType: 'blob'
      })

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance_${startDate}_to_${endDate}.${exportType.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setError(error.message || "Failed to export attendance data")
    }
  }
  // Default value search Page
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    setLoading(true)
    fetchEmployees()
  }, [token, API_URL])

  useEffect(() => {
    fetchEmployees(currentPage, perPage, sortDirection, sortOn, debouncedQuery, startDate, endDate)
  }, [token, API_URL, debouncedQuery, startDate, endDate, currentPage, perPage, sortDirection, sortOn]) 

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchEmployees(page)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
    fetchEmployees(1, newPerPage)
  }

  const handleSortChange = (field: string) => {
    const newSortDirection = sortOn === field && sortDirection === "asc" ? "desc" : "asc"
    setSortOn(field)
    setSortDirection(newSortDirection)
    fetchEmployees(currentPage, perPage, newSortDirection, field)
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
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-gray-800">All Attendance</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 w-full md:w-auto border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 md:flex-none">
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="py-2 w-full border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
                  disabled
                />
              </div>
              <div className="relative flex-1 md:flex-none">
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="py-2 w-full border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={exportType}
                onChange={e => setExportType(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
                disabled
              >
                <option value="CSV">CSV</option>
                <option value="EXCEL">Excel</option>
              </select>
              <Button
                onClick={handleExport}
                className="bg-[#F97316] text-white hover:bg-[#e06615]"
                disabled
              >
                <Download size={18} className="text-white hover:text-gray-200" />
              </Button>
              <Button
                onClick={() => {
                  setQuery("")
                  setStartDate(today)
                  setEndDate(today)
                  setExportType("CSV")
                }}
                className="bg-[#F97316] text-white hover:bg-[#e06615]"
                disabled
              >
                <RefreshCcw size={18} className="text-white hover:text-gray-200" />
              </Button>
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
        <h1 className="text-2xl font-bold text-gray-800">All Attendance</h1>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search employees..."
              className="pl-9 pr-4 py-2 w-full md:w-auto border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 md:flex-none">
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="py-2 w-full border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
              />
            </div>

            <div className="relative flex-1 md:flex-none">
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="py-2 w-full border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={exportType}
              onChange={e => setExportType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              <option value="CSV">CSV</option>
              <option value="EXCEL">Excel</option>
            </select>
            <Button
              onClick={handleExport}
              className="bg-[#F97316] text-white hover:bg-[#e06615]"
            >
              <Download size={18} className="text-white hover:text-gray-200" />
            </Button>
            <Button
              onClick={() => {
                setQuery("")
                setStartDate(today)
                setEndDate(today)
                setExportType("CSV")
              }}
              className="bg-[#F97316] text-white hover:bg-[#e06615]"
            >
              <RefreshCcw size={18} className="text-white hover:text-gray-200" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {!loading && !error && (
          <>
            {employees.length === 0 ? (
              <p className="text-center text-gray-600">
                No attendance data available for the selected date range.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("name")}
                      >
                        Employee Name {sortOn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("created_at")}
                      >
                        Date {sortOn === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("check_in_time")}
                      >
                        Check In {sortOn === "check_in_time" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("check_out_time")}
                      >
                        Check Out {sortOn === "check_out_time" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("duration")}
                      >
                        Duration {sortOn === "duration" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("total_punch")}
                      >
                        Total Punch {sortOn === "total_punch" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-[#1F2328] text-center cursor-pointer"
                        onClick={() => handleSortChange("comment")}
                      >
                        Comment {sortOn === "comment" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee, index) => {
                      const checkIn = formatDhakaTime(employee.check_in_time)
                      const checkOut = formatDhakaTime(employee.check_out_time)
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
                      className="border border-[#F97316] rounded-md p-1 text-[#1F2328] focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
                    >
                      <option value={30} className="text-[#1F2328]">30</option>
                      <option value={60} className="text-[#1F2328]">60</option>
                      <option value={120} className="text-[#1F2328]">120</option>
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