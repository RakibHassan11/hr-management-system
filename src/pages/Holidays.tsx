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
import axios from "axios"
import { API_BASE_URL } from "@/config/api"

interface Holiday {
  id: number
  title: string
  start_date: string
  end_date: string
  active: boolean
  total_days?: number
}

export default function Holidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10
  const { userToken } = useSelector((state: RootState) => state.auth)
  const { permission_value } = useSelector(
    (state: RootState) => state.auth.user
  )
  console.log(permission_value)

  useEffect(() => {
    const fetchHolidays = async () => {
      const storedToken = localStorage.getItem("token_user") || userToken
      if (!storedToken) {
        toast.error("No authentication token found. Please log in.")
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/Holiday/holiday-list`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json"
            }
          }
        )

        if (response.status === 200 && response.data.success) {
          const formattedHolidays: Holiday[] = response.data.data.map(
            (holiday: any) => ({
              id: holiday.id,
              title: holiday.title,
              start_date: holiday.start_date.split("T")[0],
              end_date: holiday.end_date.split("T")[0],
              active: holiday.status === "ACTIVE",
              total_days: holiday.total_days
            })
          )
          setHolidays(formattedHolidays)
        } else {
          toast.error(response.data.message || "Failed to fetch holidays")
        }
      } catch (error) {
        console.error("GET error:", error)
        toast.error("Network error: Could not fetch holidays")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHolidays()
  }, [userToken])

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    if (isModalOpen) {
      setTitle("")
      setStartDate("")
      setEndDate("")
    }
  }

  const handleCreateHoliday = async () => {
    const storedToken = localStorage.getItem("token_user") || userToken
    if (!storedToken) {
      toast.error("No authentication token found. Please log in.")
      return
    }

    if (!title || !startDate || !endDate) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSaving(true)
    const holidayData = { title, startday: startDate, endday: endDate }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Holiday/create-holiday`,
        holidayData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        }
      )
      console.log("POST response:", response.data)

      if (response.status === 201 && response.data.success) {
        toast.success("Holiday created successfully")
        setIsSaving(false)
        toggleModal()

        setIsLoading(true)
        const fetchResponse = await axios.get(
          `${API_BASE_URL}/Holiday/holiday-list`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json"
            }
          }
        )
        if (fetchResponse.status === 200 && fetchResponse.data.success) {
          const formattedHolidays: Holiday[] = fetchResponse.data.data.map(
            (holiday: any) => ({
              id: holiday.id,
              title: holiday.title,
              start_date: holiday.start_date.split("T")[0],
              end_date: holiday.end_date.split("T")[0],
              active: holiday.status === "ACTIVE",
              total_days: holiday.total_days
            })
          )
          setHolidays(formattedHolidays)
          setCurrentPage(1)
        }
        setIsLoading(false)
      } else {
        toast.error(
          response.data.message ||
            `Failed to create holiday (Status: ${response.status})`
        )
        setIsSaving(false)
      }
    } catch (error) {
      toast.error("Network error: Could not create holiday")
      setIsSaving(false)
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentHolidays = holidays.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(holidays.length / recordsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
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

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Title
                </TableHead>
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Start Date
                </TableHead>
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  End Date
                </TableHead>
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328]">
                  Total Days
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length > 0 ? (
                currentHolidays.map(holiday => (
                  <TableRow
                    key={holiday.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] font-medium truncate">
                      {holiday.title}
                    </TableCell>
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] truncate">
                      {holiday.start_date}
                    </TableCell>
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] truncate">
                      {holiday.end_date}
                    </TableCell>
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] truncate text-xs font-semibold">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {holiday.total_days ?? "N/A"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 px-6 text-center text-[#1F2328] font-medium"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 px-6 text-center text-[#1F2328] font-medium"
                  >
                    No holidays available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {holidays.length > 0 && !isLoading && (
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
                className={`bg-green-600 text-white px-4 py-2 rounded-md ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
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
