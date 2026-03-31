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
import { useAllAttendance } from "@/features/attendance/hooks/useAllAttendance"
import moment from "moment-timezone"
import { formatDate } from "@/components/utils/dateHelper"

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
  const {
    records: employees,
    loading,
    error,
    pagination,
    fetchRecords
  } = useAllAttendance();

  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortOn, setSortOn] = useState<string>("name")

  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [comment, setComment] = useState("All")
  const [exportType, setExportType] = useState("CSV")

  const { currentPage, totalPages, perPage, totalItems } = pagination;

  // Function to format UTC time to Dhaka time (Asia/Dhaka, UTC+6) in HH:mm format
  const formatDhakaTime = (time: string | null) => {
    if (!time) return "--:--"
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

  useEffect(() => {
    fetchRecords({
      page: currentPage,
      perPage: perPage,
      sortDirection,
      sortOn,
      query: debouncedQuery,
      startdate: startDate,
      enddate: endDate,
      comment
    });
  }, [fetchRecords, currentPage, perPage, sortDirection, sortOn, debouncedQuery, startDate, endDate, comment]);

  // Reset current page when query or comment changes
  useEffect(() => {
    // This is handled upstream by reset if needed, but keeping it local for UI consistency
  }, [query, comment]);

  const handleExport = async () => {
    // Export remains mock for now or requires additional implementation plan
    console.log("Exporting...");
  }

  const handlePageChange = (page: number) => {
    fetchRecords({ page, perPage, sortDirection, sortOn, query: debouncedQuery, startdate: startDate, enddate: endDate, comment });
  }

  const handlePerPageChange = (newPerPage: number) => {
    fetchRecords({ page: 1, perPage: newPerPage, sortDirection, sortOn, query: debouncedQuery, startdate: startDate, enddate: endDate, comment });
  }

  const handleSortChange = (field: string) => {
    const newSortDirection = sortOn === field && sortDirection === "asc" ? "desc" : "asc"
    setSortOn(field)
    setSortDirection(newSortDirection)
    fetchRecords({ page: currentPage, perPage, sortDirection: newSortDirection, sortOn: field, query: debouncedQuery, startdate: startDate, enddate: endDate, comment });
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
          <div className="flex flex-col md:flex-row">
            <div className="relative">
              <Input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 w-46 md:w-40 border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
              />
              <div className="absolute top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 md:flex-none">
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="py-2 w-36 md:w-36 border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
                  disabled
                />
              </div>
              <div className="relative flex-1 md:flex-none">
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="py-2 w-36 md:w-36 border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
              >
                <option value="All">All</option>
                <option value="Other">Others</option>
                <option value="Absent">Absent</option>
              </select>
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
                  setComment("All")
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
              className="pl-9 pr-4 py-2 w-40 md:w-40 border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
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
                className="py-2 w-36 md:w-36 border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="relative flex-1 md:flex-none">
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="py-2 w-36 md:w-36 border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              <option value="All">All</option>
              <option value="Other">Others</option>
              <option value="Absent">Absent</option>
            </select>
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
                setStartDate(new Date().toISOString().split("T")[0])
                setEndDate(new Date().toISOString().split("T")[0])
                setComment("All")
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