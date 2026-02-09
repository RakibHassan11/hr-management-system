import * as React from 'react'
import { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMonthlySummary } from '@/features/attendance/hooks/useMonthlySummary'
import { MonthlySummaryData } from '@/features/attendance/types'

interface StickyHeaderTableProps extends React.HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode
  children: React.ReactNode
  maxBodyHeight?: string
}

/**
 * Table with a static header and scrollable body
 */
export function StickyHeaderTable({
  header,
  children,
  maxBodyHeight = 'calc(100vh - 200px)',
  className,
  ...props
}: StickyHeaderTableProps) {
  return (
    <div className={cn('relative overflow-hidden border rounded-md', className)} {...props}>
      <div className="overflow-auto" style={{ maxHeight: maxBodyHeight }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
            {header}
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </div>
  )
}

const MonthlySummary = () => {
  const currentMonth = moment().format('MM')
  const currentYear = moment().format('YYYY')

  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  const { summaries, loading, error, fetchSummaries } = useMonthlySummary()

  // Generate Year Options
  const yearOptions = []
  for (let i = 2020; i <= 2030; i++) {
    yearOptions.push(i.toString())
  }

  // Generate Month Options
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  useEffect(() => {
    fetchSummaries(month, year)
  }, [fetchSummaries, month, year])


  const handleExport = async () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Employee ID,Name,Present,Absent\n"
      + summaries.map(e => `${e.employee_id},${e.name},${e.present_days},${e.absent}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `monthly_attendance_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-4 bg-white min-h-screen text-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Monthly Attendance Summary</h1>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Year Selector */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>Select Year</option>
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>

          {/* Month Selector */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>Select Month</option>
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={loading || summaries.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md border border-red-200">{error}</div>}

      <div className="bg-white rounded-lg shadow border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading attendance data...</div>
        ) : summaries.length > 0 ? (
          <StickyHeaderTable
            header={
              <TableRow className="bg-gray-50">
                <TableHead className="py-3 px-4 text-left font-semibold text-gray-700 w-[100px]">ID</TableHead>
                <TableHead className="py-3 px-4 text-left font-semibold text-gray-700 w-[200px]">Employee Name</TableHead>

                {/* Attendance & Leave Stats */}
                <TableHead className="py-3 px-2 text-center font-semibold text-gray-600" title="Calendar Days">Cal. Days</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-gray-600" title="Total Days">Total Days</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-green-700 bg-green-50">Present</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-gray-600" title="Weekly Holidays">W.H.</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-blue-600 bg-blue-50" title="Annual Leave">AL</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-blue-600 bg-blue-50" title="Medical Leave">Med.L</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-blue-600 bg-blue-50" title="Maternity Leave">ML</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-blue-600 bg-blue-50" title="Paternity Leave">Pat.L</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-yellow-600 bg-yellow-50" title="Leave Without Pay">LWP</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-gray-600">Total Present</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-red-600 bg-red-50">Absent</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-orange-600 bg-orange-50" title="Late In / Early Out">Late/Early</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-orange-600" title="Late Deduction">L. Ded.</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-gray-600" title="Joining/Resign Gap">Gap</TableHead>
                <TableHead className="py-3 px-2 text-center font-semibold text-red-600">Total Ded.</TableHead>
                <TableHead className="py-3 px-2 text-center font-bold text-gray-800 bg-gray-100">Payable</TableHead>
              </TableRow>
            }
          >
            {summaries.map((employee) => (
              <TableRow key={employee.employee_id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium text-gray-900">{employee.employee_id}</TableCell>
                <TableCell className="font-medium text-gray-800">{employee.name}</TableCell>

                <TableCell className="text-center text-gray-600">{employee.calendar_days_in_month}</TableCell>
                <TableCell className="text-center text-gray-600">{employee.total_days_in_month}</TableCell>
                <TableCell className="text-center font-semibold text-green-700 bg-green-50/50">{employee.present_days}</TableCell>
                <TableCell className="text-center text-gray-600">{employee.weekly_govt_holidays}</TableCell>
                <TableCell className="text-center text-blue-600 bg-blue-50/50">{employee.al}</TableCell>
                <TableCell className="text-center text-blue-600 bg-blue-50/50">{employee.med_l}</TableCell>
                <TableCell className="text-center text-blue-600 bg-blue-50/50">{employee.ml}</TableCell>
                <TableCell className="text-center text-blue-600 bg-blue-50/50">{employee.patnity}</TableCell>
                <TableCell className="text-center text-yellow-600 bg-yellow-50/50">{employee.lwp}</TableCell>
                <TableCell className="text-center font-medium text-gray-700">{employee.monthly_present}</TableCell>
                <TableCell className="text-center font-semibold text-red-600 bg-red-50/50">{employee.absent}</TableCell>
                <TableCell className="text-center text-orange-600 bg-orange-50/50">{employee.late_in_early_out}</TableCell>
                <TableCell className="text-center text-orange-600">{employee.late_deduction_day}</TableCell>
                <TableCell className="text-center text-gray-600">{employee.joining_resign_gap}</TableCell>
                <TableCell className="text-center font-medium text-red-600">{employee.total_deduction}</TableCell>
                <TableCell className="text-center font-bold text-gray-900 bg-gray-100/50">{employee.payable}</TableCell>
              </TableRow>
            ))}
          </StickyHeaderTable>
        ) : (
          <div className="p-8 text-center text-gray-500">No attendance records found for the selected month.</div>
        )}
      </div>
    </div>
  )
}

export default MonthlySummary
