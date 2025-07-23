import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import api from '@/axiosConfig'
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

interface MonthlySummaryData {
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
    <div className={cn('w-full', className)} {...props}>
      {/* Static header */}
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed border-collapse">
          {header}
        </Table>
      </div>
      {/* Scrollable body */}
      <div className="overflow-auto" style={{ maxHeight: maxBodyHeight }}>
        <Table className="w-full table-fixed border-collapse">
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function MonthlySummary() {
  const [summaries, setSummaries] = useState<MonthlySummaryData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const [exportType, setExportType] = useState<'CSV' | 'EXCEL'>('CSV')
  const currentDate = new Date()
  const [month, setMonth] = useState(
    (currentDate.getMonth() + 1).toString().padStart(2, '0')
  )
  const [year, setYear] = useState(currentDate.getFullYear().toString())

  const handleExport = async () => {
    try {
      const response = await api.get(
        `${API_URL}/employee/monthly-report-export?month=${month}&year=${year}&type=${exportType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      )
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `monthly_summary_${year}_${month}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to export monthly summary data')
    }
  }

  const fetchSummaries = useCallback(async () => {
    if (!token) {
      setError('No authentication token available')
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get(
        `${API_URL}/employee/monthly-summary?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (Array.isArray(data)) {
        setSummaries(data)
        setError(null)
      } else {
        setSummaries([])
        setError('No monthly summary data available')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monthly summary data')
      setSummaries([])
    } finally {
      setLoading(false)
    }
  }, [API_URL, month, year, token])

  useEffect(() => {
    fetchSummaries()
  }, [fetchSummaries])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  const header = (
    <TableHeader className="bg-gray-50 sticky top-0 z-10">
      <TableRow>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">ID</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Name</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Total Days</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Present</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Holiday</TableHead>
        <TableHead colSpan={4} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Leave</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-700 border-gray-300 text-center py-2 px-2">Monthly Present</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-700 border-gray-300 text-center py-2 px-2">LWP</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-700 border-gray-300 text-center py-2 px-2">Absent</TableHead>
        <TableHead colSpan={3} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Deduction</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Total Deduction</TableHead>
        <TableHead rowSpan={2} className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Payable</TableHead>
      </TableRow>
      <TableRow>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">AL</TableHead>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Med L</TableHead>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">PL</TableHead>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">ML</TableHead>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Late/Early</TableHead>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-center py-2 px-2">Late Ded</TableHead>
        <TableHead className="border font-semibold text-gray-800 border-gray-300 text-left py-2 px-2">Join/Resign</TableHead>
      </TableRow>
    </TableHeader>
  )

  const rows = summaries.map((s, i) => (
    <TableRow key={i} className="border-b border-gray-200 text-grey ">
      <TableCell className="text-center py-2 px-2">{s.employee_id}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.name}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.calendar_days_in_month}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.present_days}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.weekly_govt_holidays}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.al}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.med_l}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.patnity}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.ml}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.monthly_present}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.lwp}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.absent}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.late_in_early_out}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.late_deduction_day}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.joining_resign_gap}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.total_deduction}</TableCell>
      <TableCell className="text-center py-2 px-2">{s.payable}</TableCell>
    </TableRow>
  ))

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Monthly Summary</h1>
      <div className="flex justify-end space-x-2 mb-4">
        <select
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={(i+1).toString().padStart(2,'0')}>
              {moment().month(i).format('MMMM')}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear()-3+i).map(y => (
            <option key={y} value={y.toString()}>{y}</option>
          ))}
        </select>
        <select
          value={exportType}
          onChange={e => setExportType(e.target.value as 'CSV'|'EXCEL')}
          className="border border-gray-300 rounded p-2"
        >
          <option>CSV</option>
          <option>EXCEL</option>
        </select>
        <button
          onClick={handleExport}
          className="bg-[#F97316] text-white px-4 py-2 rounded flex items-center"
        >
          <Download className="mr-2" /> Export {exportType}
        </button>
      </div>
      <StickyHeaderTable header={header} maxBodyHeight="calc(100vh - 200px)">
        {rows}
      </StickyHeaderTable>
    </div>
  )
}
