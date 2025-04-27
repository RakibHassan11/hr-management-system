import { useState, useEffect } from "react"
import ima from "../lovable-uploads/pet.jpg"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import moment from "moment-timezone"
import axios from "axios"

interface LeaveBalance {
  type: string
  current: string
  startOfYear: string
}

interface AttendanceRecord {
  date: string
  in: string
  out: string
  duration?: string
}

interface ApiAttendanceRecord {
  id: number
  employee_id: number
  check_in_time: string | null
  check_out_time: string | null
  total_punch: string
  created_at: string
}

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user)
  const { userToken } = useSelector((state: RootState) => state.auth)
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const API_BASE_URL = import.meta.env.VITE_API_URL

  const today = new Date().toISOString().split("T")[0]

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 4)
  const startDateDefault = sevenDaysAgo.toISOString().split("T")[0]

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      const storedToken = localStorage.getItem("token_user") || userToken
      if (!storedToken) {
        return
      }
    
      try {
        const url = `${API_BASE_URL}/employee/leave-balance`
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        })
    
        const result = response.data
        if (
          result.success &&
          result.message === "Leave balance fetched successfully" &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const apiData = result.data[0]
          const leaveBalances: LeaveBalance[] = [
            {
              type: "Annual",
              current: apiData.annual_leave_balance?.toString() || "0",
              startOfYear: apiData.beginning_of_year_balance?.toString() || "0"
            },
            {
              type: "Sick",
              current: apiData.sick_leave_balance?.toString() || "0",
              startOfYear: "0"
            }
          ]
          setLeaveBalances(leaveBalances)
        } else {
          setLeaveBalances([
            { type: "Annual", current: "0", startOfYear: "0" },
            { type: "Sick", current: "0", startOfYear: "0" }
          ])
        }
      } catch (error) {
        console.error("Leave balance fetch error:", error)
        setLeaveBalances([
          { type: "Annual", current: "0", startOfYear: "0" },
          { type: "Sick", current: "0", startOfYear: "0" }
        ])
      }
    }

    const fetchAttendanceRecords = async () => {
      const storedToken = localStorage.getItem("token_user") || userToken
      if (!storedToken) {
        return
      }

      try {
        let url = `${API_BASE_URL}/employee-attendance/attendance-list`

        if (startDateDefault && today) {
          url += `?startdate=${startDateDefault}&enddate=${today}`
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
            filterType: "MONTHLY"
          }
        })

        const result = response.data
        if (result.success && Array.isArray(result.data)) {
          const apiData: ApiAttendanceRecord[] = result.data
          const processedRecords: AttendanceRecord[] = apiData.map(record => {
            // Use check_in_time for date, fall back to created_at if null
            const dateMoment = record.check_in_time
              ? moment.tz(record.check_in_time, "UTC").tz("Asia/Dhaka")
              : moment.tz(record.created_at, "UTC").tz("Asia/Dhaka")
            
            // Convert check_in_time and check_out_time to Asia/Dhaka
            const inMoment = record.check_in_time
              ? moment.tz(record.check_in_time, "UTC").tz("Asia/Dhaka")
              : null
            const outMoment = record.check_out_time
              ? moment.tz(record.check_out_time, "UTC").tz("Asia/Dhaka")
              : null

            const dateStr = dateMoment.isValid()
              ? dateMoment.format("ddd DD")
              : "--:--"
            const inTime = inMoment && inMoment.isValid()
              ? inMoment.format("HH:mm")
              : "--:--"
            const outTime = outMoment && outMoment.isValid()
              ? outMoment.format("HH:mm")
              : "--:--"

            return { date: dateStr, in: inTime, out: outTime }
          })
          setAttendanceRecords(processedRecords)
        } else {
          setAttendanceRecords([{ date: "--:--", in: "--:--", out: "--:--" }])
        }
      } catch (error) {
        console.error("Attendance records fetch error:", error)
        setAttendanceRecords([{ date: "--:--", in: "--:--", out: "--:--" }])
      }
    }

    fetchLeaveBalances()
    fetchAttendanceRecords()
  }, [userToken, API_BASE_URL, startDateDefault, today])

  const calculateDuration = (inTime: string, outTime: string) => {
    if (inTime === "--:--" || outTime === "--:--") return "--:--"
    const inMoment = moment(inTime, "HH:mm")
    const outMoment = moment(outTime, "HH:mm")
    if (
      !inMoment.isValid() ||
      !outMoment.isValid() ||
      outMoment.isBefore(inMoment)
    ) {
      return "--:--"
    }
    const duration = moment.duration(outMoment.diff(inMoment))
    const hours = Math.floor(duration.asHours()).toString().padStart(2, "0")
    const minutes = duration.minutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 p-2 md:p-2">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-violet-400 to-cyan-100 h-24"></div>
            <div className="p-6 pt-0 -mt-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                    <img
                      src={ima}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-center sm:text-left mt-3">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {user?.name || "Unknown"}
                  </h2>
                  <p className="text-lg text-slate-600 font-medium">
                    {user?.designation || "N/A"}
                  </p>
                  <p className="text-slate-500">{user?.department || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Balance Card */}
          <div className="p-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Leave Balance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-600">
                      Leave Type
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-slate-600">
                      Current Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances?.length > 0 ? (
                    leaveBalances.map((leave, index) => (
                      <tr
                        key={leave.type || `leave-${index}`}
                        className={`${
                          index % 2 === 0 ? "bg-slate-50" : "bg-white"
                        } hover:bg-sky-50 transition-colors`}
                      >
                        <td className="py-3 px-4 text-sm text-slate-700 font-medium">
                          {leave.type || "Not Specified"}
                        </td>
                        <td className="py-3 px-4 text-center text-sm font-semibold">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {leave.current || "0"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        Not Specified
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-slate-700">
                        0
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="p-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Attendance Records
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600">
                    Date
                  </th>
                  {attendanceRecords?.map((record, index) => (
                    <th
                      key={record.date || `default-date-${index}`}
                      className="py-3 px-4 text-center text-sm font-medium text-slate-600"
                    >
                      {record.date !== "--:--" ? (
                        <span className="whitespace-nowrap">{record.date}</span>
                      ) : (
                        "--:--"
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Check-in
                  </td>
                  {attendanceRecords?.map((record, index) => (
                    <td
                      key={`${record.date}-in-${index}`}
                      className="py-3 px-4 text-center text-sm font-medium text-slate-700"
                    >
                      {record.in || "--:--"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-4 text-sm font-medium text-slate-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Check-out
                  </td>
                  {attendanceRecords?.map((record, index) => (
                    <td
                      key={`${record.date}-out-${index}`}
                      className="py-3 px-4 text-center text-sm font-medium text-slate-700"
                    >
                      {record.out || "--:--"}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Duration
                  </td>
                  {attendanceRecords?.map((record, index) => (
                    <td
                      key={`${record.date}-duration-${index}`}
                      className="py-3 px-4 text-center text-sm font-semibold text-slate-700"
                    >
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                        {calculateDuration(record.in, record.out)}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}