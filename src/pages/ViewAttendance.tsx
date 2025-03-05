import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ViewAttendance() {
  return (
    <Layout>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Attendance Record</h1>
          <Button >
            Submit
          </Button>
        </div>
       
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <div className="grid grid-cols-3 gap-4 mb-4">
          <Select>
          <SelectTrigger className="border border-gray-300 bg-white"> {/* Ensure white background */}
            <SelectValue placeholder="Attendance" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 shadow-md"> {/* Set dropdown background to white */}
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="leave">Leave</SelectItem>
          </SelectContent>
        </Select>

            <Input type="date" className="border border-gray-300" defaultValue="2025-02-01" />
            <Input type="date" className="border border-gray-300" defaultValue="2025-02-18" />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">Date</TableHead>
                <TableHead className="text-[#1F2328]">Day</TableHead>
                <TableHead className="text-[#1F2328]">Shift</TableHead>
                <TableHead className="text-[#1F2328]">In Time</TableHead>
                <TableHead className="text-[#1F2328]">Out Time</TableHead>
                <TableHead className="text-[#1F2328]">Duration</TableHead>
                <TableHead className="text-[#1F2328]">Status</TableHead>
                <TableHead className="text-[#1F2328]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="text-[#1F2328]">2025-02-{String(index + 1).padStart(2, '0')}</TableCell>
                  <TableCell className="text-[#1F2328]">Monday</TableCell>
                  <TableCell className="text-[#1F2328]">General Shift (10:00-19:00)</TableCell>
                  <TableCell className="text-[#1F2328]">09:30 AM</TableCell>
                  <TableCell className="text-[#1F2328]">07:30 PM</TableCell>
                  <TableCell className="text-[#1F2328]">09:00</TableCell>
                  <TableCell className="text-[#1F2328]">Present</TableCell>
                  <TableCell>
                    <Button>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
