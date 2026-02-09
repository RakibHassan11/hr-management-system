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
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import { Employee as EmployeeType } from "@/features/employee/types";

// Custom debounce hook
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default function Employee() {
  const { employees, loading, error, pagination, fetchEmployees, resignEmployee } = useEmployee();
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [resignationDate, setResignationDate] = useState("");
  const navigate = useNavigate();

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortOn, setSortOn] = useState("employee_id");
  const [birthMonth, setBirthMonth] = useState("all");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Status options for the status filter
  const statusOptions = [
    { label: "All Statuses", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  // Format birthday to DD MMM, YYYY
  const formatBirthday = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const loadEmployees = (
    query = searchQuery,
    month = birthMonth,
    status = statusFilter,
    page = pagination.currentPage,
    sortField = sortOn,
    sortDir = sortDirection
  ) => {
    fetchEmployees({
      query,
      birthMonth: month,
      status: status === "ALL" ? undefined : status, // API expects undefined or specific status if not ALL for mock? or logic handling inside api
      page,
      sortOn: sortField,
      sortDirection: sortDir,
    });
  };

  // Initial load
  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useDebounce((query: string, month: string, status: string) => {
    loadEmployees(query, month, status, 1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSearchQuery(newName);
    debouncedSearch(newName, birthMonth, statusFilter);
  };

  const handleBirthMonthChange = (value: string) => {
    setBirthMonth(value);
    loadEmployees(searchQuery, value, statusFilter, 1);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === "ALL" ? "ALL" : value;
    setStatusFilter(newStatus);
    loadEmployees(searchQuery, birthMonth, newStatus, 1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadEmployees(searchQuery, birthMonth, statusFilter, page);
    }
  };

  const handleSortChange = (field: string) => {
    const newSortDirection = sortOn === field && sortDirection === "asc" ? "desc" : "asc";
    setSortOn(field);
    setSortDirection(newSortDirection);
    loadEmployees(searchQuery, birthMonth, statusFilter, pagination.currentPage, field, newSortDirection);
  };

  const handleEditClick = (employee: EmployeeType) => {
    navigate(`/user/employee/profile?id=${employee.id}`);
  };

  const handleResignClick = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setResignationDate(today);
    setIsResignModalOpen(true);
  };

  const handleResignSubmit = async (employeeId: number, resignationDate: string) => {
    if (!employeeId || !resignationDate) {
      toast.error("Employee ID and resignation date are required");
      return;
    }

    const success = await resignEmployee(employeeId, resignationDate);
    if (success) {
      toast.success("Employee resignation processed successfully");
      setIsResignModalOpen(false);
      setSelectedEmployee(null);
      setResignationDate("");
      loadEmployees(); // Refresh list
    } else {
      toast.error("Failed to process resignation");
    }
  };


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
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loadEmployees(searchQuery, birthMonth, statusFilter, 1);
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
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm">Select status:</label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] p-2 border border-gray-300 rounded-md bg-white text-[#1F2328] focus:outline-none focus:ring-2 focus:ring-[#F97316]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-md">
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
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
                          {formatBirthday(employee.birthday)}
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
                            {statusFilter !== "INACTIVE" && (
                              <DropdownMenuItem
                                onClick={() => handleResignClick(employee)}
                                className="text-red-600"
                              >
                                <FaSignOutAlt className="mr-2" size={12} />
                                Resignation
                              </DropdownMenuItem>
                            )}
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
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-[#1F2328]">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
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