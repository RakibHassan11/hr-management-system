// src/Admin/AdminEmployee.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './EmployeeList';
import EmployeeEditForm from './EmployeeEditForm';
import PermissionModal from './PermissionModal';
import toast, { Toaster } from 'react-hot-toast';
import { Employee, Division, Department, SubDepartment, Unit, LineManager } from './types';

export default function AdminEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profile, setProfile] = useState<Partial<Employee>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionEmployee, setPermissionEmployee] = useState<Employee | null>(null);
  const [permissionValue, setPermissionValue] = useState<string>('2');
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionSuccess, setPermissionSuccess] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lineManagers, setLineManagers] = useState<LineManager[]>([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      };

      try {
        const divisionsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/divisions/list`, { headers });
        if (divisionsResponse.data.success) setDivisions(divisionsResponse.data.data);

        const departmentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/departments/list`, { headers });
        if (departmentsResponse.data.success) setDepartments(departmentsResponse.data.data);

        const subDepartmentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/sub-departments/list`, { headers });
        if (subDepartmentsResponse.data.success) setSubDepartments(subDepartmentsResponse.data.data);

        const unitsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/units/list`, { headers });
        if (unitsResponse.data.success) setUnits(unitsResponse.data.data);

        const lineManagersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/employee/employee-list-by-role?permission_value=2&needPagination=true`,
          { headers }
        );
        if (lineManagersResponse.data.success) {
          setLineManagers(lineManagersResponse.data.data);
          console.log('Line Managers fetched:', lineManagersResponse.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching dropdown data:', err);
        setError(err.response?.data?.message || 'Failed to fetch dropdown data');
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        setSessionToken(token);
        let endpoint = `${import.meta.env.VITE_API_URL}/super-admin/employee-list`;
        if (searchTerm.trim() !== '') {
          endpoint += `?needPagination=true&query=${encodeURIComponent(searchTerm.trim())}`;
        }

        if (!token) throw new Error('No authorization token found. Please log in again.');

        const response = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch employees');
        }
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError(err.response?.status === 401
          ? 'Authorization required (401). Please log in again.'
          : err.response?.data?.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Fetch employee details
  useEffect(() => {
    if (selectedEmployee) {
      const fetchEmployeeDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/super-admin/employee-details?id=${selectedEmployee.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
              },
            }
          );
          if (response.data.success) {
            const employeeData = response.data.data;
            const divisionId = divisions.find((d) => d.title === employeeData.division)?.id || null;
            const departmentId = departments.find((d) => d.title === employeeData.department)?.id || null;
            const subDepartmentId = subDepartments.find((sd) => sd.title === employeeData.sub_department)?.id || null;
            const unitId = units.find((u) => u.title === employeeData.unit)?.id || null;

            setProfile({
              ...employeeData,
              confirmed: Boolean(employeeData.confirmed),
              email: employeeData.email.replace('mailto:', ''),
              personal_email: employeeData.personal_email.replace('mailto:', ''),
              employee_id: selectedEmployee.employee_id || 0,
              username: employeeData.username || '',
              permission_value: employeeData.permission_value || '2',
              division_id: divisionId,
              department_id: departmentId,
              sub_department_id: subDepartmentId,
              unit_id: unitId,
              line_manager_id: employeeData.line_manager_id !== undefined ? Number(employeeData.line_manager_id) : null,
              default_shift: employeeData.default_shift || '',
              breakfast: employeeData.breakfast || false,
              lunch: employeeData.lunch || false,
              beef: employeeData.beef || false,
              fish: employeeData.fish || false,
              religion: employeeData.religion || '',
              fathers_name: employeeData.fathers_name || '',
              mothers_name: employeeData.mothers_name || '',
              relationship_status: employeeData.relationship_status || '',
              spouse: employeeData.spouse || '',
              children: employeeData.children || '',
            });
            console.log('Profile set with line_manager_id:', employeeData.line_manager_id);
          } else {
            setError(response.data.message || 'Failed to fetch employee details');
            setProfile(selectedEmployee);
          }
        } catch (err: any) {
          console.error('Error fetching employee details:', err);
          setError(err.response?.data?.message || 'Failed to fetch employee details');
          setProfile(selectedEmployee);
        }
      };
      fetchEmployeeDetails();
      setIsEditing(true);
    }
  }, [selectedEmployee, divisions, departments, subDepartments, units]);

  // Save profile
  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    const payload: { [key: string]: any } = {
      id: parseInt(selectedEmployee?.id || '0'),
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      designation: profile.designation || '',
      gender: profile.gender || '',
      blood_group: profile.blood_group || '',
      profile_image: profile.profile_image || null,
      present_address: profile.present_address || '',
      permanent_address: profile.permanent_address || '',
      birthday: profile.birthday || '',
      official_birthday: profile.official_birthday || '',
      joining_date: profile.joining_date || '',
      confirmed: profile.confirmed ? 1 : 0,
      confirmation_date: profile.confirmation_date || '',
      website: profile.website || '',
      facebook: profile.facebook || '',
      twitter: profile.twitter || '',
      linkedin: profile.linkedin || '',
      instagram: profile.instagram || '',
      youtube: profile.youtube || '',
      tiktok: profile.tiktok || '',
      gitlab: profile.gitlab || '',
      github: profile.github || '',
      personal_email: profile.personal_email || '',
      status: profile.status || '',
      username: profile.username || '',
      permission_value: profile.permission_value || '2',
      default_shift: profile.default_shift || '',
      breakfast: Boolean(profile.breakfast),
      lunch: Boolean(profile.lunch),
      beef: Boolean(profile.beef),
      fish: Boolean(profile.fish),
      religion: profile.religion || '',
      fathers_name: profile.fathers_name || '',
      mothers_name: profile.mothers_name || '',
      relationship_status: profile.relationship_status || '',
      spouse: profile.spouse || '',
      children: profile.children || '',
      division_id: profile.division_id || null,
      department_id: profile.department_id || null,
      sub_department_id: profile.sub_department_id || null,
      unit_id: profile.unit_id || null,
      line_manager_id: profile.line_manager_id === null || profile.line_manager_id === undefined ? null : Number(profile.line_manager_id),
    };

    console.log('Payload being sent:', payload);

    try {
      if (!token) throw new Error('No authorization token found. Please log in again.');

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/super-admin/employee-profile-update`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Update response:', response.data);
      if (response.data.message === 'Employee profile updated successfully') {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee?.id
              ? {
                  ...emp,
                  ...response.data.data,
                  division: getDivisionTitle(profile.division_id),
                  department: getDepartmentTitle(profile.department_id),
                  sub_department: getSubDepartmentTitle(profile.sub_department_id),
                  unit: getUnitTitle(profile.unit_id),
                  line_manager_id: response.data.data.line_manager_id,
                }
              : emp
          )
        );
        setProfile((prev) => ({
          ...prev,
          line_manager_id: response.data.data.line_manager_id,
        }));
        if (response.data.data.line_manager_id !== payload.line_manager_id) {
          console.warn(`Backend did not update line_manager_id. Sent: ${payload.line_manager_id}, Received: ${response.data.data.line_manager_id}`);
          setError('Line manager ID was not updated by the server. Please check backend logs.');
        }
        setSelectedEmployee(null);
        setIsEditing(false);
        toast.success('Employee profile updated successfully', { duration: 3000 });
      } else {
        setError(response.data.message || 'Failed to update profile');
        toast.error(response.data.message || 'Failed to update profile', { duration: 3000 });
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.status === 401
        ? 'Authorization required (401). Please log in again.'
        : err.response?.data?.message || 'Failed to update profile: Invalid request data';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  // Helper functions
  const getDivisionTitle = (id: number | null | undefined) => {
    const division = divisions.find((d) => d.id === id);
    return division ? division.title : 'Not Selected';
  };

  const getDepartmentTitle = (id: number | null | undefined) => {
    const department = departments.find((d) => d.id === id);
    return department ? department.title : 'Not Selected';
  };

  const getSubDepartmentTitle = (id: number | null | undefined) => {
    const subDepartment = subDepartments.find((sd) => sd.id === id);
    return subDepartment ? subDepartment.title : 'Not Selected';
  };

  const getUnitTitle = (id: number | null | undefined) => {
    const unit = units.find((u) => u.id === id);
    return unit ? unit.title : 'Not Selected';
  };

  const getLineManagerName = (id: number | null | undefined) => {
    const manager = lineManagers.find((m) => m.id === String(id));
    return manager ? manager.name : 'Not Selected';
  };

  // Permission update logic
  const handlePermissionUpdate = async () => {
    if (!permissionEmployee) return;
    setPermissionLoading(true);
    setPermissionError(null);
    setPermissionSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/super-admin/update-permission`,
        { id: parseInt(permissionEmployee.id), permission: permissionValue },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === 'Employee permission updated successfully') {
        setPermissionSuccess('Permission updated successfully!'); // Show immediately in modal
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === permissionEmployee.id ? { ...emp, permission_value: permissionValue } : emp
          )
        );
        toast.success('Employee permission updated successfully', { duration: 3000 }); // Trigger toast
        setTimeout(() => setIsPermissionModalOpen(false), 1500); // Auto-close after 1.5s
      } else {
        setPermissionError(response.data.message || 'Failed to update permission'); // Show immediately in modal
        toast.error(response.data.message || 'Failed to update permission', { duration: 3000 }); // Trigger toast
      }
    } catch (err: any) {
      const errorMessage = err.response?.status === 401
        ? 'Authorization required (401). Please log in again.'
        : err.response?.data?.message || `Failed to update permission: ${err.message}`;
      setPermissionError(errorMessage); // Show immediately in modal
      toast.error(errorMessage, { duration: 3000 }); // Trigger toast
    } finally {
      setPermissionLoading(false);
    }
  };

  return (
    <div>
      {selectedEmployee ? (
        <EmployeeEditForm
          selectedEmployee={selectedEmployee}
          profile={profile}
          setProfile={setProfile}
          error={error}
          divisions={divisions}
          departments={departments}
          subDepartments={subDepartments}
          units={units}
          lineManagers={lineManagers}
          onSave={handleSaveProfile}
          onCancel={() => {
            setSelectedEmployee(null);
            setIsEditing(false);
          }}
          getDivisionTitle={getDivisionTitle}
          getDepartmentTitle={getDepartmentTitle}
          getSubDepartmentTitle={getSubDepartmentTitle}
          getUnitTitle={getUnitTitle}
          getLineManagerName={getLineManagerName}
        />
      ) : (
        <EmployeeList
          employees={employees}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={(emp) => setSelectedEmployee(emp)}
          onPermission={(emp) => {
            setPermissionEmployee(emp);
            setPermissionValue(emp.permission_value || '2');
            setIsPermissionModalOpen(true);
            setPermissionError(null);
            setPermissionSuccess(null);
          }}
        />
      )}
      <PermissionModal
        isOpen={isPermissionModalOpen}
        employee={permissionEmployee}
        permissionValue={permissionValue}
        setPermissionValue={setPermissionValue}
        loading={permissionLoading}
        error={permissionError}
        success={permissionSuccess}
        onClose={() => setIsPermissionModalOpen(false)}
        onUpdate={handlePermissionUpdate}
      />
      <Toaster position="top-center" /> {/* Single Toaster at root level */}
    </div>
  );
}