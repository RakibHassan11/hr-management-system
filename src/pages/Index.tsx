import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

const AttendanceRecord = () => {
  const [startDate, setStartDate] = useState('2024-02-01');
  const [endDate, setEndDate] = useState('2024-02-18');

  const attendanceData = [
    {
      date: '2024-02-01',
      day: 'Thursday',
      shift: 'General Shift (10:00-19:00)',
      inTime: '10:14 AM',
      outTime: '07:38 PM',
      duration: '09:22',
      status: 'Present',
    },
    // Add more dummy data as needed
  ];

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1FB77F]">Attendance Record</h1> {/* Vibrant Green Title */}
        </div>
        
        <div className="bg-white p-6 rounded-lg mb-6 border border-[#1FB77F]/30">
          <div className="flex gap-4 mb-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-[#1FB77F]/50"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-[#1FB77F]/50"
            />
            <Button className="bg-[#1FB77F] hover:bg-[#189962] text-white">
              Submit
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden border border-[#1FB77F]/30"> {/* Removed shadow class */}
          <Table>
            <TableHeader>
              <TableRow className="bg-[#C9F2E7]"> {/* Soft Mint background for table header */}
                <TableHead className="text-[#1FB77F]">Date</TableHead>
                <TableHead className="text-[#1FB77F]">Day</TableHead>
                <TableHead className="text-[#1FB77F]">Shift</TableHead>
                <TableHead className="text-[#1FB77F]">In Time</TableHead>
                <TableHead className="text-[#1FB77F]">Out Time</TableHead>
                <TableHead className="text-[#1FB77F]">Duration</TableHead>
                <TableHead className="text-[#1FB77F]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="text-[#1FB77F]">{record.date}</TableCell>
                  <TableCell className="text-[#1FB77F]">{record.day}</TableCell>
                  <TableCell className="text-[#1FB77F]">{record.shift}</TableCell>
                  <TableCell className="text-[#1FB77F]">{record.inTime}</TableCell>
                  <TableCell className="text-[#1FB77F]">{record.outTime}</TableCell>
                  <TableCell className="text-[#1FB77F]">{record.duration}</TableCell>
                  <TableCell className="text-[#1FB77F]">{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceRecord;
