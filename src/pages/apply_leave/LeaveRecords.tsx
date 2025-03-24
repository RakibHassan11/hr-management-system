import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { formatDate, formatText } from "@/components/utils/dateHelper"

export default function LeaveRecords() {
  const [records, setRecords] = useState(null)
  const [error, setError] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)

  const fetchRecords = () => {
    const url = `${API_URL}/employee/leave-record-list`
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
        setRecords(data.data)
      })
      .catch(error => {
        setRecords([])
        setError(error.message)
      })
  }

  useEffect(() => {
    fetchRecords()
  }, [API_URL, token])

  if (error) <p className="text-center text-red-500">{error}</p>

  return (
    <Fragment>
      {records !== null ? (
        <div className="p-6 bg-white text-[#1F2328] min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Leave Records List</h1>

          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-[#1F2328]">Name</TableHead>
                  <TableHead className="text-[#1F2328]">Days</TableHead>
                  <TableHead className="text-[#1F2328]">Type</TableHead>
                  <TableHead className="text-[#1F2328]">Start Date</TableHead>
                  <TableHead className="text-[#1F2328]">End Date</TableHead>
                  <TableHead className="text-[#1F2328]">Status</TableHead>
                  <TableHead className="text-[#1F2328]">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map(record => (
                  <TableRow key={record.id}>
                    <TableCell className="text-[#1F2328]">
                      {record.name}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {record.days}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {formatText(record.type)}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {formatDate(record.start_date)}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {formatDate(record.end_date)}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          record.status === "APPROVED_BY_LINE_MANAGER" ||
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
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading leave records...</p>
      )}
    </Fragment>
  )
}
