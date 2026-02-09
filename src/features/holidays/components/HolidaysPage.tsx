import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { formatDate } from "@/components/utils/dateHelper"
import { useHolidays } from "@/features/holidays/hooks/useHolidays"

// Helper function to get the day of the week from a date string
const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[date.getDay()]
}

export default function Holidays() {
  const { holidays, loading, error, fetchHolidays, createHoliday, deleteHoliday } = useHolidays()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 20
  const { permission_value } = useSelector(
    (state: RootState) => state.auth.user
  )

  useEffect(() => {
    fetchHolidays()
  }, [fetchHolidays])

  const handleDeleteHoliday = async (id: number) => {
    const success = await deleteHoliday(id)
    if (success) {
      toast.success("Holiday deleted successfully")
    } else {
      toast.error("Failed to delete holiday")
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    if (isModalOpen) {
      setTitle("")
      setStartDate("")
      setEndDate("")
    }
  }

  const handleCreateHoliday = async () => {
    if (!title || !startDate || !endDate) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSaving(true)
    const success = await createHoliday({ title, start_date: startDate, end_date: endDate })

    if (success) {
      toast.success("Holiday created successfully")
      toggleModal()
    } else {
      toast.error("Failed to create holiday")
    }
    setIsSaving(false)
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentHolidays = holidays.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(holidays.length / recordsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <>
      <div className="p-2 bg-white text-[#1F2328] min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Holidays</h1>

          {permission_value == 1 && (
            <button
              className="bg-[#F97316] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#EA580C]"
              onClick={toggleModal}
            >
              Add Holidays
            </button>
          )}
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border text-gray-700 font-semibold border-gray-200">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <TableHead className="w-1/6 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Title
                </TableHead>
                <TableHead className="w-1/6 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Day
                </TableHead>
                <TableHead className="w-1/6 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Start Date
                </TableHead>
                <TableHead className="w-1/6 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  End Date
                </TableHead>
                <TableHead className="w-1/6 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Total Days
                </TableHead>
                {permission_value == 1 && (
                  <TableHead className="w-1/6 py-4 px-6 text-left font-semibold text-[#1F2328]">
                    Action
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length > 0 ? (
                currentHolidays.map(holiday => (
                  <TableRow
                    key={holiday.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <TableCell className="w-1/6 py-3 px-6 text-gray-700 font-semibold truncate">
                      {holiday.title}
                    </TableCell>
                    <TableCell className=" text-blue-800">
                      <span className={`px-2 py-1  rounded-xl bg-blue-100`}>
                        {getDayOfWeek(holiday.start_date)}
                      </span>
                    </TableCell>
                    <TableCell className="w-1/6 py-3 px-6 text-gray-700 truncate">
                      {formatDate(holiday.start_date)}
                    </TableCell>
                    <TableCell className="w-1/6 py-3 px-6 text-gray-700 truncate">
                      {formatDate(holiday.end_date)}
                    </TableCell>
                    <TableCell className="w-1/6 py-3 px-6 text-[#1F2328] truncate text-sm font-semibold">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {holiday.total_days ?? "N/A"}
                      </span>
                    </TableCell>
                    {permission_value == 1 && (
                      <TableCell className="w-1/6 py-3 px-6 text-[#1F2328]">
                        <button
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Holiday"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : loading ? (
                <TableRow>
                  <TableCell
                    colSpan={permission_value == 1 ? 6 : 5}
                    className="py-6 px-6 text-center text-[#1F2328] font-medium"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={permission_value == 1 ? 6 : 5}
                    className="py-6 px-6 text-center text-[#1F2328] font-medium"
                  >
                    No holidays available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {holidays.length > 0 && !loading && (
            <div className="flex justify-between items-center p-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-[#1F2328]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Holiday</h2>
            <div className="mb-4">
              <label className="block font-medium text-[#1F2328]">
                Holiday Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter holiday title"
                disabled={isSaving}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-[#1F2328]">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                disabled={isSaving}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-[#1F2328]">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                disabled={isSaving}
              />
            </div>
            <div className="flex justify-end">
              {!isSaving && (
                <button
                  className="bg-[#F97316] text-white px-4 py-2 rounded-md mr-2"
                  onClick={toggleModal}
                >
                  Close
                </button>
              )}
              <button
                className={`bg-green-600 text-white px-4 py-2 rounded-md ${isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={handleCreateHoliday}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Holiday"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}