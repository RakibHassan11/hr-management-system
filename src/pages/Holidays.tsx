import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import toast from 'react-hot-toast';

interface Holiday {
  id: number;
  title: string;
  startday: string;
  endday: string;
  day: string;
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
  const { userToken } = useSelector((state: RootState) => state.auth);

  // Fetch holidays on mount
  useEffect(() => {
    const fetchHolidays = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      console.log('Token used for GET:', storedToken);

      if (!storedToken) {
        toast.error('No authentication token found. Please log in.');
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
            startday: holiday.start_date.split('T')[0], // "2025-02-01"
            endday: holiday.end_date.split('T')[0],
            day: new Date(holiday.start_date).toLocaleDateString('en-US', { weekday: 'long' }),
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
    console.log('Token used for POST:', storedToken);

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
      startday: startDate,
      endday: endDate,
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
        // Refetch holidays to sync with server
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
            startday: holiday.start_date.split('T')[0],
            endday: holiday.end_date.split('T')[0],
            day: new Date(holiday.start_date).toLocaleDateString('en-US', { weekday: 'long' }),
            active: holiday.status === 'ACTIVE',
            total_days: holiday.total_days,
          }));
          setHolidays(formattedHolidays);
        }
      } else {
        toast.error(result.message || `Failed to create holiday (Status: ${response.status})`);
        setIsSaving(false); // Keep modal open on failure
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

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">Title</TableHead>
                <TableHead className="text-[#1F2328]">Start Date</TableHead>
                <TableHead className="text-[#1F2328]">End Date</TableHead>
                <TableHead className="text-[#1F2328]">Day</TableHead>
                <TableHead className="text-[#1F2328]">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length > 0 ? (
                holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="text-[#1F2328] font-medium">{holiday.title}</TableCell>
                    <TableCell className="text-[#1F2328]">{holiday.startday}</TableCell>
                    <TableCell className="text-[#1F2328]">{holiday.endday}</TableCell>
                    <TableCell className="text-[#1F2328]">{holiday.day}</TableCell>
                    <TableCell className="text-[#1F2328]">{holiday.active ? '✔' : '✘'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#1F2328]">
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