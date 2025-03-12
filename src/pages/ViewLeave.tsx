import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ViewLeave() {

  const [leaveData, setLeaveData] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);

  const fetchLeaveData = (query = '') => {
    const url = `${API_URL}/team/leave-records?line_manager_id=2`;
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
        setLeaveData(data.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchLeaveData();
  }, [API_URL, token]);

  return (
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leave Record</h1>
          <Button>
            Submit
          </Button>
        </div>
        
      {leaveData !== null ?
        (<div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Select>
              <SelectTrigger className="border border-gray-300 bg-white">
                <SelectValue placeholder="Leave Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md">
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="border border-gray-300" defaultValue="2025-01-01" />
            <Input type="date" className="border border-gray-300" defaultValue="2025-12-31" />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">Id</TableHead>
                <TableHead className="text-[#1F2328]">Name</TableHead>
                <TableHead className="text-[#1F2328]">Days</TableHead>
                <TableHead className="text-[#1F2328]">Description</TableHead>
                <TableHead className="text-[#1F2328]">Start Date</TableHead>
                <TableHead className="text-[#1F2328]">End Date</TableHead>
                <TableHead className="text-[#1F2328]">Type</TableHead>
                <TableHead className="text-[#1F2328]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveData.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="text-[#1F2328]">{leave.id}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.name}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.days}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.description}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.start_date}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.end_date}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.type}</TableCell>
                  <TableCell className="text-[#1F2328]">{leave.status}</TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
          
          {/* <div className="mt-4 p-4 bg-gray-100 rounded-md text-[#1F2328]">
            <p className="font-medium">No Leave Record</p>
          </div> */}
        </div>) : (<p className="text-center text-gray-600">Loading profile...</p>)}
      </div>
  );
}
