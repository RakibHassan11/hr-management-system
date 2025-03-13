import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name: string;
  permission_value: string;
  date: string;
  time: string;
  type: string;
  status: string;
  description: string;
  created_at: string;
}

const TeamAttendanceRecord = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const { userToken } = useSelector((state: RootState) => state.auth);
  
  // Use the environment variable for the base API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) return;

      try {
        const response = await fetch(`${API_BASE_URL}/team/attendance-record?line_manager_id=2`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (response.status === 200 && result.message === 'ATTENDANCE_REQUESTS_FETCHED') {
          setAttendanceRecords(result.data);
        }
      } catch (error) {
        console.log('Fetch error:', error); // Log silently for debugging
      }
    };

    fetchAttendanceRecords();
  }, [userToken, API_BASE_URL]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString.includes('T') ? timeString : `1970-01-01T${timeString}Z`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#1F2328] mb-6">Team Attendance Records</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#1F2328]/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E0E0]">
              <TableHead className="text-[#1F2328] font-semibold">Employee Name</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Date</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Time</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Type</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-[#1F2328] font-medium">{record.employee_name}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{formatDate(record.date)}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{formatTime(record.time)}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{record.type}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamAttendanceRecord;
