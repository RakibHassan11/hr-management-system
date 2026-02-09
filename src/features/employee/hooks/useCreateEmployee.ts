import { useState } from 'react';
import { employeeApi } from '../api';
import { CreateEmployeeRequest, Employee } from '../types';
import toast from 'react-hot-toast';

export const useCreateEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEmployee = async (data: CreateEmployeeRequest) => {
        setLoading(true);
        setError(null);
        const toastId = toast.loading("Creating employee...");

        try {
            const response = await employeeApi.createEmployee(data);
            if (response.success) {
                toast.success(response.message, { id: toastId });
                return true;
            } else {
                toast.error(response.message || "Failed to create employee.", { id: toastId });
                return false;
            }
        } catch (err: any) {
            const errorMessage = err.message || "Error creating employee";
            toast.error(errorMessage, { id: toastId });
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        createEmployee,
        loading,
        error
    };
};
