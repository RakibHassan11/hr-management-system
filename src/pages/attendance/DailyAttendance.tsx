
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/axiosConfig";
import { Input } from "@/components/ui/input";

interface Employee {
  id: number;
  employee_id: number;
  name: string;
  check_in_time: string | null;
  check_out_time: string | null;
  created_at: string;
  comment: string;
}

export default function DailyAttendance() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [query, setQuery] = useState("");
  const [comment, setComment] = useState("All");
  const [exportType, setExportType] = useState("CSV");

  // Function to determine text and background classes for values
  const getValueStyles = (key: string, value?: string | number | boolean) => {
    if (key.toLowerCase() === "comment" && typeof value === "string") {
      switch (value.toLowerCase()) {
        case "present":
        case "holiday":
          return { textClass: "text-green-800", bgClass: "bg-green-100" };
        case "sick leave":
        case "annual leave":
          return { textClass: "text-blue-700", bgClass: "bg-blue-50" };
        case "weekend":
          return { textClass: "text-blue-700", bgClass: "bg-blue-50" };
        case "absent":
          return { textClass: "text-red-800", bgClass: "bg-red-100" };
        case "half day":
        case "late in":
        case "early out":
          return { textClass: "text-orange-800", bgClass: "bg-orange-100" };
        default:
          return { textClass: "", bgClass: "" };
      }
    }
    return { textClass: "", bgClass: "" };
  };

  const fetchEmployees = useCallback(
    async (commentFilter = comment) => {
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      let url = `${API_URL}/employee-attendance/employee-status-list?date=${selectedDate}`;

      if (commentFilter !== "All") url += `&comment=${encodeURIComponent(commentFilter)}`;

      try {
        setLoading(true);
        const response = await api({
          method: "GET",
          url: url,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        setApiResponse(data);

        if (Array.isArray(data.data)) {
          const formattedData = data.data.map((emp) => ({
            id: emp.employee_id,
            employee_id: emp.employee_id,
            name: emp.name,
            check_in_time: emp.CheckInTime || null,
            check_out_time: emp.CheckOutTime || null,
            created_at: selectedDate,
            comment: emp.comment,
          }));
          setEmployees(formattedData);
          setError(null);
        } else {
          setEmployees([]);
          setError("No attendance data available");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch employee data");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    },
    [API_URL, comment, token, selectedDate]
  );

  const handleExport = async () => {
    const type = exportType;
    try {
      const response = await api.get(
        `${API_URL}/employee-attendance/export-status-list?date=${selectedDate}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${selectedDate}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.message || "Failed to export attendance data");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const SkeletonLoader = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-[#1F2328] text-center font-semibold">Employee ID</TableHead>
            <TableHead className="text-[#1F2328] text-center font-semibold">Employee Name</TableHead>
            <TableHead className="text-[#1F2328] text-center font-semibold">Check In</TableHead>
            <TableHead className="text-[#1F2328] text-center font-semibold">Check Out</TableHead>
            <TableHead className="text-[#1F2328] text-center font-semibold">Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
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
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Daily Attendance</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316] w-36"
            />
            <div className="flex gap-3">
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
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
                  setQuery("");
                  setComment("All");
                  setExportType("CSV");
                  setSelectedDate(today);
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
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Daily Attendance</h1>
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316] w-36"
          />
          <div className="flex gap-3">
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
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
                setQuery("");
                setComment("All");
                setExportType("CSV");
                setSelectedDate(today);
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
            <div className="mb-6 flex justify-start gap-5 items-center">
            <span className="px-2 py-1 rounded-2xl bg-green-50"><p className="text-green-800 text-center font-semibold">Present: {apiResponse?.summary?.present || 0}</p>
            </span>
             <span className="px-2 py-1 rounded-2xl bg-red-50"> <p className="text-red-800 text-center font-semibold">Absent: {apiResponse?.summary?.absent || 0}</p></span>
            </div>
            {employees.length === 0 ? (
              <p className="text-center text-gray-600">
                No attendance data available for the selected date.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-[#1F2328] text-center font-semibold">Employee ID</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold">Employee Name</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold">Check In</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold">Check Out</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold">Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center font-semibold text-gray-700">
                        <span className="px-2 py-1 rounded-xl">
                          {employee.employee_id}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-700">
                        <span className="px-2 py-1 rounded-xl">
                          {employee.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className="px-2 py-1 rounded-xl">
                          {employee.check_in_time || "--:--"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span className="px-2 py-1 rounded-xl">
                          {employee.check_out_time || "--:--"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700">
                        <span
                          className={`px-2 py-1 rounded-xl ${getValueStyles("comment", employee.comment).textClass} ${
                            getValueStyles("comment", employee.comment).bgClass
                          }`}
                        >
                          {employee.comment || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>
    </div>
  );
}