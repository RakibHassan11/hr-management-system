import { useState, useCallback, useEffect } from 'react';
import { adminApi } from '../api';
import { Employee, Division, Department, SubDepartment, Unit, LineManager } from '@/types';
import toast from 'react-hot-toast';

export const useAdminEmployee = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [lineManagers, setLineManagers] = useState<LineManager[]>([]);

    const fetchEmployees = useCallback(async (searchTerm: string = '') => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getEmployees(searchTerm);
            setEmployees(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDropdownData = useCallback(async () => {
        try {
            const [divs, depts, subs, uns, mangs] = await Promise.all([
                adminApi.getDivisions(),
                adminApi.getDepartments(),
                adminApi.getSubDepartments(),
                adminApi.getUnits(),
                adminApi.getLineManagers(),
            ]);
            setDivisions(divs);
            setDepartments(depts);
            setSubDepartments(subs);
            setUnits(uns);
            setLineManagers(mangs);
        } catch (err: any) {
            console.error('Error fetching dropdown data:', err);
        }
    }, []);

    const updateEmployee = async (id: number, data: Partial<Employee>) => {
        setLoading(true);
        try {
            const response = await adminApi.updateEmployee(id, data);
            if (response.success) {
                toast.success(response.message);
                await fetchEmployees();
                return true;
            }
            return false;
        } catch (err: any) {
            toast.error(err.message || 'Failed to update employee');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updatePermissions = async (id: number, permission: string) => {
        try {
            const response = await adminApi.updatePermissions(id, permission);
            if (response.success) {
                toast.success(response.message);
                return true;
            }
            return false;
        } catch (err: any) {
            toast.error(err.message || 'Failed to update permissions');
            return false;
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    return {
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
    };
};
