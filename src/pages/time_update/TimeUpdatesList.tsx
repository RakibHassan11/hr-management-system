import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatTime, formatDate } from '@/components/utils/dateHelper';

export default function TimeUpdatesList() {
  const [records, setRecords] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);

  const fetchRecords = () => {
    const url = `${API_URL}/employee/time-update-list`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        return response.json();
      })
      .then((data) => {
        setRecords(data.data);
      })
      .catch((error) => {
        setRecords([])
        setError(error.message);
      });
  };

  useEffect(() => {
    fetchRecords();
  }, [API_URL, token]);

  if(error) <p className="text-center text-red-500">{error}</p>

  return (
    <Fragment>
      {records !== null ? (
        <div className="p-6 bg-white text-[#1F2328] min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Time Update Records</h1>

          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-[#1F2328]">ID</TableHead>
                    <TableHead className="text-[#1F2328]">Employee Name</TableHead>
                    <TableHead className="text-[#1F2328]">Permission Value</TableHead>
                    <TableHead className="text-[#1F2328]">Date</TableHead>
                    <TableHead className="text-[#1F2328]">Time</TableHead>
                    <TableHead className="text-[#1F2328]">Type</TableHead>
                    <TableHead className="text-[#1F2328]">Status</TableHead>
                    <TableHead className="text-[#1F2328]">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow
                      key={record.id}
                    >
                      <TableCell className="text-[#1F2328]">{record.id}</TableCell>
                      <TableCell className="text-[#1F2328]">{record.employee_name}</TableCell>
                      <TableCell className="text-[#1F2328]">{record.permission_value}</TableCell>
                      <TableCell className="text-[#1F2328]">
                        {formatDate(record.date)}
                      </TableCell>
                      <TableCell className="text-[#1F2328]">
                        {formatTime(record.time)}
                      </TableCell>
                      <TableCell className="text-[#1F2328]">{record.type}</TableCell>
                      <TableCell className="text-[#1F2328]">{record.status}</TableCell>
                      <TableCell className="text-[#1F2328]">{record.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
      </div> ) : (<p className="text-center text-gray-600">Loading time updates...</p>)}
      </Fragment>
  );
}


