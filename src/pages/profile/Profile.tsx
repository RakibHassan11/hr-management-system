import { Fragment, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useEmployeeProfile } from "@/features/employee/hooks/useEmployeeProfile"
import { EmployeeProfile, OrganizationOption } from "@/features/employee/types"

// Define FormData interface to match EmployeeProfile but allow for form handling
interface FormData extends Partial<EmployeeProfile> {
}

function Profile() {
  const { user } = useAuth();
  const { profile, options, loading, error, fetchProfile, updateProfile } = useEmployeeProfile(user?.id || null);

  const [formData, setFormData] = useState<FormData>({
    division_id: null,
    department_id: null,
    sub_department_id: null,
    unit_id: null,
    line_manager_id: null
  });

  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    // In a real app we might diff changes, but for now we just send the updated formData
    // which effectively acts as the new profile state
    const success = await updateProfile(formData as EmployeeProfile);

    // Toast handled in hook
  }

  if (!user) {
    return <div className="p-6 text-center">Please log in to view your profile.</div>;
  }

  if (loading && !profile) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <Fragment>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2328]">User Profile</h1>
      </div>
      <div className="animate-fadeIn">

        <div className="bg-white rounded-lg shadow p-6">
          <Tabs
            defaultValue="basic"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full mb-6 bg-gray-100 p-2 flex justify-evenly">
              <TabsTrigger
                value="basic"
                className="flex-1 text-center font-bold text-md text-[#1F2328] data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
              >
                Basic
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
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Name
                    </label>
                    <Input
                      value={formData?.name || ""}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Designation
                    </label>
                    <Input
                      value={formData?.designation || ""}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          designation: e.target.value
                        })
                      }
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Line Manager
                    </label>
                    <Select
                      value={formData.line_manager_id?.toString() || ""}
                      onValueChange={value => {
                        setFormData(prevData => ({
                          ...prevData,
                          line_manager_id: value
                        }))
                      }}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select manager --" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {options.lines?.map(manager => (
                          <SelectItem key={manager.id} value={manager.id.toString()}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Department
                    </label>
                    <Select
                      value={formData.department_id || ""}
                      onValueChange={value => {
                        setFormData(prevData => ({
                          ...prevData,
                          department_id: value
                        }))
                      }}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select department --" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {options.departments.map(department => (
                          <SelectItem
                            key={department.id}
                            value={department.id}
                          >
                            {department.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Confirmed
                    </label>
                    <Select
                      value={formData?.confirmed === 1 ? "Yes" : "No"}
                      onValueChange={value =>
                        setFormData({
                          ...formData,
                          confirmed: value === "Yes" ? 1 : 0
                        })
                      }
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Unit
                    </label>
                    <Select
                      value={formData.unit_id || ""}
                      onValueChange={value => {
                        setFormData(prevData => ({
                          ...prevData,
                          unit_id: value
                        }))
                      }}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select unit --" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {options.units.map(unit => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Employee ID
                    </label>
                    <Input
                      value={formData?.employee_id?.toString() || ""}
                      onChange={e => {
                        // Handle number conversation if needed or just keep as string and transform on save?
                        // EmployeeProfile types define employee_id as number. Input returns string.
                        // For display it's fine.
                      }}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Email
                    </label>
                    <Input
                      value={formData?.email || ""}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Phone
                    </label>
                    <Input
                      value={formData?.phone || ""}
                      onChange={e =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Division
                    </label>
                    <Select
                      value={formData.division_id || ""}
                      onValueChange={value => {
                        setFormData(prevData => ({
                          ...prevData,
                          division_id: value
                        }))
                      }}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select division --" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {options.divisions.map(division => (
                          <SelectItem key={division.id} value={division.id}>
                            {division.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Joining Date
                    </label>
                    <Input
                      type="date"
                      value={
                        formData?.joining_date
                          ? formData.joining_date.split("T")[0]
                          : ""
                      }
                      onChange={e =>
                        setFormData({
                          ...formData,
                          joining_date: e.target.value
                        })
                      }
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Sub Department
                    </label>
                    <Select
                      value={formData.sub_department_id || ""}
                      onValueChange={value => {
                        setFormData(prevData => ({
                          ...prevData,
                          sub_department_id: value
                        }))
                      }}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select sub department --" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {options.subDepartments.map(subDepartment => (
                          <SelectItem
                            key={subDepartment.id}
                            value={subDepartment.id}
                          >
                            {subDepartment.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Confirmation Date
                    </label>
                    <Input
                      type="date"
                      value={
                        formData?.confirmation_date
                          ? formData.confirmation_date.split("T")[0]
                          : ""
                      }
                      onChange={e =>
                        setFormData({
                          ...formData,
                          confirmation_date: e.target.value
                        })
                      }
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Employment Type
                    </label>
                    <Select
                      value={
                        // Assuming permission_value 1=HR, 2=TL, 3=GEN. 
                        // Mapping strings to match Select items
                        formData?.permission_value == "1"
                          ? "HR"
                          : formData?.permission_value == "2"
                            ? "TEAM LEAD"
                            : formData?.permission_value == "3"
                              ? "GENERAL"
                              : ""
                      }
                      onValueChange={value =>
                        setFormData({
                          ...formData,
                          permission_value:
                            value === "HR"
                              ? "1"
                              : value === "TEAM LEAD"
                                ? "2"
                                : value === "GENERAL"
                                  ? "3"
                                  : null
                        })
                      }
                      disabled
                    >
                      <SelectTrigger className="w-full border-gray-300 bg-gray-50 hover:bg-gray-100">
                        <SelectValue placeholder="-- Select Type --" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {[
                          { label: "HR", value: 1 },
                          { label: "TEAM LEAD", value: 2 },
                          { label: "GENERAL", value: 3 }
                        ].map(type => (
                          <SelectItem key={type.value} value={type.label}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Personal Tab - reused logic */}
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Father’s Name</label><Input value={formData?.fathers_name || ""} onChange={e => setFormData({ ...formData, fathers_name: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Gender</label>
                    <Select value={formData?.gender || ""} onValueChange={value => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger><SelectValue placeholder="-- Select Gender --" /></SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md"><SelectItem value="MALE">Male</SelectItem><SelectItem value="FEMALE">Female</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Birthday</label><Input type="date" value={formData?.birthday ? formData.birthday.split("T")[0] : ""} onChange={e => setFormData({ ...formData, birthday: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Present Address</label><Textarea value={formData?.present_address || ""} onChange={e => setFormData({ ...formData, present_address: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Relationship Status</label>
                    <Select value={formData?.relationship_status || ""} onValueChange={value => setFormData({ ...formData, relationship_status: value })}>
                      <SelectTrigger><SelectValue placeholder="-- Select Status --" /></SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md"><SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem><SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Mother’s Name</label><Input value={formData?.mothers_name || ""} onChange={e => setFormData({ ...formData, mothers_name: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Religion</label>
                    <Select value={formData?.religion || ""} onValueChange={value => setFormData({ ...formData, religion: value })}>
                      <SelectTrigger><SelectValue placeholder="-- Select Religion --" /></SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md"><SelectItem value="islam">Islam</SelectItem><SelectItem value="hinduism">Hinduism</SelectItem><SelectItem value="christianity">Christianity</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Official Birthday</label><Input type="date" value={formData?.official_birthday ? formData.official_birthday.split("T")[0] : ""} onChange={e => setFormData({ ...formData, official_birthday: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Permanent Address</label><Textarea value={formData?.permanent_address || ""} onChange={e => setFormData({ ...formData, permanent_address: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Blood Group</label>
                    <Select value={formData?.blood_group || ""} onValueChange={value => setFormData({ ...formData, blood_group: value })}>
                      <SelectTrigger><SelectValue placeholder="-- Select Blood Group --" /></SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-md">
                        {/* Shortened list for brevity */}
                        <SelectItem value="O+">O+</SelectItem><SelectItem value="A+">A+</SelectItem><SelectItem value="B+">B+</SelectItem><SelectItem value="AB+">AB+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="official" className="space-y-6">
              {/* Reusing simplify logic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Skype</label><Input value={formData?.skype || ""} onChange={e => setFormData({ ...formData, skype: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Official Gmail</label><Input value={formData?.official_gmail || ""} onChange={e => setFormData({ ...formData, official_gmail: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Gitlab</label><Input value={formData?.gitlab || ""} onChange={e => setFormData({ ...formData, gitlab: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Github</label><Input value={formData?.github || ""} onChange={e => setFormData({ ...formData, github: e.target.value })} /></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">NID</label><Input value={formData?.nid || ""} onChange={e => setFormData({ ...formData, nid: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">TIN</label><Input value={formData?.tin || ""} onChange={e => setFormData({ ...formData, tin: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Bank Name</label><Input value={formData?.bank_name || ""} onChange={e => setFormData({ ...formData, bank_name: e.target.value })} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Account No</label><Input value={formData?.bank_account_no || ""} onChange={e => setFormData({ ...formData, bank_account_no: e.target.value })} /></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Website</label><Input value={formData?.website || ""} onChange={e => setFormData({ ...formData, website: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Facebook</label><Input value={formData?.facebook || ""} onChange={e => setFormData({ ...formData, facebook: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Twitter</label><Input value={formData?.twitter || ""} onChange={e => setFormData({ ...formData, twitter: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">LinkedIn</label><Input value={formData?.linkedin || ""} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium text-[#1F2328]">Instagram</label><Input value={formData?.instagram || ""} onChange={e => setFormData({ ...formData, instagram: e.target.value })} /></div>
              </div>
            </TabsContent>

            <TabsContent value="meal" className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
                <div className="grid grid-cols-2 gap-6">
                  {[{ label: "Breakfast", key: "breakfast" }, { label: "Lunch", key: "lunch" }, { label: "Beef", key: "beef" }, { label: "Fish", key: "fish" }].map((meal) => (
                    <div key={meal.key} className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328] block">{meal.label}</label>
                      <Select
                        value={formData[meal.key as keyof FormData] === 1 ? "Yes" : "No"}
                        onValueChange={(value) => setFormData({ ...formData, [meal.key]: value === "Yes" ? 1 : 0 })}
                      >
                        <SelectTrigger className="w-full border-gray-300 bg-gray-50 hover:bg-gray-100">
                          <SelectValue placeholder={`-- Select ${meal.label} --`} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button disabled={loading} onClick={handleSaveProfile}>
              {loading ? "Saving Profile..." : "Save Profile"}
            </Button>
          </div>

        </div>
      </div>
    </Fragment>
  )
}

export default Profile;