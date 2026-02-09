import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useEffect } from "react"
import {
  formatTime,
  formatDate,
  formatText
} from "@/components/utils/dateHelper"
import { useTimeUpdate } from "@/features/attendance/hooks/useTimeUpdate"

export default function TimeUpdatesList() {
  const { requests: records, loading: isLoading, error, fetchRequests } = useTimeUpdate();

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Loading time updates...</p>
      </div>
    )
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )
    }

    if (records.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-600">No time update records available</p>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-[#1F2328]">Employee Name</TableHead>
            <TableHead className="text-[#1F2328]">Date</TableHead>
            <TableHead className="text-[#1F2328]">Time</TableHead>
            <TableHead className="text-[#1F2328]">Type</TableHead>
            <TableHead className="text-[#1F2328]">Status</TableHead>
            <TableHead className="text-[#1F2328]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map(record => (
            <TableRow key={record.id}>
              <TableCell className="text-[#1F2328]">
                {record.employee_name || "Me"}
              </TableCell>
              <TableCell className="text-[#1F2328]">
                {formatDate(record.date)}
              </TableCell>
              <TableCell className="text-[#1F2328]">
                {formatTime(record.time)}
              </TableCell>
              <TableCell className="text-[#1F2328] font-semibold text-xs">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-xs">
                  {formatText(record.type)}
                </span>
              </TableCell>
              <TableCell className="text-[#1F2328]">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${record.status === "APPROVED_BY_LINE_MANAGER" ||
                      record.status === "APPROVED_BY_HR"
                      ? "bg-green-100 text-green-800"
                      : record.status === "REJECTED_BY_LINE_MANAGER" ||
                        record.status === "REJECTED_BY_HR"
                        ? "bg-red-100 text-red-800"
                        : record.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {formatText(record.status)}
                </span>
              </TableCell>
              <TableCell className="text-[#1F2328]">
                {record.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Time Update Records</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {renderContent()}
      </div>
    </div>
  )
}
