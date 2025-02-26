import { Layout } from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Employee() {
  return (
    <Layout>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Employee List</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <Input placeholder="Search by name..." className="border border-gray-300" />
            
            <Select>
              <SelectTrigger className="border border-gray-300 bg-white"> {/* Ensures white background */}
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md"> {/* White background for dropdown */}
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="border border-gray-300 bg-white"> {/* Ensures white background */}
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md"> {/* White background for dropdown */}
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
              </SelectContent>
            </Select>

            <Button>Submit</Button>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">ID</TableHead>
                <TableHead className="text-[#1F2328]">Name</TableHead>
                <TableHead className="text-[#1F2328]">Email</TableHead>
                <TableHead className="text-[#1F2328]">Phone</TableHead>
                <TableHead className="text-[#1F2328]">Designation</TableHead>
                <TableHead className="text-[#1F2328]">Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-[#1F2328]">001</TableCell>
                <TableCell className="text-[#1F2328]">John Doe</TableCell>
                <TableCell className="text-[#1F2328]">john@example.com</TableCell>
                <TableCell className="text-[#1F2328]">017XXXXXXXX</TableCell>
                <TableCell className="text-[#1F2328]">Software Engineer</TableCell>
                <TableCell className="text-[#1F2328]">Development</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
