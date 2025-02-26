
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  return (
    <Layout>
      <div className="animate-fadeIn ">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F2328]">Profile Information</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full mb-6 bg-gray-100 p-2 flex justify-evenly">
            <TabsTrigger 
                value="basic"
                className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Basic 
            </TabsTrigger>

            <TabsTrigger 
                value="device"
                className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Device 
            </TabsTrigger>

            <TabsTrigger 
                value="personal"
                className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Personal 
            </TabsTrigger>

            <TabsTrigger 
                value="official"
                className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Official 
            </TabsTrigger>

            <TabsTrigger 
                value="social"
                className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Social 
            </TabsTrigger>

            <TabsTrigger 
                value="meal"
                className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Meal 
            </TabsTrigger>

            <TabsTrigger 
                value="leave"
                className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
            >
                Leave 
            </TabsTrigger>
            </TabsList>


            <TabsContent value="basic" className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Employee ID</label>
        <Input defaultValue="171" readOnly className="bg-gray-50" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Name</label>
        <Input defaultValue="Rakibul Hassan Rakib" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Username</label>
        <Input defaultValue="rakibul" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Email</label>
        <Input defaultValue="rakibul@orangetoolz.com" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Phone</label>
        <Input defaultValue="01968627606" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Designation</label>
        <Input defaultValue="Jr. Software Engineer" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Division</label>
        <Input defaultValue="Technical" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Department</label>
        <Input defaultValue="Development" readOnly />
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Sub Department</label>
        <Input defaultValue="Software Development" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Unit</label>
        <Input defaultValue="JavaScript Stack" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Line Manager</label>
        <Input defaultValue="Sneshasish Sarker" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Joining Date</label>
        <Input defaultValue="2025-02-17" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Confirmed</label>
        <Input defaultValue="No" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Confirmation Date</label>
        <Input defaultValue="0000-00-00" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Default Shift</label>
        <Input defaultValue="General Shift - (10:00-19:00)" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Employment Type</label>
        <Input defaultValue="Full-time" readOnly />
      </div>
    </div>
  </div>
            </TabsContent>



            <TabsContent value="device" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Official Laptop's Mac</label>
                  <Input defaultValue="40:1C:83:83:40:C8" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Personal Device's Mac</label>
                  <Input />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Gender</label>
        <Select defaultValue="male">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white border-gray-300 shadow-md'>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Religion</label>
        <Select defaultValue="islam">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white border-gray-300 shadow-md'>
            <SelectItem value="islam">Islam</SelectItem>
            <SelectItem value="hinduism">Hinduism</SelectItem>
            <SelectItem value="christianity">Christianity</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Birthday</label>
        <Input type="date" defaultValue="2000-05-11" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Official Birthday</label>
        <Input type="date" defaultValue="2000-05-11" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Blood Group</label>
        <Select defaultValue="o_pos">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white border-gray-300 shadow-md'>
            <SelectItem value="o_pos">O+</SelectItem>
            <SelectItem value="a_pos">A+</SelectItem>
            <SelectItem value="b_pos">B+</SelectItem>
            <SelectItem value="ab_pos">AB+</SelectItem>
            <SelectItem value="o_neg">O-</SelectItem>
            <SelectItem value="a_neg">A-</SelectItem>
            <SelectItem value="b_neg">B-</SelectItem>
            <SelectItem value="ab_neg">AB-</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Father’s Name</label>
        <Input defaultValue="Md. Mofiz Uddin Fakir" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Mother’s Name</label>
        <Input defaultValue="Umme Sara" readOnly />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Relationship Status</label>
        <Select defaultValue="single">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white border-gray-300 shadow-md'>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Present Address</label>
        <Textarea defaultValue="Road: 9 House: 485, Mirpur-10, Dhaka" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Permanent Address</label>
        <Textarea defaultValue="Purbadhala, Netrokona" />
      </div>
    </div>
  </div>
            </TabsContent>


            <TabsContent value="official" className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Skype [Official]</label>
        <Input placeholder="Enter Skype ID" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Gmail [Official]</label>
        <Input placeholder="Enter Gmail ID" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">GitLab [Official]</label>
        <Input placeholder="Enter GitLab ID" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">GitHub [Official]</label>
        <Input placeholder="Enter GitHub ID" />
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">NID</label>
        <Input placeholder="Enter NID" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">TIN</label>
        <Input placeholder="Enter TIN" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Bank Name</label>
        <Input placeholder="Enter Bank Name" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1F2328]">Bank Account No</label>
        <Input placeholder="Enter Bank Account Number" />
      </div>
    </div>
  </div>
            </TabsContent>


            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Website</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Facebook</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Twitter</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">LinkedIn</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Instagram</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Github</label>
                  <Input />
                </div>
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
                    {[
                      { label: 'Annual Leave Balance', value: '0.00 (0.00)' },
                      { label: 'Sick Leave Balance', value: '0.00 (0.00)' },
                      { label: 'Casual Leave Balance', value: '0.00 (0.00)' },
                    ].map((leave) => (
                      <tr key={leave.label}>
                        <td className="py-2 px-4 border border-gray-300 font-semibold">{leave.label}</td>
                        <td className="py-2 px-4 border border-gray-300">{leave.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    {[
                      { label: 'Breakfast', value: 'Yes' },
                      { label: 'Lunch', value: 'Yes' },
                      { label: 'Beef', value: 'Yes' },
                      { label: 'Fish', value: 'Yes' },
                    ].map((meal) => (
                      <tr key={meal.label}>
                        <td className="py-2 px-4 border border-gray-300 font-semibold">{meal.label}</td>
                        <td className="py-2 px-4 border border-gray-300">{meal.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button >
              Edit
            </Button>
            <Button>
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}