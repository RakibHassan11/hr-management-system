import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [error, setError] = useState<string | null>(null); // New error state
  const recordsPerPage = 10;
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { id } = useSelector((state: RootState) => state.auth.user); // Get ID from auth.user
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      const lineManagerId = id;

      if (!storedToken) {
        setError('No authentication token found. Please log in.');
        setIsLoading(false);
        return;
      }

      if (!lineManagerId) {
        setError('User ID not found. Please ensure you are logged in correctly.');
        setIsLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/team/attendance-record?line_manager_id=${lineManagerId}`;
      console.log('Fetching attendance records from:', url);

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log('GET response:', result);

        if (response.status === 200 && result.message === 'ATTENDANCE_REQUESTS_FETCHED') {
          setAttendanceRecords(result.data);
        } else if (response.status === 401) {
          setError('Unauthorized: Invalid or expired token. Please log in again.');
        } else if (response.status === 403) {
          setError('Forbidden: You lack permission to view these records. Contact your administrator.');
        } else {
          setError(result.message || 'Failed to fetch attendance records.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Network error: Failed to fetch attendance records. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [userToken, id, API_BASE_URL]);

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

  const handleAction = async (recordId: number, action: string) => {
    const storedToken = localStorage.getItem('token_user') || userToken;
    if (!storedToken) {
      toast.error('No authentication token found. Please log in.');
      return;
    }

    const actionText = action === 'APPROVED' ? 'approve' : 'reject';
    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this attendance record?`,
      text: "This action will update the attendance status (once implemented).",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (!result.isConfirmed) {
      return;
    }

    // Placeholder action since no API is available
    toast.error(`Action (${action}) not implemented yet for record ${recordId}`);
    // Uncomment and implement once API is available:
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/team/update-attendance-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: recordId, status: action }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setAttendanceRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === recordId ? { ...record, ...result.data } : record
          )
        );
        toast.success('Attendance status updated successfully');
      } else {
        toast.error(result.message || 'Failed to update attendance record.');
      }
    } catch (error) {
      toast.error('Network error: Failed to update attendance record.');
    }
    */
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendanceRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(attendanceRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

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
              <TableHead className="text-[#1F2328] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-[#1F2328]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-[#1F2328] font-medium">{record.employee_name}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{formatDate(record.date)}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{formatTime(record.time)}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{record.type}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{record.status}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium space-x-2">
                    {record.status !== 'APPROVED' && (
                      <button
                        className="p-2 rounded bg-gray-500 text-white hover:bg-green-600"
                        onClick={() => handleAction(record.id, 'APPROVED')}
                      >
                        <FaCheck />
                      </button>
                    )}
                    {record.status !== 'REJECTED' && (
                      <button
                        className="p-2 rounded bg-gray-500 text-white hover:bg-red-600"
                        onClick={() => handleAction(record.id, 'REJECTED')}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-[#1F2328]">
                  No attendance records available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      </div>
    </div>
  );
};

export default TeamAttendanceRecord;