import { useState, useCallback, useEffect } from 'react';
import { employeeApi } from '../api';
import { Employee, EmployeeFilter } from '../types';

export const useEmployee = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
    });

    const fetchEmployees = useCallback(async (filter: EmployeeFilter = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await employeeApi.getEmployees(filter);
            setEmployees(response.data);
            setPagination({
                currentPage: response.extraData.currentPage,
                totalPages: response.extraData.totalPages,
                totalItems: response.extraData.total,
                perPage: response.extraData.perPage,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch employees');
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const resignEmployee = async (id: number, date: string) => {
        try {
            const response = await employeeApi.resignEmployee(id, date);
            if (response.success) {
                // refresh list
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    return {
        employees,
        loading,
        error,
        pagination,
        fetchEmployees,
        resignEmployee
    };
};
