import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import toast from 'react-hot-toast';

interface Holiday {
  id: number;
  title: string;
  start_date: string; // Renamed for consistency with GET API
  end_date: string;   // Renamed for consistency with GET API
  active: boolean;
  total_days?: number;
}

export default function Holidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchHolidays = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) {
        toast.error('No authentication token found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.allinall.social/api/otz-hrm/Holiday/holiday-list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        console.log('GET response:', result);

        if (response.ok && result.success) {
          const formattedHolidays: Holiday[] = result.data.map((holiday: any) => ({
            id: holiday.id,
            title: holiday.title,
            start_date: holiday.start_date.split('T')[0], // Format to YYYY-MM-DD
            end_date: holiday.end_date.split('T')[0],     // Format to YYYY-MM-DD
            active: holiday.status === 'ACTIVE',
            total_days: holiday.total_days,
          }));
          setHolidays(formattedHolidays);
        } else {
          toast.error(result.message || 'Failed to fetch holidays');
        }
      } catch (error) {
        console.error('GET error:', error);
        toast.error('Network error: Could not fetch holidays');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [userToken]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setTitle('');
      setStartDate('');
      setEndDate('');
    }
  };

  const handleCreateHoliday = async () => {
    const storedToken = localStorage.getItem('token_user') || userToken;
    if (!storedToken) {
      toast.error('No authentication token found. Please log in.');
      return;
    }

    if (!title || !startDate || !endDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSaving(true);
    const holidayData = {
      title,
      startday: startDate, // POST API expects 'startday'
      endday: endDate,     // POST API expects 'endday'
    };

    try {
      const response = await fetch('https://api.allinall.social/api/otz-hrm/Holiday/create-holiday', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(holidayData),
      });
      const result = await response.json();
      console.log('POST response:', result);

      if (response.status === 201 && result.success) {
        toast.success('Holiday created successfully');
        setIsSaving(false);
        toggleModal();
        // Refetch holidays
        setIsLoading(true);
        const fetchResponse = await fetch('https://api.allinall.social/api/otz-hrm/Holiday/holiday-list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const fetchResult = await fetchResponse.json();
        if (fetchResponse.ok && fetchResult.success) {
          const formattedHolidays: Holiday[] = fetchResult.data.map((holiday: any) => ({
            id: holiday.id,
            title: holiday.title,
            start_date: holiday.start_date.split('T')[0],
            end_date: holiday.end_date.split('T')[0],
            active: holiday.status === 'ACTIVE',
            total_days: holiday.total_days,
          }));
          setHolidays(formattedHolidays);
        }
        setIsLoading(false);
      } else {
        toast.error(result.message || `Failed to create holiday (Status: ${response.status})`);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('POST error:', error);
      toast.error('Network error: Could not create holiday');
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Holidays</h1>
          <button
            className="bg-[#F97316] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#EA580C]"
            onClick={toggleModal}
          >
            Add Holidays
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328] text-lg rounded-tl-lg">
                  Title
                </TableHead>
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328] text-lg">
                  Start Date
                </TableHead>
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328] text-lg">
                  End Date
                </TableHead>
                <TableHead className="w-1/4 py-4 px-6 text-left font-semibold text-[#1F2328] text-lg rounded-tr-lg">
                  Total Days
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length > 0 ? (
                holidays.map((holiday) => (
                  <TableRow
                    key={holiday.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] font-medium text-base truncate">
                      {holiday.title}
                    </TableCell>
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] text-base truncate">
                      {holiday.start_date}
                    </TableCell>
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] text-base truncate">
                      {holiday.end_date}
                    </TableCell>
                    <TableCell className="w-1/4 py-3 px-6 text-[#1F2328] text-base truncate">
                      {holiday.total_days ?? 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 px-6 text-center text-[#1F2328] font-medium text-base"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 px-6 text-center text-[#1F2328] font-medium text-base"
                  >
                    No holidays available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Holiday</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">Holiday Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter holiday title"
                disabled={isSaving}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                disabled={isSaving}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
                className={`bg-green-600 text-white px-4 py-2 rounded-md ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCreateHoliday}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Holiday'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}