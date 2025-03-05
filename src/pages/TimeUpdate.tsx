import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function TimeUpdate() {
  return (
  <Layout>
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Time Update Request</h1>
        <Button>
          View Time Update Records
        </Button>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Update Type:</label>
              <Select>
                <SelectTrigger className="w-full border border-gray-300 bg-white">
                  <SelectValue placeholder="-- Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  <SelectItem value="in">Clock In</SelectItem>
                  <SelectItem value="out">Clock Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium">Date:</label>
              <Input type="date" className="w-full border border-gray-300" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Time:</label>
            <div className="grid grid-cols-3 gap-2">
              <Select>
                <SelectTrigger className="border border-gray-300 bg-white">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  {[...Array(24).keys()].map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>{hour.toString().padStart(2, '0')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="border border-gray-300 bg-white">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  {[...Array(60).keys()].map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>{minute.toString().padStart(2, '0')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="border border-gray-300 bg-white">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Description:</label>
            <Textarea className="w-full border border-gray-300" placeholder="Enter details..." />
          </div>
          
          <Button>
            Apply for Time Update
          </Button>
        </div>
      </div>
    </div>
  </Layout>
  );
}
