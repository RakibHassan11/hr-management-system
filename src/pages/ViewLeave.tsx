import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ViewLeave() {
  return (
    <Layout>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leave Record</h1>
          <Button>
            Submit
          </Button>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
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
                <TableHead className="text-[#1F2328]">ID</TableHead>
                <TableHead className="text-[#1F2328]">Name</TableHead>
                <TableHead className="text-[#1F2328]">Designation</TableHead>
                <TableHead className="text-[#1F2328]">Phone</TableHead>
                <TableHead className="text-[#1F2328]">Joining Date</TableHead>
                <TableHead className="text-[#1F2328]">Annual Leave Balance</TableHead>
                <TableHead className="text-[#1F2328]">Sick Leave Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-[#1F2328]">144</TableCell>
                <TableCell className="text-[#1F2328]">Rakib Uz Zaman</TableCell>
                <TableCell className="text-[#1F2328]">HR-Assistant Manager</TableCell>
                <TableCell className="text-[#1F2328]">01722185586</TableCell>
                <TableCell className="text-[#1F2328]">2024-04-15</TableCell>
                <TableCell className="text-[#1F2328]">0.00</TableCell>
                <TableCell className="text-[#1F2328]">0.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-[#1F2328]">
            <p className="font-medium">No Leave Record</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
