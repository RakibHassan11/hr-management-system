import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatDate } from '@/components/utils/dateHelper';
import Swal from 'sweetalert2';

interface LeaveRecord {
  id: number;
  employee_id: number;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: 'PENDING' | 'APPROVED_BY_LINE_MANAGER' | 'REJECTED_BY_LINE_MANAGER' | 'APPROVED_BY_HR' | 'REJECTED_BY_HR' | string;
  description: string;
  created_at: string;
  updated_at?: string;
  without_pay?: boolean;
}

const EmployeeLeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { id } = useSelector((state: RootState) => state.auth.user);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeaveRecords = async () => {
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

      const url = `${API_BASE_URL}/employee/leave-records-list?line_manager_id=${lineManagerId}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (response.status === 200 && result.message === 'LEAVE_RECORDS_FETCHED') {
          console.log('Fetched leave records:', result.data);
          const mappedRecords = result.data.map((record: any) => ({
            ...record,
            name: record.name || record.employee_name,
          }));
          setLeaveRecords(mappedRecords);
        } else if (response.status === 401) {
          setError('Unauthorized: Invalid or expired token. Please log in again.');
        } else if (response.status === 403) {
          setError('Forbidden: You lack permission to view these records.');
        } else {
          setError(result.message || 'Failed to fetch leave records.');
        }
      } catch (error) {
        setError('Network error: Failed to fetch leave records.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveRecords();
  }, [userToken, id, API_BASE_URL]);

  const getReadableStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED_BY_LINE_MANAGER':
        return 'Approved by Line Manager';
      case 'REJECTED_BY_LINE_MANAGER':
        return 'Rejected by Line Manager';
      case 'APPROVED_BY_HR':
        return 'Approved by HR';
      case 'REJECTED_BY_HR':
        return 'Rejected by HR';
      default:
        return status;
    }
  };

  const handleAction = async (recordId: number, newStatus: 'APPROVED_BY_LINE_MANAGER' | 'REJECTED_BY_LINE_MANAGER') => {
    const storedToken = localStorage.getItem('token_user') || userToken;
    if (!storedToken) {
      toast.error('No authentication token found. Please log in.');
      return;
    }

    const actionText = newStatus === 'APPROVED_BY_LINE_MANAGER' ? 'approve' : 'reject';
    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this leave request?`,
      text: "This action will update the leave status.",
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

    try {
      const payload = { id: recordId, status: newStatus };
      const response = await fetch('https://api.allinall.social/api/otz-hrm/employee/update-leave-status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('PUT response:', result);
      if (response.ok && result.success) {
        setLeaveRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === recordId ? { ...record, ...result.data } : record
          )
        );
        toast.success('Leave status updated successfully');
      } else {
        toast.error(result.message || 'Failed to update leave record.');
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error: Failed to update leave record.');
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = leaveRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(leaveRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
;
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="animate-fadeIn p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1F2328]">Employee Leave Records</h1>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#1F2328]/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E0E0]">
              <TableHead className="text-[#1F2328] font-semibold">Employee Name</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Type</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Start Date</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">End Date</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Days</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Status</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[#1F2328]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-[#1F2328] font-medium">{record.name}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{record.type}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{formatDate(record.start_date)}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{formatDate(record.end_date)}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">{record.days}</TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'APPROVED_BY_LINE_MANAGER' || record.status === 'APPROVED_BY_HR'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'REJECTED_BY_LINE_MANAGER' || record.status === 'REJECTED_BY_HR'
                          ? 'bg-red-100 text-red-800'
                          : record.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getReadableStatus(record.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium space-x-2">
                    {record.status === 'PENDING' && (
                      <>
                        <button
                          className="p-2 rounded bg-gray-500 text-white hover:bg-green-600"
                          onClick={() => handleAction(record.id, 'APPROVED_BY_LINE_MANAGER')}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="p-2 rounded bg-gray-500 text-white hover:bg-red-600"
                          onClick={() => handleAction(record.id, 'REJECTED_BY_LINE_MANAGER')}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[#1F2328]">
                  No leave records available
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

export default EmployeeLeaveRecords;