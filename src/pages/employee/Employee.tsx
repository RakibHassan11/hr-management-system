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
import { useNavigate } from "react-router-dom"

export default function Employee() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [sortDirection, setSortDirection] = useState("asc")
  const [sortOn, setSortOn] = useState("name")

  const [employeeData, setEmployeeData] = useState({
    name: ""
  })

  const fetchEmployees = (
    query = "",
    page = currentPage,
    itemsPerPage = perPage,
    sortDir = sortDirection,
    sortField = sortOn
  ) => {
    setLoading(true)
    let url = `${API_URL}/employee/list?needPagination=true&page=${page}&perPage=${itemsPerPage}&sortDirection=${sortDir}&sortOn=${sortField}`
    if (query) {
      url += `&query=${query}`
    }

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
        setEmployees(data.data)
        setTotalPages(data.extraData.totalPages)
        setCurrentPage(data.extraData.currentPage)
        setPerPage(data.extraData.perPage)
        setTotalItems(data.extraData.total)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEmployees()
  }, [token, API_URL])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchEmployees(employeeData.name, 1)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
    fetchEmployees(employeeData.name, page)
  }

  const handlePerPageChange = newPerPage => {
    setPerPage(newPerPage)
    setCurrentPage(1)
    fetchEmployees(employeeData.name, 1, newPerPage)
  }

  const handleSortChange = field => {
    const newSortDirection =
      sortOn === field && sortDirection === "asc" ? "desc" : "asc"
    setSortOn(field)
    setSortDirection(newSortDirection)
    fetchEmployees(
      employeeData.name,
      currentPage,
      perPage,
      newSortDirection,
      field
    )
  }

  const handleEditClick = employee => {
    navigate(`/user/employee/profile?id=${employee.id}`)
  }

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-6">
        <div className="w-full flex items-center space-x-4">
          <Input
            placeholder="Employee Name"
            className="border border-gray-300 w-full p-4"
            value={employeeData.name}
            onChange={e =>
              setEmployeeData({ ...employeeData, name: e.target.value })
            }
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {loading && (
          <p className="text-center text-gray-600">Loading employees...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead
                    className="text-[#1F2328]"
                    onClick={() => handleSortChange("employee_id")}
                  >
                    Employee ID{" "}
                    {sortOn === "employee_id" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="text-[#1F2328] cursor-pointer"
                    onClick={() => handleSortChange("name")}
                  >
                    Name{" "}
                    {sortOn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="text-[#1F2328] cursor-pointer"
                    onClick={() => handleSortChange("email")}
                  >
                    Email{" "}
                    {sortOn === "email" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-[#1F2328]">Phone</TableHead>
                  <TableHead className="text-[#1F2328]">Designation</TableHead>
                  <TableHead className="text-[#1F2328]">Department</TableHead>
                  <TableHead className="text-[#1F2328]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(employee => (
                  <TableRow key={employee.employee_id}>
                    <TableCell className="text-[#1F2328]">
                      {employee.employee_id}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {employee.name}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {employee.email}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {employee.phone || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {employee.designation || "N/A"}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {employee.department || "Development"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          handleEditClick(employee)
                        }}
                        className="text-[#fff] bg-[#8e44ad] border-none px-4 py-1 text-md rounded-md cursor-pointer transition-all duration-300 hover:bg-[#860dba]"
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
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

              <span>Total: {totalItems} employees</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
