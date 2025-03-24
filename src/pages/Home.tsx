import { useState, useEffect } from 'react';
import ima from '../lovable-uploads/pet.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import moment from 'moment-timezone';
import axios from 'axios';

interface LeaveBalance {
  type: string;
  current: string;
  startOfYear: string;
}

interface AttendanceRecord {
  date: string;
  in: string;
  out: string;
  duration?: string;
}

interface ApiAttendanceRecord {
  id: number;
  employee_id: number;
  check_in_time: string;
  check_out_time: string;
  total_punch: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { userToken } = useSelector((state: RootState) => state.auth);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) {
        console.log('No token available');
        return;
      }

      try {
        console.log('API_BASE_URL:', API_BASE_URL);
        const url = `${API_BASE_URL}/employee/leave-balance`;
        console.log('Fetching leave balances from:', url);
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = response.data;
        console.log('Leave balance response:', result);
        if (result.success && result.message === 'Leave balance fetched successfully') {
          const apiData = result.data[0];
          const leaveBalances: LeaveBalance[] = [
            { 
              type: 'Annual', 
              current: apiData.annual_leave_balance.toString(), 
              startOfYear: apiData.beginning_of_year_balance.toString() 
            },
            { 
              type: 'Sick', 
              current: apiData.sick_leave_balance.toString(), 
              startOfYear: '0' // Sick leave starts at 0 per requirement
            },
          ];
          setLeaveBalances(leaveBalances);
          console.log('Leave balances set:', leaveBalances);
        } else {
          console.log('Failed to fetch leave balances:', result.message || 'Unknown error');
        }
      } catch (error) {
        console.log('Leave balance fetch error:', error);
      }
    };

    const fetchAttendanceRecords = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) {
        console.log('No token available for attendance');
        return;
      }

      try {
        console.log('API_BASE_URL:', API_BASE_URL);
        const url = `${API_BASE_URL}/employee-attendance/attendance-list?filterType=MONTHLY`;
        console.log('Fetching attendance from:', url);
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
            'filterType': 'MONTHLY',
          },
        });

        const result = response.data;
        console.log('Attendance response:', result);
        if (result.success && result.message === 'Employee attendance records retrieved successfully') {
          const apiData: ApiAttendanceRecord[] = result.data;
          const processedRecords: AttendanceRecord[] = apiData.map((record) => {
            const inMoment = moment.tz(record.check_in_time, 'UTC').tz('Asia/Dhaka');
            const outMoment = moment.tz(record.check_out_time, 'UTC').tz('Asia/Dhaka');
            const dateStr = inMoment.format('ddd DD');
            const inTime = inMoment.format('HH:mm');
            const outTime = outMoment.isValid() && outMoment.isAfter(inMoment) ? outMoment.format('HH:mm') : '-';
            return { date: dateStr, in: inTime, out: outTime };
          });
          setAttendanceRecords(processedRecords);
          console.log('Attendance records set:', processedRecords);
        } else {
          console.log('Failed to fetch attendance:', result.message || 'Unknown error');
        }
      } catch (error) {
        console.log('Attendance fetch error:', error);
      }
    };

    fetchLeaveBalances();
    fetchAttendanceRecords();
  }, [userToken, API_BASE_URL]);

  const calculateDuration = (inTime: string, outTime: string) => {
    if (inTime === '-' || outTime === '-') return '-';
    const inMoment = moment(inTime, 'HH:mm');
    const outMoment = moment(outTime, 'HH:mm');
    if (!inMoment.isValid() || !outMoment.isValid() || outMoment.isBefore(inMoment)) return '-';
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
            <img src={ima} alt="Profile" className="w-24 h-24 rounded-full border-4 border-orange-500" />
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
                  <td className="py-2 px-4 border border-gray-300">{leave.startOfYear}</td>
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
              <th className="py-2 px-4 text-left">Date</th>
              {attendanceRecords.map((record) => (
                <th key={record.date} className="py-2 px-4 border border-gray-300">
                  {record.date.split(' ')[0]}
                  <br />
                  {record.date.split(' ')[1]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="flex py-2 px-4 font-medium border border-gray-300">Check-in</td>
              {attendanceRecords.map((record) => (
                <td key={`${record.date}-in`} className="py-2 px-4 border border-gray-300">{record.in}</td>
              ))}
            </tr>
            <tr className="text-center">
              <td className="flex py-2 px-4 font-medium border border-gray-300">Check-out</td>
              {attendanceRecords.map((record) => (
                <td key={`${record.date}-out`} className="py-2 px-4 border border-gray-300">{record.out}</td>
              ))}
            </tr>
            <tr className="text-center">
              <td className="py-2 px-4 font-medium border border-gray-300 flex">Duration</td>
              {attendanceRecords.map((record) => (
                <td key={`${record.date}-duration`} className="py-2 px-4 border border-gray-300">
                  {calculateDuration(record.in, record.out)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}