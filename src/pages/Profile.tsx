import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, ShieldCheck } from 'lucide-react';

interface Employee {
  id: string;
  employee_id: number;
  profile_image: string | null;
  name: string;
  username: string;
  email: string;
  password?: string;
  permission_value: string | null;
  phone: string;
  designation: string;
  division_id: number | null;
  department_id: number | null;
  sub_department_id: number | null;
  unit_id: number | null;
  line_manager_id: number | null;
  joining_date: string | null;
  confirmed: boolean;
  confirmation_date: string | null;
  default_shift: string | null;
  breakfast: boolean;
  lunch: boolean;
  beef: boolean;
  fish: boolean;
  gender: string;
  religion: string;
  birthday: string | null;
  official_birthday: string | null;
  blood_group: string;
  fathers_name: string | null;
  mothers_name: string | null;
  relationship_status: string;
  spouse: string | null;
  children: string | null;
  present_address: string | null;
  permanent_address: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  gitlab: string | null;
  github: string | null;
  personal_email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profile, setProfile] = useState<Partial<Employee>>({});

  // Fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        let endpoint = `${import.meta.env.VITE_API_URL}/employee/list`;
        if (searchTerm.trim() !== '') {
          endpoint += `?needPagination=true&query=${encodeURIComponent(searchTerm.trim())}`;
        }
        const response = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch employees');
        }
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError(err.response?.data?.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Fetch full employee profile (placeholder until GET endpoint is provided)
  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      if (selectedEmployee) {
        try {
          const token = localStorage.getItem('token');
          // Placeholder GET endpoint - replace with actual endpoint
          const response = await axios.get(
            `https://api.allinall.social/api/otz-hrm/employee/profile?id=${selectedEmployee.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
              },
            }
          );
          setProfile(response.data.data || selectedEmployee);
        } catch (err: any) {
          console.error('Error fetching profile:', err);
          setError(err.response?.data?.message || 'Failed to fetch profile');
          // Fallback to selectedEmployee if GET fails
          setProfile(selectedEmployee);
        }
      }
    };
    fetchEmployeeProfile();
  }, [selectedEmployee]);

  // Handler to update profile
  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'https://api.allinall.social/api/otz-hrm/employee/update-profile',
        { ...profile, id: selectedEmployee?.id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      if (response.data.message === 'Employee profile updated successfully') {
        console.log('Update success:', response.data);
        setSelectedEmployee(null);
        // Refresh employee list
        const listResponse = await axios.get(`${import.meta.env.VITE_API_URL}/employee/list`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (listResponse.data.success) {
          setEmployees(listResponse.data.data);
        }
      } else {
        setError('Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (selectedEmployee) {
    return (
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-left">Edit Employee Profile</h1>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full mb-6 bg-gray-100 p-2 flex justify-evenly">
            <TabsTrigger value="basic" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Basic</TabsTrigger>
            <TabsTrigger value="device" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Device</TabsTrigger>
            <TabsTrigger value="personal" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Personal</TabsTrigger>
            <TabsTrigger value="official" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Official</TabsTrigger>
            <TabsTrigger value="social" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Social</TabsTrigger>
            <TabsTrigger value="meal" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Meal</TabsTrigger>
            <TabsTrigger value="leave" className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]">Leave</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input value={profile.employee_id?.toString() || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={profile.username || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation</label>
                  <Input value={profile.designation || ''} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personal Email</label>
                  <Input value={profile.personal_email?.replace('mailto:', '') || ''} onChange={(e) => setProfile({ ...profile, personal_email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={profile.gender || ''} onValueChange={(val) => setProfile({ ...profile, gender: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={profile.status || ''} onValueChange={(val) => setProfile({ ...profile, status: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Joining Date</label>
                  <Input type="date" value={profile.joining_date?.substring(0, 10) || ''} onChange={(e) => setProfile({ ...profile, joining_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmed</label>
                  <Select value={profile.confirmed ? 'Yes' : 'No'} onValueChange={(val) => setProfile({ ...profile, confirmed: val === 'Yes' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmation Date</label>
                  <Input type="date" value={profile.confirmation_date?.substring(0, 10) || ''} onChange={(e) => setProfile({ ...profile, confirmation_date: e.target.value })} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Device Tab */}
          <TabsContent value="device" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Official Laptop's Mac</label>
                <Input value={profile.official_laptop_mac || ''} onChange={(e) => setProfile({ ...profile, official_laptop_mac: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Personal Device's Mac</label>
                <Input value={profile.personal_device_mac || ''} onChange={(e) => setProfile({ ...profile, personal_device_mac: e.target.value })} />
              </div>
            </div>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={profile.gender || ''} onValueChange={(val) => setProfile({ ...profile, gender: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Religion</label>
                  <Select value={profile.religion || ''} onValueChange={(val) => setProfile({ ...profile, religion: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Hinduism">Hinduism</SelectItem>
                      <SelectItem value="Christianity">Christianity</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Birthday</label>
                  <Input type="date" value={profile.birthday?.substring(0, 10) || ''} onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Official Birthday</label>
                  <Input type="date" value={profile.official_birthday?.substring(0, 10) || ''} onChange={(e) => setProfile({ ...profile, official_birthday: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <Select value={profile.blood_group || ''} onValueChange={(val) => setProfile({ ...profile, blood_group: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Father’s Name</label>
                  <Input value={profile.fathers_name || ''} onChange={(e) => setProfile({ ...profile, fathers_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mother’s Name</label>
                  <Input value={profile.mothers_name || ''} onChange={(e) => setProfile({ ...profile, mothers_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship Status</label>
                  <Select value={profile.relationship_status || ''} onValueChange={(val) => setProfile({ ...profile, relationship_status: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Spouse</label>
                  <Input value={profile.spouse || ''} onChange={(e) => setProfile({ ...profile, spouse: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Children</label>
                  <Input value={profile.children || ''} onChange={(e) => setProfile({ ...profile, children: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Present Address</label>
                  <Textarea value={profile.present_address || ''} onChange={(e) => setProfile({ ...profile, present_address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permanent Address</label>
                  <Textarea value={profile.permanent_address || ''} onChange={(e) => setProfile({ ...profile, permanent_address: e.target.value })} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Official Tab */}
          <TabsContent value="official" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Division ID</label>
                <Input value={profile.division_id?.toString() || ''} onChange={(e) => setProfile({ ...profile, division_id: Number(e.target.value) || null })} />
                <label className="text-sm font-medium">Department ID</label>
                <Input value={profile.department_id?.toString() || ''} onChange={(e) => setProfile({ ...profile, department_id: Number(e.target.value) || null })} />
                <label className="text-sm font-medium">Sub Department ID</label>
                <Input value={profile.sub_department_id?.toString() || ''} onChange={(e) => setProfile({ ...profile, sub_department_id: Number(e.target.value) || null })} />
                <label className="text-sm font-medium">Unit ID</label>
                <Input value={profile.unit_id?.toString() || ''} onChange={(e) => setProfile({ ...profile, unit_id: Number(e.target.value) || null })} />
                <label className="text-sm font-medium">Line Manager ID</label>
                <Input value={profile.line_manager_id?.toString() || ''} onChange={(e) => setProfile({ ...profile, line_manager_id: Number(e.target.value) || null })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Shift</label>
                <Input value={profile.default_shift || ''} onChange={(e) => setProfile({ ...profile, default_shift: e.target.value })} />
                <label className="text-sm font-medium">GitLab</label>
                <Input value={profile.gitlab || ''} onChange={(e) => setProfile({ ...profile, gitlab: e.target.value })} />
                <label className="text-sm font-medium">GitHub</label>
                <Input value={profile.github || ''} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
              </div>
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input value={profile.website || ''} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                <label className="text-sm font-medium">Facebook</label>
                <Input value={profile.facebook || ''} onChange={(e) => setProfile({ ...profile, facebook: e.target.value })} />
                <label className="text-sm font-medium">Twitter</label>
                <Input value={profile.twitter || ''} onChange={(e) => setProfile({ ...profile, twitter: e.target.value })} />
                <label className="text-sm font-medium">LinkedIn</label>
                <Input value={profile.linkedin || ''} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram</label>
                <Input value={profile.instagram || ''} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} />
                <label className="text-sm font-medium">YouTube</label>
                <Input value={profile.youtube || ''} onChange={(e) => setProfile({ ...profile, youtube: e.target.value })} />
                <label className="text-sm font-medium">TikTok</label>
                <Input value={profile.tiktok || ''} onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })} />
              </div>
            </div>
          </TabsContent>

          {/* Meal Tab */}
          <TabsContent value="meal" className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border border-gray-300">Meal Type</th>
                    <th className="py-2 px-4 border border-gray-300">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Breakfast</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Select value={profile.breakfast ? 'Yes' : 'No'} onValueChange={(val) => setProfile({ ...profile, breakfast: val === 'Yes' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Lunch</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Select value={profile.lunch ? 'Yes' : 'No'} onValueChange={(val) => setProfile({ ...profile, lunch: val === 'Yes' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Beef</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Select value={profile.beef ? 'Yes' : 'No'} onValueChange={(val) => setProfile({ ...profile, beef: val === 'Yes' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Fish</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Select value={profile.fish ? 'Yes' : 'No'} onValueChange={(val) => setProfile({ ...profile, fish: val === 'Yes' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Leave Tab */}
          <TabsContent value="leave" className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border border-gray-300">Leave Type</th>
                    <th className="py-2 px-4 border border-gray-300">Available</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Annual Leave Balance</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Input value={profile.annual_leave_balance || ''} onChange={(e) => setProfile({ ...profile, annual_leave_balance: e.target.value })} />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Sick Leave Balance</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Input value={profile.sick_leave_balance || ''} onChange={(e) => setProfile({ ...profile, sick_leave_balance: e.target.value })} />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 font-semibold">Casual Leave Balance</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <Input value={profile.casual_leave_balance || ''} onChange={(e) => setProfile({ ...profile, casual_leave_balance: e.target.value })} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 flex items-center justify-start gap-4">
          <Button onClick={handleSaveProfile}>Save Profile</Button>
          <Button onClick={() => setSelectedEmployee(null)}>Back to List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-left">Employee List</h1>
      <div className="mb-6 flex items-center justify-center">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 mr-2"
        />
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center whitespace-nowrap">Employee ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-center">Designation</TableHead>
              <TableHead className="text-center">Personal Email</TableHead>
              <TableHead className="text-center">Gender</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="text-center">{emp.id}</TableCell>
                <TableCell className="text-center">{emp.employee_id}</TableCell>
                <TableCell className="text-center">{emp.name}</TableCell>
                <TableCell className="text-center">{emp.email.replace('mailto:', '')}</TableCell>
                <TableCell className="text-center">{emp.phone}</TableCell>
                <TableCell className="text-center">{emp.designation}</TableCell>
                <TableCell className="text-center">{emp.personal_email.replace('mailto:', '')}</TableCell>
                <TableCell className="text-center">{emp.gender}</TableCell>
                <TableCell className="text-center">{emp.status}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Button size="sm" variant="ghost" className="mr-2" onClick={() => setSelectedEmployee(emp)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handlePermissionUpdate(emp)}>
                      <ShieldCheck className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No employees found.</p>
        )}
      </div>
    </div>
  );

  function handlePermissionUpdate(employee: Employee) {
    console.log('Update permissions for:', employee);
    alert(`Permission update functionality for ${employee.name} goes here.`);
  }
}