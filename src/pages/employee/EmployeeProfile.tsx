import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/axiosConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

// Define FormData interface for employee profile data
interface FormData {
  division_id: string | null;
  department_id: string | null;
  sub_department_id: string | null;
  unit_id: string | null;
  line_manager_id: string | null;
  employee_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  joining_date?: string;
  confirmed?: number;
  confirmation_date?: string;
  permission_value?: string | null;
  gender?: string;
  religion?: string;
  birthday?: string;
  official_birthday?: string;
  blood_group?: string;
  fathers_name?: string;
  mothers_name?: string;
  relationship_status?: string;
  present_address?: string;
  permanent_address?: string;
  skype?: string;
  official_gmail?: string;
  gitlab?: string;
  github?: string;
  nid?: string;
  tin?: string;
  bank_name?: string;
  bank_account_no?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  breakfast: number;
  lunch: number;
  beef: number;
  fish: number;
  id?: number;
}

// Define LeaveFormData interface for leave balance data
interface LeaveFormData {
  annual_leave_balance: string | null;
  sick_leave_balance: string | null;
}

// Define CategoryOptions interface for API response data
interface CategoryOptions {
  divisions: { id: string; title: string }[];
  departments: { id: string; title: string }[];
  subDepartments: { id: string; title: string }[];
  units: { id: string; title: string }[];
  lines: { id: number; name: string }[];
}

function EmployeeProfile() {
  const [employee, setEmployee] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    division_id: null,
    department_id: null,
    sub_department_id: null,
    unit_id: null,
    line_manager_id: null,
    breakfast: 0,
    lunch: 0,
    beef: 0,
    fish: 0,
  });

  const [leaveFormData, setLeaveFormData] = useState<LeaveFormData>({
    annual_leave_balance: null,
    sick_leave_balance: null,
  });

  // Track edited fields and their validity
  const [editedFields, setEditedFields] = useState<{
    annual_leave_balance: boolean;
    sick_leave_balance: boolean;
  }>({
    annual_leave_balance: false,
    sick_leave_balance: false,
  });

  // Track input values and validity
  const [inputValues, setInputValues] = useState<{
    annual_leave_balance: string;
    sick_leave_balance: string;
  }>({
    annual_leave_balance: "",
    sick_leave_balance: "",
  });

  const [inputValidity, setInputValidity] = useState<{
    annual_leave_balance: boolean;
    sick_leave_balance: boolean;
  }>({
    annual_leave_balance: true,
    sick_leave_balance: true,
  });

  const [categoryOptions, setCategoryOptions] = useState<CategoryOptions>({
    divisions: [],
    departments: [],
    subDepartments: [],
    units: [],
    lines: [],
  });
  const [updating, setUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);
  const { permission_value } = useSelector(
    (state: RootState) => state.auth.user || {}
  ) as { permission_value?: number };
  const [activeTab, setActiveTab] = useState("basic");
  const list_type = "TEAM LEAD";

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const idFromUrl = queryParams.get("id");

  // Function to get employee ID dynamically from response or URL
  const getEmployeeId = (): number | null => {
    const id = employee?.id || Number(idFromUrl);
    return isNaN(id) ? null : id;
  };

  useEffect(() => {
    if (!token) {
      toast.error("No authorized user provided!");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const fetchData = async () => {
      try {
        const [
          divisionsRes,
          departmentsRes,
          subDepartmentsRes,
          unitsRes,
          lineRes,
          profileRes,
        ] = await Promise.all([
          api.get(`${API_URL}/divisions/list`, config),
          api.get(`${API_URL}/divisions/list`, config),
          api.get(`${API_URL}/sub-departments/list`, config),
          api.get(`${API_URL}/units/list`, config),
          api.get(
            `${API_URL}/employee/employee-list-by-role?permission_value=${list_type}&perPage=20`,
            config
          ),
          api.get(
            `${API_URL}/employee/my-profile?id=${idFromUrl || ""}`,
            config
          ),
        ]);

        const divisions = divisionsRes.data.data.map((division: any) => ({
          id: division.id.toString(),
          title: division.title,
        }));
        const departments = departmentsRes.data.data.map((department: any) => ({
          id: department.id.toString(),
          title: department.title,
        }));
        const subDepartments = subDepartmentsRes.data.data.map(
          (subDept: any) => ({
            id: subDept.id.toString(),
            title: subDept.title,
          })
        );
        const units = unitsRes.data.data.map((unit: any) => ({
          id: unit.id.toString(),
          title: unit.title,
        }));
        const lines = lineRes.data.data.map((line: any) => ({
          id: Number(line.id),
          name: line.name,
        }));

        setCategoryOptions({
          divisions,
          departments,
          subDepartments,
          units,
          lines,
        });

        const profileData = profileRes.data.data;
        setFormData((prevData) => ({
          ...prevData,
          ...profileData,
          division_id: profileData.division_id?.toString() || null,
          department_id: profileData.department_id?.toString() || null,
          sub_department_id: profileData.sub_department_id?.toString() || null,
          unit_id: profileData.unit_id?.toString() || null,
          line_manager_id: profileData.line_manager_id?.toString() || null,
          id: profileData.id,
        }));
        setEmployee(profileData);
      } catch (err) {
        setEmployee(null);
        toast.error("Error fetching data: " + (err as Error).message);
      }
    };

    const fetchLeaveBalances = async () => {
      const employeeId = getEmployeeId();
      if (!employeeId) {
        toast.error("Invalid or missing employee ID for leave balance!");
        return;
      }

      try {
        const response = await api.get(
          `${API_URL}/employee/employee-leave-balance-by-id?id=${employeeId}`,
          config
        );
        const result = response.data;
        if (result.success && result.data) {
          const apiData = result.data;
          setLeaveFormData({
            annual_leave_balance: apiData.annual_leave_balance?.toString() || "0",
            sick_leave_balance: apiData.sick_leave_balance?.toString() || "0",
          });
        } else {
          setLeaveFormData({
            annual_leave_balance: "0",
            sick_leave_balance: "0",
          });
          toast.error("No leave balance data found.");
        }
      } catch (error: any) {
        console.error("Leave balance fetch error:", error);
        setLeaveFormData({
          annual_leave_balance: "0",
          sick_leave_balance: "0",
        });
        toast.error(
          error.response?.data?.message || "Failed to fetch leave balances."
        );
      }
    };

    fetchData();
    fetchLeaveBalances();
  }, [API_URL, token, idFromUrl]);

  const getDiff = (original: FormData | null, updated: FormData): Record<string, any> => {
    const diff: Record<string, any> = {};
    if (!original) return updated;
    Object.keys(updated).forEach((key) => {
      if (updated[key as keyof FormData] !== original[key as keyof FormData]) {
        diff[key] = updated[key as keyof FormData];
      }
    });
    return diff;
  };

  const handleSaveProfile = async () => {
    const updatedFields = getDiff(employee, formData);
    if (Object.keys(updatedFields).length === 0) {
      toast("No changes made!");
      return;
    }

    // Convert string IDs to numbers for API request
    const req_body = {
      ...updatedFields,
      id: employee?.id || Number(idFromUrl),
      division_id: updatedFields.division_id ? Number(updatedFields.division_id) : undefined,
      department_id: updatedFields.department_id ? Number(updatedFields.department_id) : undefined,
      sub_department_id: updatedFields.sub_department_id ? Number(updatedFields.sub_department_id) : undefined,
      unit_id: updatedFields.unit_id ? Number(updatedFields.unit_id) : undefined,
      line_manager_id: updatedFields.line_manager_id ? Number(updatedFields.line_manager_id) : undefined,
      breakfast: formData.breakfast === 1,
      lunch: formData.lunch === 1,
      beef: formData.beef === 1,
      fish: formData.fish === 1,
    };

    // Remove undefined fields to avoid sending them in the request
    Object.keys(req_body).forEach((key) => {
      if (req_body[key] === undefined) {
        delete req_body[key];
      }
    });

    try {
      setUpdating(true);
      const toastId = toast.loading("Saving profile...");
      const response = await api.put(
        `${API_URL}/employee/update-profile-by-id`,
        req_body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      toast.success(data.message, { id: toastId });
      const updatedEmployee = { ...employee, ...updatedFields } as FormData;
      setEmployee(updatedEmployee);
      setFormData((prevData) => ({
        ...prevData,
        ...updatedEmployee,
      }));
    } catch (err: any) {
      setEmployee(null);
      const errorMessage =
        Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(", ")
          : err.response?.data?.message || "Error updating profile";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  const validateInput = (value: string): boolean => {
    return value !== "" && !isNaN(+value) && +value >= 0;
  };

  const handleInputChange = (field: keyof LeaveFormData, value: string) => {
    // Allow only numeric values float and int
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setInputValues((prev) => ({ ...prev, [field]: value }));
    const isValid = validateInput(value);
    setInputValidity((prev) => ({ ...prev, [field]: isValid }));

    // Mark as edited only if the value differs from leaveFormData
    const originalValue = leaveFormData[field] || "0";
    setEditedFields((prev) => ({
      ...prev,
      [field]: value !== originalValue,
    }));
  };

  const handleFocus = (field: keyof LeaveFormData) => {
    if (permission_value === 2 || permission_value === 3) return;
    const currentValue = leaveFormData[field] || "0";
    setInputValues((prev) => ({ ...prev, [field]: currentValue }));
    setInputValidity((prev) => ({ ...prev, [field]: true }));
  };

  const handleSaveLeave = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      toast.error("Invalid or missing employee ID!");
      return;
    }

    // Build request body with only edited fields
    const req_body: { id: number; [key: string]: any } = { id: employeeId };

    if (editedFields.annual_leave_balance) {
      const annualLeave = inputValues.annual_leave_balance;
      if (!validateInput(annualLeave)) {
        toast.error("Please provide a valid non-negative annual leave balance!");
        return;
      }
      req_body.annual_leave_balance = Number(annualLeave);
    }

    if (editedFields.sick_leave_balance) {
      const sickLeave = inputValues.sick_leave_balance;
      if (!validateInput(sickLeave)) {
        toast.error("Please provide a valid non-negative sick leave balance!");
        return;
      }
      req_body.sick_leave_balance = Number(sickLeave);
    }

    if (!editedFields.annual_leave_balance && !editedFields.sick_leave_balance) {
      toast("No leave balance changes made!");
      return;
    }

    try {
      setUpdating(true);
      const toastId = toast.loading("Updating leave balances...");
      const response = await api.put(
        `${API_URL}/employee/update-employee-leave-balance?id=${employeeId}`,
        req_body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (!data.success || !data.data) {
        throw new Error(data.message || "Invalid API response");
      }

      toast.success(data.message || "Leave balances updated successfully", {
        id: toastId,
      });

      // Update leaveFormData with API response
      setLeaveFormData({
        annual_leave_balance:
          editedFields.annual_leave_balance
            ? data.data.annual_leave_balance?.toString()
            : leaveFormData.annual_leave_balance || "0",
        sick_leave_balance:
          editedFields.sick_leave_balance
            ? data.data.sick_leave_balance?.toString()
            : leaveFormData.sick_leave_balance || "0",
      });

      // Reset input values and edited fields
      setInputValues({
        annual_leave_balance: "",
        sick_leave_balance: "",
      });
      setEditedFields({
        annual_leave_balance: false,
        sick_leave_balance: false,
      });
      setInputValidity({
        annual_leave_balance: true,
        sick_leave_balance: true,
      });
    } catch (err: any) {
      const errorMessage =
        Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(", ")
          : err.response?.data?.message ||
            err.message ||
            "Failed to update leave balances";
      toast.error(errorMessage);
      if (err.response?.status === 404) {
        toast.error("No existing leave balance record found. Contact HR to create one.");
      }
    } finally {
      setUpdating(false);
    }
  };

  // Determine if Save Leave button should be disabled
  const isSaveLeaveDisabled =
    updating ||
    permission_value === 2 ||
    permission_value === 3 ||
    (!editedFields.annual_leave_balance && !editedFields.sick_leave_balance) ||
    (editedFields.annual_leave_balance && !inputValidity.annual_leave_balance) ||
    (editedFields.sick_leave_balance && !inputValidity.sick_leave_balance);

  return (
    <Fragment>
      {employee !== null ? (
        <div className="animate-fadeIn">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1F2328]">
              Update Employee Profile
            </h1>
          </div>

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
                <TabsTrigger
                  value="leave"
                  className="flex-1 text-center text-[#1F2328] font-bold text-md data-[state=active]:text-white data-[state=active]:bg-[#EA580C]"
                >
                  Leave
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Employee ID
                      </label>
                      <Input
                        value={formData?.employee_id || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employee_id: e.target.value,
                          })
                        }
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Name
                      </label>
                      <Input
                        value={formData?.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Email
                      </label>
                      <Input
                        value={formData?.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Phone
                      </label>
                      <Input
                        value={formData?.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Designation
                      </label>
                      <Input
                        value={formData?.designation || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            designation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Division
                      </label>
                      <Select
                        value={formData.division_id || ""}
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            division_id: value || null,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {categoryOptions.divisions.map((division) => (
                            <SelectItem key={division.id} value={division.id}>
                              {division.title}
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
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            department_id: value || null,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {categoryOptions.departments.map((department) => (
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
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Sub Department
                      </label>
                      <Select
                        value={formData.sub_department_id || ""}
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            sub_department_id: value || null,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {categoryOptions.subDepartments.map(
                            (subDepartment) => (
                              <SelectItem
                                key={subDepartment.id}
                                value={subDepartment.id}
                              >
                                {subDepartment.title}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Unit
                      </label>
                      <Select
                        value={formData.unit_id || ""}
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            unit_id: value || null,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {categoryOptions.units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Line Manager
                      </label>
                      <Select
                        value={formData.line_manager_id || ""}
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            line_manager_id: value || null,
                          }))
                        }
                        disabled={permission_value === 2 || permission_value === 3}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Line Manager" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {categoryOptions.lines.length > 0 ? (
                            categoryOptions.lines.map((manager) => (
                              <SelectItem
                                key={manager.id}
                                value={manager.id.toString()}
                              >
                                {manager.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No Managers Available
                            </SelectItem>
                          )}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            joining_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Confirmed
                      </label>
                      <Select
                        value={formData?.confirmed === 1 ? "Yes" : "No"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            confirmed: value === "Yes" ? 1 : 0,
                          })
                        }
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
                        Confirmation Date
                      </label>
                      <Input
                        type="date"
                        value={
                          formData?.confirmation_date
                            ? formData.confirmation_date.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmation_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Employment Type
                      </label>
                      <Select
                        value={
                          formData?.permission_value === "1"
                            ? "HR"
                            : formData?.permission_value === "2"
                            ? "TEAM LEAD"
                            : formData?.permission_value === "3"
                            ? "GENERAL"
                            : ""
                        }
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            permission_value:
                              value === "HR"
                                ? "1"
                                : value === "TEAM LEAD"
                                ? "2"
                                : value === "GENERAL"
                                ? "3"
                                : null,
                          })
                        }
                        disabled={permission_value === 2 || permission_value === 3}
                      >
                        <SelectTrigger className="w-full border-gray-300 bg-gray-50 hover:bg-gray-100">
                          <SelectValue placeholder="-- Select Type --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          {[
                            { label: "HR", value: "1" },
                            { label: "TEAM LEAD", value: "2" },
                            { label: "GENERAL", value: "3" },
                          ].map((type) => (
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

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Gender
                      </label>
                      <Select
                        value={formData?.gender || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
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
                        Religion
                      </label>
                      <Select
                        value={formData?.religion || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, religion: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
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
                        Birthday
                      </label>
                      <Input
                        type="date"
                        value={
                          formData?.birthday
                            ? formData.birthday.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                      />
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            official_birthday: e.target.value,
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
                        onValueChange={(value) =>
                          setFormData({ ...formData, blood_group: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Father’s Name
                      </label>
                      <Input
                        value={formData?.fathers_name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fathers_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Mother’s Name
                      </label>
                      <Input
                        value={formData?.mothers_name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mothers_name: e.target.value,
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
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            relationship_status: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-md">
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Present Address
                      </label>
                      <Textarea
                        value={formData?.present_address || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            present_address: e.target.value,
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permanent_address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="official" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Skype [Official]
                      </label>
                      <Input
                        value={formData?.skype || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, skype: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Gmail [Official]
                      </label>
                      <Input
                        value={formData?.official_gmail || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            official_gmail: e.target.value,
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
                        onChange={(e) =>
                          setFormData({ ...formData, gitlab: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        GitHub [Official]
                      </label>
                      <Input
                        value={formData?.github || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, github: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        NID
                      </label>
                      <Input
                        value={formData?.nid || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, nid: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        TIN
                      </label>
                      <Input
                        value={formData?.tin || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, tin: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Bank Name
                      </label>
                      <Input
                        value={formData?.bank_name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bank_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1F2328]">
                        Bank Account No
                      </label>
                      <Input
                        value={formData?.bank_account_no || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bank_account_no: e.target.value,
                          })
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="meal" className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Breakfast", key: "breakfast" },
                      { label: "Lunch", key: "lunch" },
                      { label: "Beef", key: "beef" },
                      { label: "Fish", key: "fish" },
                    ].map((meal) => (
                      <div key={meal.key} className="space-y-2">
                        <label className="text-sm font-medium text-[#1F2328] block">
                          {meal.label}
                        </label>
                        <Select
                          value={
                            formData[meal.key as keyof FormData] === 1
                              ? "Yes"
                              : "No"
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              [meal.key]: value === "Yes" ? 1 : 0,
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

              <TabsContent value="leave" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Annual Leave Balance
                    </label>
                    <Input
                      type="text"
                      value={inputValues.annual_leave_balance}
                      onChange={(e) =>
                        handleInputChange("annual_leave_balance", e.target.value)
                      }
                      onFocus={() => handleFocus("annual_leave_balance")}
                      placeholder={leaveFormData.annual_leave_balance || "0"}
                      disabled={permission_value === 2 || permission_value === 3}
                      className={
                        !inputValidity.annual_leave_balance &&
                        inputValues.annual_leave_balance !== ""
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F2328]">
                      Sick Leave Balance
                    </label>
                    <Input
                      type="text"
                      value={inputValues.sick_leave_balance}
                      onChange={(e) =>
                        handleInputChange("sick_leave_balance", e.target.value)
                      }
                      onFocus={() => handleFocus("sick_leave_balance")}
                      placeholder={leaveFormData.sick_leave_balance || "0"}
                      disabled={permission_value === 2 || permission_value === 3}
                      className={
                        !inputValidity.sick_leave_balance &&
                        inputValues.sick_leave_balance !== ""
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              {activeTab === "leave" ? (
                <Button
                  disabled={isSaveLeaveDisabled}
                  onClick={handleSaveLeave}
                >
                  {updating ? "Saving Leave..." : "Save Leave"}
                </Button>
              ) : (
                <Button disabled={updating} onClick={handleSaveProfile}>
                  {updating ? "Saving Profile..." : "Save Profile"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading profile...</p>
      )}
    </Fragment>
  );
}

export default EmployeeProfile;