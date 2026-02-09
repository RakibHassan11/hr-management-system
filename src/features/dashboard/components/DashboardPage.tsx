import { useDashboard } from "@/features/dashboard/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ima from "../../../assets/pet.jpg";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { leaveBalances, attendanceRecords, statistics, loading } = useDashboard();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen p-2 md:p-2">
      <div className="max-w-7xl mx-auto space-y-8">
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
                  <h2 className="text-2xl font-bold text-slate-800">{user?.name || "Unknown"}</h2>
                  <p className="text-lg text-slate-600 font-medium">{user?.designation || "N/A"}</p>
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
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-600">Leave Type</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-slate-600">Current Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances?.length > 0 ? (
                    leaveBalances.map((leave, index) => (
                      <tr
                        key={leave.type || `leave-${index}`}
                        className={`${index % 2 === 0 ? "bg-slate-50" : "bg-white"} hover:bg-sky-50 transition-colors`}
                      >
                        <td className="py-3 px-4 text-sm text-slate-700 font-medium">{leave.type || "Not Specified"}</td>
                        <td className="py-3 px-4 text-center text-sm font-semibold">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{leave.current || "0"}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 px-4 text-sm text-slate-700">Not Specified</td>
                      <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Attendance Statistics Card */}
        <div className="p-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 mt-1">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center mb-1">
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
            Attendance Statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 px-4 w-[12.5%] text-left text-sm font-medium text-slate-600">Month</th>
                  <th className="py-3 px-4 w-[13.5%] text-center text-sm font-medium text-slate-600">Present</th>
                  <th className="py-3 px-4 w-[12.5%] text-center text-sm font-medium text-slate-600">Absent</th>
                  <th className="py-3 px-4 w-[16.75%] text-center text-sm font-medium text-slate-600">Late In/Early Out</th>
                  <th className="py-3 px-4 w-[12.5%] text-center text-sm font-medium text-slate-600">Half Day</th>
                  <th className="py-3 px-4 w-[13.5%] text-center text-sm font-medium text-slate-600">Annual</th>
                  <th className="py-3 px-4 w-[12.5%] text-center text-sm font-medium text-slate-600">Sick</th>
                  <th className="py-3 px-4 w-[12.5%] text-center text-sm font-medium text-slate-600">Holidays</th>
                </tr>
              </thead>
              <tbody>
                {statistics ? (
                  <tr
                    className="hover:bg-sky-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-700">{statistics.month}</td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{statistics.present}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded">{statistics.absent}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">{statistics.lateInEarlyOut}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{statistics.halfDay}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{statistics.annual}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{statistics.sick}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{statistics.holidays}</span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-3 px-4 text-sm text-slate-700">--</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">0</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Records Card */}
        <div className="p-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center mt-1">
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
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600">Date</th>
                  {attendanceRecords?.map((record, index) => (
                    <th
                      key={record.date || `default-date-${index}`}
                      className="py-3 px-4 text-center text-sm font-medium text-slate-600"
                    >
                      {record.date !== "--:--" ? <span className="whitespace-nowrap">{record.date}</span> : "--:--"}
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
                        {record.duration || "--:--"}
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
  );
}