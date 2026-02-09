
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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDailyAttendance } from "@/features/attendance/hooks/useDailyAttendance";

export default function DailyAttendance() {
  const { records, summary, loading, error, fetchDailyAttendance } = useDailyAttendance();

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

  useEffect(() => {
    fetchDailyAttendance(selectedDate, comment);
  }, [fetchDailyAttendance, selectedDate, comment]);

  const handleExport = async () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Employee ID,Name,Check In,Check Out,Comment\n"
      + records.map(e => `${e.employee_id},${e.name},${e.check_in_time},${e.check_out_time},${e.comment}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <span className="px-2 py-1 rounded-2xl bg-green-50"><p className="text-green-800 text-center font-semibold">Present: {summary.present}</p>
              </span>
              <span className="px-2 py-1 rounded-2xl bg-red-50"> <p className="text-red-800 text-center font-semibold">Absent: {summary.absent}</p></span>
            </div>
            {records.length === 0 ? (
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
                  {records.map((employee, index) => (
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
                          className={`px-2 py-1 rounded-xl ${getValueStyles("comment", employee.comment).textClass} ${getValueStyles("comment", employee.comment).bgClass
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