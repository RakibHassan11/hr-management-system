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
import { Search, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {
  formatDate,
  formatDateTime,
  formatTime
} from "@/components/utils/dateHelper"

export default function AllAttendance() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [sortDirection, setSortDirection] = useState("asc")
  const [sortOn, setSortOn] = useState("name")
  const [query, setQuery] = useState("")

  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  const fetchEmployees = (
    page = currentPage,
    itemsPerPage = perPage,
    sortDir = sortDirection,
    sortField = sortOn,
    searchQuery = query,
    start = startDate,
    end = endDate
  ) => {
    let url = `${API_URL}/employee-attendance/all-employee-attendance-list?needPagination=true&page=${page}&perPage=${itemsPerPage}&sortDirection=${sortDir}&sortOn=${sortField}`

    if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`
    if (start && end) url += `&startdate=${start}&enddate=${end}`

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch employee data")
        }
        return response.json()
      })
      .then(data => {
        setEmployees(data.data || [])
        setTotalPages(data?.extraData?.totalPages || 1)
        setCurrentPage(data?.extraData?.currentPage || 1)
        setPerPage(data?.extraData?.perPage || 10)
        setTotalItems(data?.extraData?.total || 0)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    fetchEmployees()
  }, [token, API_URL])

  useEffect(() => {
    fetchEmployees()
  }, [token, API_URL, query, startDate, endDate])

  const handlePageChange = page => {
    setCurrentPage(page)
    fetchEmployees(page)
  }

  const handlePerPageChange = newPerPage => {
    setPerPage(newPerPage)
    setCurrentPage(1)
    fetchEmployees(1, newPerPage)
  }

  const handleSortChange = field => {
    const newSortDirection =
      sortOn === field && sortDirection === "asc" ? "desc" : "asc"
    setSortOn(field)
    setSortDirection(newSortDirection)
    fetchEmployees(currentPage, perPage, newSortDirection, field)
  }

  if (loading) {
    return (
      <p className="text-center text-gray-600">Loading all attendances...</p>
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
              className="pl-9 pr-4 py-2 w-full md:w-auto border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                No attendance data available for the selected date range.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="text-[#1F2328]">
                        Employee Name
                      </TableHead>
                      <TableHead className="text-[#1F2328]">Check In</TableHead>
                      <TableHead className="text-[#1F2328]">
                        Check Out
                      </TableHead>
                      <TableHead className="text-[#1F2328]">
                        Total Punch
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-[#1F2328]">
                          {employee.name}
                        </TableCell>
                        <TableCell className="text-[#1F2328]">
                          {/* {employee.check_in_time
                            ? `${formatDate(
                                employee.check_in_time
                              )} ${formatTime(employee.check_in_time)}`
                            : "--:--"} */}
                          {formatDateTime(employee.check_in_time)}
                        </TableCell>
                        <TableCell className="text-[#1F2328]">
                          {/* {employee.check_out_time
                            ? `${formatDate(
                                employee.check_out_time
                              )} ${formatTime(employee.check_out_time)}`
                            : "--:--"} */}
                          {formatDateTime(employee.check_out_time)}
                        </TableCell>
                        <TableCell className="text-[#1F2328]">
                          {employee.total_punch}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* {employees?.length >= perPage && ( */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>Show</span>
                    <select
                      value={perPage}
                      onChange={e =>
                        handlePerPageChange(Number(e.target.value))
                      }
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
                {/* )} */}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
