import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { formatDate, formatTime } from "@/components/utils/dateHelper"

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
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const fetchEmployees = (
    page = currentPage,
    itemsPerPage = perPage,
    sortDir = sortDirection,
    sortField = sortOn,
    searchQuery = query,
    start = startDate,
    end = endDate
  ) => {
    let url = `${API_URL}/employee-attendance/all-employee-attendance-list?needPagination=true`

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Attendance</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search employees..."
            className="border border-gray-300 rounded-md px-4 py-2 outline-none"
          />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 outline-none"
          />
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
                          {formatDate(employee.check_in_time)}{" "}
                          {formatTime(employee.check_in_time)}
                        </TableCell>
                        <TableCell className="text-[#1F2328]">
                          {formatDate(employee.check_out_time)}{" "}
                          {formatTime(employee.check_out_time)}
                        </TableCell>
                        <TableCell className="text-[#1F2328]">
                          {employee.total_punch}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {employees?.length >= perPage && (
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

                    <span>Total: {totalItems} employees</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
