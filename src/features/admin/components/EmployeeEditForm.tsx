// src/Admin/EmployeeEditForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Employee, Division, Department, SubDepartment, Unit, LineManager } from '@/types';
import { Textarea } from '@/components/ui/textarea'; // Added import for Textarea

interface EmployeeEditFormProps {
  selectedEmployee: Employee;
  profile: Partial<Employee>;
  setProfile: (profile: Partial<Employee>) => void;
  error: string | null;
  divisions: Division[];
  departments: Department[];
  subDepartments: SubDepartment[];
  units: Unit[];
  lineManagers: LineManager[];
  onSave: () => void;
  onCancel: () => void;
  getDivisionTitle: (id: number | null | undefined) => string;
  getDepartmentTitle: (id: number | null | undefined) => string;
  getSubDepartmentTitle: (id: number | null | undefined) => string;
  getUnitTitle: (id: number | null | undefined) => string;
  getLineManagerName: (id: number | null | undefined) => string;
}

export default function EmployeeEditForm({
  selectedEmployee,
  profile,
  setProfile,
  error,
  divisions,
  departments,
  subDepartments,
  units,
  lineManagers,
  onSave,
  onCancel,
  getDivisionTitle,
  getDepartmentTitle,
  getSubDepartmentTitle,
  getUnitTitle,
  getLineManagerName,
}: EmployeeEditFormProps) {
  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-left">Edit Employee Profile</h1>
        <Button
          size="icon"
          onClick={onCancel}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 border-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ArrowLeft className="w-8 h-8 text-white transition-transform duration-200 group-hover:-translate-x-1" />
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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

        <TabsContent value="basic" className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee ID</label>
                <Input value={profile.employee_id?.toString() || ''} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={profile.username || ''}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <Input
                  value={profile.designation || ''}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Personal Email</label>
                <Input
                  value={profile.personal_email || ''}
                  onChange={(e) => setProfile({ ...profile, personal_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select
                  value={profile.gender || ''}
                  onValueChange={(val) => setProfile({ ...profile, gender: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={profile.status || ''}
                  onValueChange={(val) => setProfile({ ...profile, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select
                  value={profile.permission_value?.toString() || '2'}
                  onValueChange={(val) => setProfile({ ...profile, permission_value: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">HR</SelectItem>
                    <SelectItem value="2">TeamLead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Joining Date</label>
                <Input
                  type="date"
                  value={profile.joining_date?.substring(0, 10) || ''}
                  onChange={(e) => setProfile({ ...profile, joining_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Division</label>
                <Select
                  value={profile.division_id?.toString() || 'none'}
                  onValueChange={(val) =>
                    setProfile({ ...profile, division_id: val === 'none' ? null : parseInt(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={profile.division || getDivisionTitle(profile.division_id)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Selected</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.id.toString()}>
                        {division.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={profile.department_id?.toString() || 'none'}
                  onValueChange={(val) =>
                    setProfile({ ...profile, department_id: val === 'none' ? null : parseInt(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={profile.department || getDepartmentTitle(profile.department_id)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Selected</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-Department</label>
                <Select
                  value={profile.sub_department_id?.toString() || 'none'}
                  onValueChange={(val) =>
                    setProfile({ ...profile, sub_department_id: val === 'none' ? null : parseInt(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={profile.sub_department || getSubDepartmentTitle(profile.sub_department_id)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Selected</SelectItem>
                    {subDepartments.map((subDept) => (
                      <SelectItem key={subDept.id} value={subDept.id.toString()}>
                        {subDept.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Select
                  value={profile.unit_id?.toString() || 'none'}
                  onValueChange={(val) =>
                    setProfile({ ...profile, unit_id: val === 'none' ? null : parseInt(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={profile.unit || getUnitTitle(profile.unit_id)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Selected</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Line Manager</label>
                <Select
                  value={profile.line_manager_id?.toString() || 'none'}
                  onValueChange={(val) => {
                    const newValue = val === 'none' ? null : parseInt(val);
                    setProfile({ ...profile, line_manager_id: newValue });
                    console.log('Selected line_manager_id:', newValue);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={getLineManagerName(profile.line_manager_id)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Selected</SelectItem>
                    {lineManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id.toString()}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="device" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Official's Device MAC</label>
              <Input
                value={profile.official_mac || ''}
                onChange={(e) => setProfile({ ...profile, official_mac: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Personal Device MAC</label>
              <Input
                value={profile.personal_mac || ''}
                onChange={(e) => setProfile({ ...profile, personal_mac: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Father’s Name</label>
                <Input
                  value={profile.fathers_name || ''}
                  onChange={(e) => setProfile({ ...profile, fathers_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mother’s Name</label>
                <Input
                  value={profile.mothers_name || ''}
                  onChange={(e) => setProfile({ ...profile, mothers_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Spouse</label>
                <Input
                  value={profile.spouse || ''}
                  onChange={(e) => setProfile({ ...profile, spouse: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Children</label>
                <Input
                  value={profile.children || ''}
                  onChange={(e) => setProfile({ ...profile, children: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select
                  value={profile.gender || ''}
                  onValueChange={(val) => setProfile({ ...profile, gender: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Religion</label>
                <Select
                  value={profile.religion || ''}
                  onValueChange={(val) => setProfile({ ...profile, religion: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Islam">Islam</SelectItem>
                    <SelectItem value="Hinduism">Hinduism</SelectItem>
                    <SelectItem value="Christianity">Christianity</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Birthday</label>
                <Input
                  type="date"
                  value={profile.birthday?.substring(0, 10) || ''}
                  onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Official Birthday</label>
                <Input
                  type="date"
                  value={profile.official_birthday?.substring(0, 10) || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, official_birthday: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Relationship Status</label>
                <Select
                  value={profile.relationship_status || ''}
                  onValueChange={(val) => setProfile({ ...profile, relationship_status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Group</label>
                <Select
                  value={profile.blood_group || ''}
                  onValueChange={(val) => setProfile({ ...profile, blood_group: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Present Address</label>
                <Textarea
                  value={profile.present_address || ''}
                  onChange={(e) => setProfile({ ...profile, present_address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Permanent Address</label>
                <Textarea
                  value={profile.permanent_address || ''}
                  onChange={(e) => setProfile({ ...profile, permanent_address: e.target.value })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="official" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmed</label>
              <Select
                value={profile.confirmed ? 'Yes' : 'No'}
                onValueChange={(val) => setProfile({ ...profile, confirmed: val === 'Yes' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmation Date</label>
              <Input
                type="date"
                value={profile.confirmation_date?.substring(0, 10) || ''}
                onChange={(e) => setProfile({ ...profile, confirmation_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Shift</label>
              <Input
                value={profile.default_shift || ''}
                onChange={(e) => setProfile({ ...profile, default_shift: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="e.g., https://www.johndoe.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook</label>
              <Input
                value={profile.facebook || ''}
                onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                placeholder="e.g., facebook.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter</label>
              <Input
                value={profile.twitter || ''}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                placeholder="e.g., twitter.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn</label>
              <Input
                value={profile.linkedin || ''}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="e.g., linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram</label>
              <Input
                value={profile.instagram || ''}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                placeholder="e.g., instagram.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube</label>
              <Input
                value={profile.youtube || ''}
                onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                placeholder="e.g., youtube.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">TikTok</label>
              <Input
                value={profile.tiktok || ''}
                onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
                placeholder="e.g., tiktok.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GitLab</label>
              <Input
                value={profile.gitlab || ''}
                onChange={(e) => setProfile({ ...profile, gitlab: e.target.value })}
                placeholder="e.g., gitlab.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub</label>
              <Input
                value={profile.github || ''}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="e.g., github.com/johndoe"
              />
            </div>
          </div>
        </TabsContent>

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
                    <Select
                      value={profile.breakfast ? 'Yes' : 'No'}
                      onValueChange={(val) => setProfile({ ...profile, breakfast: val === 'Yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Select
                      value={profile.lunch ? 'Yes' : 'No'}
                      onValueChange={(val) => setProfile({ ...profile, lunch: val === 'Yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Select
                      value={profile.beef ? 'Yes' : 'No'}
                      onValueChange={(val) => setProfile({ ...profile, beef: val === 'Yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Select
                      value={profile.fish ? 'Yes' : 'No'}
                      onValueChange={(val) => setProfile({ ...profile, fish: val === 'Yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Input
                      value={profile.annual_leave_balance?.toString() || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, annual_leave_balance: parseInt(e.target.value) || 0 })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-gray-300 font-semibold">Sick Leave Balance</td>
                  <td className="py-2 px-4 border border-gray-300">
                    <Input
                      value={profile.sick_leave_balance?.toString() || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, sick_leave_balance: parseInt(e.target.value) || 0 })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-gray-300 font-semibold">Casual Leave Balance</td>
                  <td className="py-2 px-4 border border-gray-300">
                    <Input
                      value={profile.casual_leave_balance?.toString() || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, casual_leave_balance: parseInt(e.target.value) || 0 })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Add other TabsContent (personal, official, social, meal, leave) here if needed */}

        <div className="flex items-center gap-4 mt-5">
          <Button onClick={onSave}>Save Profile</Button>
        </div>
      </Tabs>
      <Toaster position="top-center" />
    </div>
  );
}