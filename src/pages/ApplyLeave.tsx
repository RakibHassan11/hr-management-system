import  {Layout} from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function ApplyLeave() {
  return (
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Apply for Leave</h1>
          <Button>
            View Leave Records
          </Button>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Leave Type:</label>
                <Select>
                  <SelectTrigger className="w-full border border-gray-300 bg-white"> {/* Ensures white background */}
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md"> {/* White background for dropdown */}
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Start Date:</label>
                <Input type="date" className="w-full border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium">End Date:</label>
                <Input type="date" className="w-full border border-gray-300" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium">Reason:</label>
              <Textarea className="w-full border border-gray-300" placeholder="Enter leave reason..." />
            </div>
            
            <Button>
              Apply for Leave
            </Button>
          </div>
        </div>
      </div>
  );
}
