
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaSearch, FaPlus, FaEdit, FaSignOutAlt, FaEllipsisV } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import api from "@/axiosConfig";

// Custom debounce hook
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

interface Employee {
  id: number;
  employee_id: number;
  name: string;
  birthday: string | null;
  annual_leave_balance: number | null;
  sick_leave_balance: number | null;
}

export default function Employee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [resignationDate, setResignationDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [totalItems, setTotalItems] = useState(0);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortOn, setSortOn] = useState("employee_id");
  const [birthMonth, setBirthMonth] = useState("all");
  const [employeeData, setEmployeeData] = useState({ name: "" });

  const today = new Date().toISOString().split("T")[0];

  // Month options for the birth month filter
  const monthOptions = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // Format birthday to DD MMM, YYYY
  const formatBirthday = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const fetchEmployees = useCallback(
    (
      query = employeeData.name,
      birthMonthFilter = birthMonth,
      page = currentPage,
      itemsPerPage = perPage,
      sortDir = sortDirection,
      sortField = sortOn
    ) => {
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      let url = `${API_URL}/employee/list?needPagination=true&page=${page}&perPage=${itemsPerPage}&sortDirection=${sortDir}&sortOn=${sortField}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (birthMonthFilter !== "all") url += `&birthMonth=${birthMonthFilter}`;

      setLoading(true);
      api
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          if (Array.isArray(data.data)) {
            setEmployees(data.data);
            setTotalPages(data.extraData?.totalPages || 1);
            setCurrentPage(data.extraData?.currentPage || 1);
            setPerPage(data.extraData?.perPage || 100);
            setTotalItems(data.extraData?.total || 0);
            setError(null);
          } else {
            setEmployees([]);
            setError("No employee data available");
          }
        })
        .catch((error) => {
          setError(error.message || "Failed to fetch employee data");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [API_URL, token, employeeData.name, birthMonth, currentPage, perPage, sortDirection, sortOn]
  );

  const debouncedSearch = useDebounce((query: string, birthMonth: string) => {
    setCurrentPage(1);
    fetchEmployees(query, birthMonth, 1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setEmployeeData({ ...employeeData, name: newName });
    debouncedSearch(newName, birthMonth);
  };

  const handleBirthMonthChange = (value: string) => {
    setBirthMonth(value);
    setCurrentPage(1);
    fetchEmployees(employeeData.name, value, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEmployees(employeeData.name, birthMonth, page);
  };

  const handleSortChange = (field: string) => {
    const newSortDirection = sortOn === field && sortDirection === "asc" ? "desc" : "asc";
    setSortOn(field);
    setSortDirection(newSortDirection);
    fetchEmployees(employeeData.name, birthMonth, currentPage, perPage, newSortDirection, field);
  };

  const handleEditClick = (employee: Employee) => {
    navigate(`/user/employee/profile?id=${employee.id}`);
  };

  const handleResignClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setResignationDate(today);
    setIsResignModalOpen(true);
  };

  const handleResignSubmit = async (employeeId: number, resignationDate: string) => {
    if (!employeeId || !resignationDate) {
      toast.error("Employee ID and resignation date are required");
      return;
    }

    try {
      const response = await api.put(`${API_URL}/employee/resign-employee`, {
        id: employeeId,
       "resignation_date": resignationDate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to process resignation");
      }

      toast.success("Employee resignation processed successfully");
      setIsResignModalOpen(false);
      setSelectedEmployee(null);
      setResignationDate("");
      fetchEmployees();
    } catch (error) {
      toast.error(error.message || "Failed to process resignation");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="bg-white text-[#1F2328] p-3">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl font-bold text-[#1F2328]">Employee List</h1>
        <Button
          onClick={() => navigate("/user/employee/create")}
          className="font-medium rounded-md flex items-center gap-2 bg-[#F97316] text-white hover:bg-[#e06615]"
        >
          <FaPlus size={14} />
          Create Employee
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 mb-3 transition-all hover:shadow-lg">
        <div className="w-full flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 max-w-xs">
              <Input
                id="employee-search"
                placeholder="Search by name..."
                className="p-2 border border-gray-300 rounded-md bg-white text-[#1F2328] focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm h-8"
                value={employeeData.name}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    fetchEmployees(employeeData.name, birthMonth, 1);
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch size={12} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm">Select birth month:</label>
              <Select value={birthMonth} onValueChange={handleBirthMonthChange}>
                <SelectTrigger className="w-[180px] p-2 border border-gray-300 rounded-md bg-white text-[#1F2328] focus:outline-none focus:ring-2 focus:ring-[#F97316]">
                  <SelectValue placeholder="Birth Month" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-md">
                  <SelectItem value="all">All Months</SelectItem>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4">
        {loading && (
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328] w-[15%]">Employee ID</TableHead>
                <TableHead className="text-[#1F2328] w-[20%]">Name</TableHead>
                <TableHead className="text-[#1F2328] w-[20%]">Birthday</TableHead>
                <TableHead className="text-[#1F2328] w-[15%]">Annual</TableHead>
                <TableHead className="text-[#1F2328] w-[15%]">Sick</TableHead>
                <TableHead className="text-[#1F2328] w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">
                    <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-3 w-1/2 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-3 w-1/3 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-3 w-1/3 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-3 w-1/3 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {error && <div className="p-6 text-center text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <Table className="table-fixed w-full">
              {employees.length > 0 && (
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead
                      className="text-[#1F2328] cursor-pointer w-[15%]"
                      onClick={() => handleSortChange("employee_id")}
                    >
                      Employee ID{" "}
                      {sortOn === "employee_id" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-[#1F2328] cursor-pointer w-[20%]"
                      onClick={() => handleSortChange("name")}
                    >
                      Name {sortOn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-[#1F2328] w-[20%]">Birthday</TableHead>
                    <TableHead className="text-[#1F2328] w-[15%]">Annual</TableHead>
                    <TableHead className="text-[#1F2328] w-[15%]">Sick</TableHead>
                    <TableHead className="text-[#1F2328] w-[15%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.employee_id}>
                      <TableCell className="text-[#1F2328] whitespace-nowrap w-[15%]">
                        {employee.employee_id}
                      </TableCell>
                      <TableCell className="text-[#1F2328] whitespace-nowrap w-[20%]">
                        {employee.name}
                      </TableCell>
                      <TableCell className="text-[#1F2328] whitespace-nowrap w-[20%]">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                          {employee.birthday ? formatBirthday(employee.birthday) : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#1F2328] font-semibold text-sm whitespace-nowrap w-[15%]">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                          {employee.annual_leave_balance !== null ? employee.annual_leave_balance : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#1F2328] font-semibold text-sm whitespace-nowrap w-[15%]">
                        <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                          {employee.sick_leave_balance !== null ? employee.sick_leave_balance : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#1F2328] font-medium whitespace-nowrap w-[15%]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-gray-600 hover:bg-gray-50 rounded-md p-1.5 transition-colors"
                              title="Actions"
                            >
                              <FaEllipsisV size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditClick(employee)}>
                              <FaEdit className="mr-2" size={12} />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleResignClick(employee)}
                              className="text-red-600"
                            >
                              <FaSignOutAlt className="mr-2" size={12} />
                              Resignation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-[#1F2328]">
                      No employees available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center p-4">
              <Button
                className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-[#1F2328]">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={isResignModalOpen} onOpenChange={(open) => {
        setIsResignModalOpen(open);
        if (!open) {
          setSelectedEmployee(null);
          setResignationDate("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Resignation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="resignationDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resignation Date
            </label>
            <Input
              id="resignationDate"
              type="date"
              value={resignationDate}
              onChange={(e) => setResignationDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316] w-full"
              aria-label="Resignation date"
              required
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsResignModalOpen(false)}
              className="bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedEmployee && handleResignSubmit(selectedEmployee.id, resignationDate)}
              className="bg-[#F97316] text-white hover:bg-[#e06615]"
              disabled={!resignationDate}
            >
              Confirm Resignation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
