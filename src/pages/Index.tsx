
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Index() {
  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F2328]">Edit Profile</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 gap-2">
              <TabsTrigger 
                value="basic"
                className="text-[#1F2328] data-[state=active]:bg-white"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger 
                value="device"
                className="text-[#1F2328] data-[state=active]:bg-white"
              >
                Device Information
              </TabsTrigger>
              <TabsTrigger 
                value="personal"
                className="text-[#1F2328] data-[state=active]:bg-white"
              >
                Personal Information
              </TabsTrigger>
              <TabsTrigger 
                value="official"
                className="text-[#1F2328] data-[state=active]:bg-white"
              >
                Official Information
              </TabsTrigger>
              <TabsTrigger 
                value="social"
                className="text-[#1F2328] data-[state=active]:bg-white"
              >
                Social Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Employee ID</label>
                  <Input defaultValue="171" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Official Name</label>
                  <Input defaultValue="Rakibul Hassan Rakib" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Name</label>
                  <Input defaultValue="Rakibul Hassan Rakib" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Username</label>
                  <Input defaultValue="rakibul" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-mediumtext-[#1F2328]">Email</label>
                  <Input defaultValue="rakibul@orangetoolz.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Phone</label>
                  <Input defaultValue="01968627606" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Designation</label>
                  <Input defaultValue="Jr. Software Engineer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Division</label>
                  <Select defaultValue="technical">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="device" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Official Laptop's Mac</label>
                  <Input defaultValue="40:1C:83:83:40:C8" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Personal Device's Mac</label>
                  <Input />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Gender</label>
                  <Select defaultValue="male">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Religion</label>
                  <Select defaultValue="islam">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="islam">Islam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Birthday</label>
                  <Input type="date" defaultValue="2000-05-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Blood Group</label>
                  <Select defaultValue="o_pos">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="o_pos">O+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Present Address</label>
                  <Textarea defaultValue="Road: 9 House: 485, Mirpur-10, Dhaka" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="official" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">NID</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">TIN</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Bank Name</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Bank Account No</label>
                  <Input />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Website</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Facebook</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Twitter</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">LinkedIn</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Instagram</label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2328]">Github</label>
                  <Input />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" className="text-[#1F2328]">
              Back
            </Button>
            <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}