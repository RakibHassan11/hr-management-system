import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { useEffect, useState, useCallback } from "react"
  import { useSelector } from "react-redux"
  import { RootState } from "@/store"
  import api from "@/axiosConfig"
  import moment from "moment-timezone"
  import { Download } from "lucide-react";
  interface MonthlySummary {
    employee_id: number
    name: string
    calendar_days_in_month: number
    total_days_in_month: number
    present_days: number
    weekly_govt_holidays: number
    al: number
    med_l: number
    ml: number
    patnity: number
    lwp: number
    monthly_present: number
    absent: number
    late_in_early_out: number
    late_deduction_day: number
    joining_resign_gap: number
    total_deduction: number
    payable: number
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
  
  export default function MonthlySummary() {
    const [summaries, setSummaries] = useState<MonthlySummary[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.auth.userToken)
  
    const [exportType, setExportType] = useState("CSV")
  
    const currentDate = new Date()
    const [month, setMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, "0"))
    const [year, setYear] = useState(currentDate.getFullYear().toString())



    const handleExport = async () => {
      try {
        const response = await api.get(
          `${API_URL}/employee/monthly-report-export?month=${month}&year=${year}&type=${exportType}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Important to download as file
          }
        );
    
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `monthly_summary_${year}_${month}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        setError(error.message || "Failed to export monthly summary data");
      }
    };
    
  
    const fetchSummaries = useCallback(
      async (
        selectedMonth = month,
        selectedYear = year
      ) => {
        if (!token) {
          setError("No authentication token available")
          setLoading(false)
          return
        }
  
        const url = `${API_URL}/employee/monthly-summary?month=${selectedMonth}&year=${selectedYear}`

        try {
          setLoading(true)
          const response = await api({
            method: "GET",
            url: url,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
  
          const data = response.data
          if (Array.isArray(data)) {
            setSummaries(data)
            setError(null)
          } else {
            setSummaries([])
            setError("No monthly summary data available")
          }
        } catch (error) {
          setError(error.message || "Failed to fetch monthly summary data")
          setSummaries([])
        } finally {
          setLoading(false)
        }
      },
      [API_URL, month, year, token]
    )
  
    useEffect(() => {
      fetchSummaries()
    }, [fetchSummaries])
  
    const SkeletonLoader = () => {
      return (
        <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  {/* Group Titles Row */}
                  <TableRow>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>ID</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Name</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Total Days</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Present Day</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Govt Holiday</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" colSpan={4}>Leave</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Monthly Present</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>LWP</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Absent</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" colSpan={3}>Deduction</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Total Deduction</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Payable</TableHead>
                  </TableRow>

                  {/* Subgroup Column Headers */}
                  <TableRow>
                    {/* Leave sub-columns */}
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">AL</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Med L</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">PL</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">ML</TableHead>

                    {/* Deduction sub-columns */}
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Late/Early</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Late Deduction</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Joining/Resign</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-200">
                  {summaries.map((summary, index) => (
                    <TableRow
                    key={index}
                    className={`hover:bg-gray-50 transition-colors ${
                      index === 0 ? "border-b-0" : ""
                    }`}
                  >
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.employee_id}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.name}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.calendar_days_in_month}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.present_days}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.weekly_govt_holidays}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.al}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.med_l}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.ml}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.patnity}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.lwp}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.monthly_present}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.absent}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.late_in_early_out}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.late_deduction_day}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.joining_resign_gap}
                        </TableCell> 
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.total_deduction}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.payable}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
      )
    }
  
    if (loading) {
      return (
        <div className="p-1 bg-white text-[#1F2328] h-screen">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Monthly Summary</h1>
            <div className="flex gap-2 items-center">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                  {moment().month(i).format("MMMM")}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 3 + i).map((yearOption) => (
                <option key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </option>
              ))}
            </select>

            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              <option value="CSV">CSV</option>
              <option value="EXCEL">Excel</option>
            </select>

            <button
              onClick={handleExport}
              className="bg-[#F97316] text-white hover:bg-[#e06615] px-3 py-2 rounded-md flex items-center"
            >
              <Download size={18} className="text-white mr-1" />
              Export
            </button>
          </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-300">
            <SkeletonLoader />
          </div>
        </div>
      )
    }
  
    if (error) {
      return <p className="text-center text-red-500">{error}</p>
    }
  
    return (
      <div className="p-1 bg-white text-[#1F2328] h-screen">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
          <h1 className="text-2xl font-bold text-gray-800">Monthly Summary</h1>
          <div className="flex gap-2 items-center">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                  {moment().month(i).format("MMMM")}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 3 + i).map((yearOption) => (
                <option key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </option>
              ))}
            </select>

            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-[#1F2328] focus:border-[#F97316]"
            >
              <option value="CSV">CSV</option>
              <option value="EXCEL">Excel</option>
            </select>

            <button
              onClick={handleExport}
              className="bg-[#F97316] text-white hover:bg-[#e06615] px-3 py-2 rounded-md flex items-center"
            >
              <Download size={18} className="text-white mr-1" />
              Export
            </button>
          </div>

        </div>
  
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-300">
          {!loading && !error && (
            <>
              {summaries.length === 0 ? (
                <p className="text-center text-gray-600">
                  No monthly summary data available for the selected period.
                </p>
              ) : (
                <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  {/* Group Titles Row */}
                  <TableRow>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border  border-gray-300" rowSpan={2}>ID</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Name</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Total Days</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Present Day</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Govt Holiday</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" colSpan={4}>Leave</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Monthly Present</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>LWP</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Absent</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" colSpan={3}>Deduction</TableHead>

                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Total Deduction</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300" rowSpan={2}>Payable</TableHead>
                  </TableRow>

                  {/* Subgroup Column Headers */}
                  <TableRow>
                    {/* Leave sub-columns */}
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">AL</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Med L</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">PL</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">ML</TableHead>

                    {/* Deduction sub-columns */}
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Late/Early</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Late Deduction</TableHead>
                    <TableHead className="text-[#1F2328] text-center font-semibold py-2 px-2 border border-gray-300">Joining/Resign</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-200">
                  {summaries.map((summary, index) => (
                    <TableRow
                    key={index}
                    className={`hover:bg-gray-50 transition-colors ${
                      index === 0 ? "border-0" : ""
                    }`}
                  >
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.employee_id}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.name}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.calendar_days_in_month}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.present_days}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.weekly_govt_holidays}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.al}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.med_l}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.ml}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.patnity}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.lwp}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.monthly_present}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.absent}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.late_in_early_out}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.late_deduction_day}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.joining_resign_gap}
                        </TableCell> 
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.total_deduction}
                        </TableCell>
                        <TableCell className="text-[#1F2328] text-center py-3 px-2">
                          {summary.payable}
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
    )
  }