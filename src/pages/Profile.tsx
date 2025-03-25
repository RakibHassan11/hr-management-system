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
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

function Profile() {
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    division_id: null,
    department_id: null,
    sub_department_id: null,
    unit_id: null,
    line_manager_id: null
  })

  const [categoryOptions, setCategoryOptions] = useState({
    divisions: [],
    departments: [],
    subDepartments: [],
    units: [],
    lines: []
  })

  const [updating, setUpdating] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL
  const token = useSelector((state: RootState) => state.auth.userToken)
  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user)

  // const { permission_value } = useSelector(
  //   (state: RootState) => state.auth.user
  // )
  // const permission =
  //   permission_value === 1
  //     ? "HR"
  //     : permission_value === 2
  //     ? "TEAM LEAD"
  //     : "EMPLOYEE"

  const list_type = "TEAM LEAD"

  let toastId
  useEffect(() => {
    if (!user) {
      toastId = toast("No authorized user provided!")
      return
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const fetchData = async () => {
      try {
        const [
          divisionsRes,
          departmentsRes,
          subDepartmentsRes,
          unitsRes,
          lineRes
        ] = await Promise.all([
          axios.get(`${API_URL}/divisions/list`, config),
          axios.get(`${API_URL}/departments/list`, config),
          axios.get(`${API_URL}/sub-departments/list`, config),
          axios.get(`${API_URL}/units/list`, config),
          axios.get(
            `${API_URL}/employee/employee-list-by-role?permission_value=${list_type}`,
            config
          )
        ])

        const divisions = divisionsRes.data.data.map(division => ({
          id: division.id,
          title: division.title
        }))
        const departments = departmentsRes.data.data.map(department => ({
          id: department.id,
          title: department.title
        }))
        const subDepartments = subDepartmentsRes.data.data.map(subDept => ({
          id: subDept.id,
          title: subDept.title
        }))
        const units = unitsRes.data.data.map(unit => ({
          id: unit.id,
          title: unit.title
        }))
        const lines = lineRes.data.data.map(line => ({
          id: line.id,
          name: line.name
        }))

        setCategoryOptions({
          divisions,
          departments,
          subDepartments,
          units,
          lines
        })

        setFormData(prevData => ({
          ...prevData,
          ...user,
          division_id: user.division_id || null,
          department_id: user.department_id || null,
          sub_department_id: user.sub_department_id || null,
          unit_id: user.unit_id || null,
          line_manager_id: user.line_manager_id || null
        }))

        setEmployee(user)
      } catch (err) {
        setEmployee([])
        toast.error("Error fetching profile: " + err.message), { id: toastId }
      }
    }

    fetchData()
  }, [API_URL, token])

  const getDiff = (original, updated) => {
    const diff = {}
    Object.keys(updated).forEach(key => {
      if (updated[key] !== original[key]) {
        diff[key] = updated[key]
      }
    })
    return diff
  }

  const handleSaveProfile = async () => {
    const updatedFields = getDiff(employee, formData)
    if (Object.keys(updatedFields).length === 0) {
      toastId = toast("No changes made!")
      return
    }
    try {
      setUpdating(true)
      toastId = toast.loading("Updating user profile...")
      const response = await fetch(`${API_URL}/employee/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      })
      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      const data = await response.json()
      toast.success(data.message, { id: toastId })

      const updatedEmployee = { ...employee, ...updatedFields }
      setEmployee(updatedEmployee)
      setFormData(prevData => ({
        ...prevData,
        ...updatedEmployee
      }))

      const currentUserInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")!)
        : {}
      const updatedUserInfo = { ...currentUserInfo, ...updatedFields }
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
    } catch (err) {
      setEmployee([])
      toast.error("Error updating profile: " + err.message, { id: toastId })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Fragment>
      {employee !== null ? (
        <div className="animate-fadeIn">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1F2328]">User Profile</h1>
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
                {/* <TabsTrigger
                  value="device"
                  className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
                >
                  Device
                </TabsTrigger> */}
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
                {/* <TabsTrigger
                  value="leave"
                  className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
                >
                  Leave
                </TabsTrigger> */}
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
                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Username
                      </label>
                      <Input
                        value={formData?.username || ""}
                        onChange={e =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </div> */}
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
                        value={formData.line_manager_id || ""}
                        onValueChange={value => {
                          setFormData(prevData => ({
                            ...prevData,
                            line_manager_id: value
                          }))
                        }}
                        disabled
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select manager id --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {categoryOptions.lines?.map(manager => (
                            <SelectItem key={manager.id} value={manager.id}>
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
                          {categoryOptions.departments.map(department => (
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
                      <Input
                        value={formData?.confirmed || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            confirmed: e.target.value
                          })
                        }
                        readOnly
                      />
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
                          {categoryOptions.units.map(unit => (
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
                        value={Number(formData?.id) + 1000 || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            employee_id: e.target.value
                          })
                        }
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
                          {categoryOptions.divisions.map(division => (
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
                          {categoryOptions.subDepartments.map(subDepartment => (
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
                        Default Shift
                      </label>
                      <Input
                        value={formData?.default_shift || ""}
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
                      <Input
                        value={formData?.emp_type || ""}
                        onChange={e =>
                          setFormData({ ...formData, emp_type: e.target.value })
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* <TabsContent value="device" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Official Laptop's Mac
                    </label>
                    <Input defaultValue="40:1C:83:83:40:C8(N/A)" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Personal Device's Mac
                    </label>
                    <Input defaultValue="40:1C:83:83:40:C8(N/A)" />
                  </div>
                </div>
              </TabsContent> */}

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Father’s Name
                      </label>
                      <Input
                        value={formData?.fathers_name || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            fathers_name: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Gender
                      </label>
                      <Select
                        value={formData?.gender || ""}
                        onValueChange={value =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Gender --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Birthday
                      </label>
                      <Input
                        type="date"
                        value={
                          formData?.birthday
                            ? formData.birthday.split("T")[0]
                            : ""
                        }
                        onChange={e =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Present Address
                      </label>
                      <Textarea
                        value={formData?.present_address || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            present_address: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Relationship Status
                      </label>
                      <Select
                        value={formData?.relationship_status || ""}
                        onValueChange={value =>
                          setFormData({
                            ...formData,
                            relationship_status: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Status --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Mother’s Name
                      </label>
                      <Input
                        value={formData?.mothers_name || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            mothers_name: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Religion
                      </label>
                      <Select
                        value={formData?.religion || ""}
                        onValueChange={value =>
                          setFormData({ ...formData, religion: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Religion --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          <SelectItem value="islam">Islam</SelectItem>
                          <SelectItem value="hinduism">Hinduism</SelectItem>
                          <SelectItem value="christianity">
                            Christianity
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Official Birthday
                      </label>
                      <Input
                        type="date"
                        value={
                          formData?.official_birthday
                            ? formData.official_birthday.split("T")[0]
                            : ""
                        }
                        onChange={e =>
                          setFormData({
                            ...formData,
                            official_birthday: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Permanent Address
                      </label>
                      <Textarea
                        value={formData?.permanent_address || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            permanent_address: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Blood Group
                      </label>
                      <Select
                        value={formData?.blood_group || ""}
                        onValueChange={value =>
                          setFormData({ ...formData, blood_group: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Blood Group --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
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
                </div>
              </TabsContent>

              <TabsContent value="official" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        NID
                      </label>
                      <Input
                        value={formData?.nid || ""}
                        onChange={e =>
                          setFormData({ ...formData, nid: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Skype [Official]
                      </label>
                      <Input
                        value={formData?.skype || ""}
                        onChange={e =>
                          setFormData({ ...formData, skype: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        GitHub [Official]
                      </label>
                      <Input
                        value={formData?.github || ""}
                        onChange={e =>
                          setFormData({ ...formData, github: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Bank Name
                      </label>
                      <Input
                        value={formData?.bank_name || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            bank_name: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        TIN
                      </label>
                      <Input
                        value={formData?.tin || ""}
                        onChange={e =>
                          setFormData({ ...formData, tin: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Gmail [Official]
                      </label>
                      <Input
                        value={formData?.official_gmail || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            official_gmail: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Bank Account No
                      </label>
                      <Input
                        value={formData?.bank_account_no || ""}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            bank_account_no: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        GitLab [Official]
                      </label>
                      <Input
                        value={formData?.gitlab || ""}
                        onChange={e =>
                          setFormData({ ...formData, gitlab: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Website
                    </label>
                    <Input
                      value={formData?.website || ""}
                      onChange={e =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Facebook
                    </label>
                    <Input
                      value={formData?.facebook || ""}
                      onChange={e =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Twitter
                    </label>
                    <Input
                      value={formData?.twitter || ""}
                      onChange={e =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      LinkedIn
                    </label>
                    <Input
                      value={formData?.linkedin || ""}
                      onChange={e =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Instagram
                    </label>
                    <Input
                      value={formData?.instagram || ""}
                      onChange={e =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Github
                    </label>
                    <Input
                      value={formData?.github || ""}
                      onChange={e =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* <TabsContent value="leave" className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border border-gray-300">
                          Leave Type
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Available
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Annual Leave Balance", value: "0.00 (0.00)" },
                        { label: "Sick Leave Balance", value: "0.00 (0.00)" },
                        { label: "Casual Leave Balance", value: "0.00 (0.00)" }
                      ].map(leave => (
                        <tr key={leave.label}>
                          <td className="py-2 px-4 border border-gray-300 font-semibold">
                            {leave.label}
                          </td>
                          <td className="py-2 px-4 border border-gray-300">
                            {leave.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent> */}

              {/* <TabsContent value="meal" className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border border-gray-300">
                          Meal Type
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Subscribed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          label: "Breakfast",
                          value: formData?.breakfast === 1 ? "Yes" : "No"
                        },
                        {
                          label: "Lunch",
                          value: formData?.lunch === 1 ? "Yes" : "No"
                        },
                        {
                          label: "Beef",
                          value: formData?.beef === 1 ? "Yes" : "No"
                        },
                        {
                          label: "Fish",
                          value: formData?.fish === 1 ? "Yes" : "No"
                        }
                      ].map(meal => (
                        <tr key={meal.label}>
                          <td className="py-2 px-4 border border-gray-300 font-semibold">
                            {meal.label}
                          </td>
                          <td className="py-2 px-4 border border-gray-300">
                            {meal.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent> */}
              <TabsContent value="meal" className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Breakfast", key: "breakfast" },
                      { label: "Lunch", key: "lunch" },
                      { label: "Beef", key: "beef" },
                      { label: "Fish", key: "fish" }
                    ].map(meal => (
                      <div key={meal.key} className="space-y-2">
                        <label className="text-sm font-medium text-[#1F2328] block">
                          {meal.label}
                        </label>
                        <Select
                          value={formData?.[meal.key] === 1 ? "Yes" : "No"}
                          onValueChange={value =>
                            setFormData({
                              ...formData,
                              [meal.key]: value === "Yes" ? 1 : 0
                            })
                          }
                        >
                          <SelectTrigger className="w-full border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <SelectValue
                              placeholder={`-- Select ${meal.label} --`}
                            />
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
              <Button disabled={updating} onClick={handleSaveProfile}>
                {updating ? "Saving Profile.." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading profile...</p>
      )}
    </Fragment>
  )
}

export default Profile
