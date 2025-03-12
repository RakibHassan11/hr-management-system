import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust path to your store
import { FaCheck, FaTimes } from 'react-icons/fa';

interface LeaveRecord {
  id: number;
  employee_id: number;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
  description: string;
  created_at: string;
}

const TeamLeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access token from Redux state
  const { userToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchLeaveRecords = async () => {
      setIsLoading(true);
      setError(null);

      // Use token from local storage or Redux state
      const storedToken = localStorage.getItem('token_user') || userToken;

      if (!storedToken) {
        setError('No authentication token found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.allinall.social/api/otz-hrm/team/leave-records?line_manager_id=2', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setLeaveRecords(result.data);
        } else {
          setError(result.message || 'Failed to fetch leave records.');
        }
      } catch (error) {
        setError('Failed to fetch leave records. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveRecords();
  }, [userToken]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Function to simulate a PUT API call for a given action
  const handleAction = async (recordId: number, newStatus: string) => {
    // Retrieve token from storage or Redux state
    const storedToken = localStorage.getItem('token_user') || userToken;

    if (!storedToken) {
      alert('No authentication token found. Please log in.');
      return;
    }

    try {
      // Replace with your actual API endpoint when available
      const response = await fetch(`https://api.allinall.social/api/otz-hrm/team/leave-records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the state to reflect the new status
        setLeaveRecords(prevRecords =>
          prevRecords.map(record =>
            record.id === recordId ? { ...record, status: newStatus } : record
          )
        );
      } else {
        alert(result.message || 'Failed to update leave record.');
      }
    } catch (error) {
      alert('Failed to update leave record. Please try again later.');
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-[#1F2328]">Loading leave records...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="animate-fadeIn p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1F2328]">Team Leave Records</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#1F2328]/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E0E0]">
              <TableHead className="text-[#1F2328] font-semibold">Name</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Type</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Start Date</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">End Date</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Days</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Status</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-[#1F2328] font-medium">{record.name}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{record.type}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{formatDate(record.start_date)}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{formatDate(record.end_date)}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{record.days}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="text-[#1F2328] font-medium space-x-2">
                  <button
                    className="p-2 rounded bg-gray-500 text-white"
                    onClick={() => handleAction(record.id, 'APPROVED')}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="p-2 rounded bg-gray-500 text-white"
                    onClick={() => handleAction(record.id, 'REJECTED')}
                  >
                    <FaTimes />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamLeaveRecords;