import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast'; 
import { useNavigate } from 'react-router-dom';

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [updating, setUpdating] = useState(false);
  const [errorUpdating, setErrorUpdating] = useState(null);
  const token = useSelector((state: RootState) => state.auth.userToken);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()

  const handleApplyLeave = async () => {

    if(!leaveType || !startDate || !endDate || !description) {
      toast.error("All fields are required");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const payload = {
      type: leaveType, 
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),       
      days: diffDays,
      description: description,
      without_pay: true,
    };

    let toastId;
    try {
      setUpdating(true);
      toastId = toast.loading("Applying for leave...");
      
      const response = await fetch(`${API_URL}/employee/update-leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      toast.success(data.message, { id: toastId });
      
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      
    } catch (error) {
      toast.error("Error updating leave", { id: toastId });
      setErrorUpdating(error);
    } finally {
      setUpdating(false);
    }
  };

  if (errorUpdating) return <p className="text-center text-red-500">{errorUpdating}</p>;

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Apply for Leave</h1>
        <Button
          onClick={(e) => {
                navigate(`/user/apply-leave/leave-record-list`);
          }}
          style={{ cursor: 'pointer' }}>
          View Leave Records
        </Button>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Leave Type:</label>
              <Select onValueChange={(value) => setLeaveType(value)}>
                <SelectTrigger className="w-full border border-gray-300 bg-white">
                  <SelectValue placeholder="-- Select Type --" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  <SelectItem value="ANNUAL">ANNUAL</SelectItem>
                  <SelectItem value="SICK">SICK</SelectItem>
                  <SelectItem value="CASUAL">CASUAL</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date:</label>
              <Input
                type="date"
                className="w-full border border-gray-300"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date:</label>
              <Input
                type="date"
                className="w-full border border-gray-300"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Reason:</label>
            <Textarea
              className="w-full border border-gray-300"
              placeholder="Enter leave reason..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button disabled={updating} onClick={handleApplyLeave}>
            {updating ? "Applying for Leave.." : "Apply for Leave"}
          </Button>
        </div>
      </div>
    </div>
  );
}
