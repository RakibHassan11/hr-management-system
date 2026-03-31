// src/Admin/AdminEmployee.tsx
import React, { useState, useEffect } from 'react';
import EmployeeList from './EmployeeList';
import EmployeeEditForm from './EmployeeEditForm';
import PermissionModal from './PermissionModal';
import { Toaster } from 'react-hot-toast';
import { Employee } from '@/types';
import { useAdminEmployee } from '../hooks/useAdminEmployee';

export default function AdminEmployee() {
  const {
    employees,
    loading,
    error,
    divisions,
    departments,
    subDepartments,
    units,
    lineManagers,
    fetchEmployees,
    updateEmployee,
    updatePermissions,
  } = useAdminEmployee();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profile, setProfile] = useState<Partial<Employee>>({});
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionEmployee, setPermissionEmployee] = useState<Employee | null>(null);
  const [permissionValue, setPermissionValue] = useState<string>('user');
  const [permissionLoading, setPermissionLoading] = useState(false);

  // Initial fetch and search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEmployees(searchTerm);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchEmployees]);

  // When selectedEmployee changes, setup profile for editing
  useEffect(() => {
    if (selectedEmployee) {
        // In a real app, we might fetch detail here. 
        // For mock, we just use the selected employee data and normalize IDs if needed.
        const employeeData = selectedEmployee;
        const divisionId = divisions.find((d) => d.title === employeeData.division)?.id || employeeData.division_id || null;
        const departmentId = departments.find((d) => d.title === employeeData.department)?.id || employeeData.department_id || null;
        const subDepartmentId = subDepartments.find((sd) => sd.title === employeeData.sub_department)?.id || employeeData.sub_department_id || null;
        const unitId = units.find((u) => u.title === employeeData.unit)?.id || employeeData.unit_id || null;

        setProfile({
            ...employeeData,
            confirmed: Boolean(employeeData.confirmed),
            role: employeeData.role || 'user',
            division_id: divisionId,
            department_id: departmentId,
            sub_department_id: subDepartmentId,
            unit_id: unitId,
            line_manager_id: employeeData.line_manager_id ? Number(employeeData.line_manager_id) : null,
        });
    }
  }, [selectedEmployee, divisions, departments, subDepartments, units]);

  const handleSaveProfile = async () => {
    if (!selectedEmployee) return;
    const success = await updateEmployee(selectedEmployee.id, profile);
    if (success) {
      setSelectedEmployee(null);
    }
  };

  const handlePermissionUpdate = async () => {
    if (!permissionEmployee) return;
    setPermissionLoading(true);
    const success = await updatePermissions(permissionEmployee.id, permissionValue);
    setPermissionLoading(false);
    if (success) {
      setIsPermissionModalOpen(false);
      fetchEmployees(searchTerm); // Refresh list
    }
  };

  // Helper functions for names/titles
  const getDivisionTitle = (id: number | null | undefined) => divisions.find((d) => d.id === id)?.title || 'Not Selected';
  const getDepartmentTitle = (id: number | null | undefined) => departments.find((d) => d.id === id)?.title || 'Not Selected';
  const getSubDepartmentTitle = (id: number | null | undefined) => subDepartments.find((sd) => sd.id === id)?.title || 'Not Selected';
  const getUnitTitle = (id: number | null | undefined) => units.find((u) => u.id === id)?.title || 'Not Selected';
  const getLineManagerName = (id: number | null | undefined) => lineManagers.find((m) => String(m.id) === String(id))?.name || 'Not Selected';

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
          onCancel={() => setSelectedEmployee(null)}
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
            setPermissionValue(emp.role || 'user');
            setIsPermissionModalOpen(true);
          }}
        />
      )}
      <PermissionModal
        isOpen={isPermissionModalOpen}
        employee={permissionEmployee}
        permissionValue={permissionValue}
        setPermissionValue={setPermissionValue}
        loading={permissionLoading}
        onClose={() => setIsPermissionModalOpen(false)}
        onUpdate={handlePermissionUpdate}
      />
      <Toaster position="top-center" />
    </div>
  );
}