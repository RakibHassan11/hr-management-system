import { useState, useEffect } from 'react';
import ima from '../lovable-uploads/pet.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import moment from 'moment-timezone';

interface LeaveBalance {
  type: string;
  current: string;
  joining: string;
}

interface AttendanceRecord {
  date: string; // e.g., "Tue 28"
  in: string; // e.g., "03:07"
  out: string; // e.g., "later time or -"
  duration?: string;
}

interface ApiAttendanceRecord {
  id: number;
  employee_id: number;
  date: string; // ISO format: "2025-03-28T03:07:11.000Z"
  time: string; // "03:07:11"
}

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { userToken } = useSelector((state: RootState) => state.auth);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.allinall.social';

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) return;

      try {
        const mockData: LeaveBalance[] = [
          { type: 'Annual', current: '0.00', joining: '0.00' },
          { type: 'Sick', current: '0.00', joining: '0.00' },
          { type: 'Emergency', current: '0.00', joining: '0.00' },
        ];
        setLeaveBalances(mockData);
      } catch (error) {
        console.log('Leave balance fetch error:', error);
      }
    };

    const fetchAttendanceRecords = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) {
        console.log('No authentication token available');
        return;
      }

      try {
        console.log('API_BASE_URL:', API_BASE_URL); // Debug the base URL
        const url = `${API_BASE_URL}/employee-attendance/attendance-list`; // Adjusted path
        console.log('Fetching attendance from:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
            'filterType': 'MONTHLY',
          },
        });

        const result = await response.json();
        if (response.ok && result.success && result.message === 'Employee attendance records retrieved successfully') {
          const apiData: ApiAttendanceRecord[] = result.data;

          // Group by date and extract in/out times
          const groupedByDate: { [key: string]: ApiAttendanceRecord[] } = apiData.reduce((acc, record) => {
            const dateStr = moment(record.date).format('YYYY-MM-DD');
            acc[dateStr] = acc[dateStr] || [];
            acc[dateStr].push(record);
            return acc;
          }, {});

          const processedRecords: AttendanceRecord[] = Object.entries(groupedByDate).map(([date, records]) => {
            const sortedRecords = records.sort((a, b) => a.time.localeCompare(b.time));
            const inTime = sortedRecords[0]?.time.slice(0, 5) || '-'; // Earliest time
            const outTime = sortedRecords.length > 1 ? sortedRecords[sortedRecords.length - 1].time.slice(0, 5) : '-'; // Latest time
            const dayName = moment(date).format('ddd DD');
            return { date: dayName, in: inTime, out: outTime };
          });

          setAttendanceRecords(processedRecords);
        } else {
          console.log('Failed to fetch attendance:', result.message || 'Unknown error', result);
        }
      } catch (error) {
        console.log('Attendance fetch error:', error);
      }
    };

    fetchLeaveBalances();
    fetchAttendanceRecords();
  }, [userToken, API_BASE_URL]);

  const calculateDuration = (inTime: string, outTime: string, date: string) => {
    if (inTime === '-' || outTime === '-') return '-';

    const baseDate = moment(date, 'ddd DD').isValid() ? moment().month('March').date(parseInt(date.split(' ')[1])).format('YYYY-MM-DD') : '2025-03-01';
    const inMoment = moment(`${baseDate} ${inTime}`, 'YYYY-MM-DD HH:mm');
    const outMoment = moment(`${baseDate} ${outTime}`, 'YYYY-MM-DD HH:mm');

    if (!inMoment.isValid() || !outMoment.isValid()) return '-';

    const duration = moment.duration(outMoment.diff(inMoment));
    const hours = Math.floor(duration.asHours()).toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="animate-fadeIn p-6 flex flex-col gap-6">
      <div className="flex gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328] flex-1">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={ima}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-orange-500"
            />
            <div>
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <p className="text-lg text-gray-700">{user?.designation}</p>
              <p className="text-gray-600">{user?.department}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328] flex-1">
          <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border border-gray-300">Leave Type</th>
                <th className="py-2 px-4 border border-gray-300">Current</th>
                <th className="py-2 px-4 border border-gray-300">Beginning of Year/Joining</th>
              </tr>
            </thead>
            <tbody>
              {leaveBalances.map((leave) => (
                <tr key={leave.type} className="text-center">
                  <td className="py-2 px-4 border border-gray-300">{leave.type}</td>
                  <td className="py-2 px-4 border border-gray-300">{leave.current}</td>
                  <td className="py-2 px-4 border border-gray-300">{leave.joining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
        <h2 className="text-xl font-semibold mb-4">Attendances</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border border-gray-300"></th>
              {attendanceRecords.map((record) => (
                <th key={record.date} className="py-2 px-4 border border-gray-300">{record.date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="py-2 px-4 font-medium border border-gray-300">In:</td>
              {attendanceRecords.map((record) => (
                <td key={`${record.date}-in`} className="py-2 px-4 border border-gray-300">
                  {record.in}
                </td>
              ))}
            </tr>
            <tr className="text-center">
              <td className="py-2 px-4 font-medium border border-gray-300">Out:</td>
              {attendanceRecords.map((record) => (
                <td key={`${record.date}-out`} className="py-2 px-4 border border-gray-300">
                  {record.out}
                </td>
              ))}
            </tr>
            <tr className="text-center">
              <td className="py-2 px-4 font-medium border border-gray-300">Duration:</td>
              {attendanceRecords.map((record) => (
                <td key={`${record.date}-duration`} className="py-2 px-4 border border-gray-300">
                  {calculateDuration(record.in, record.out, record.date)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}