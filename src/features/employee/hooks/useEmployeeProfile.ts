import { useState, useCallback } from 'react';
import { employeeApi } from '../api';
import { EmployeeProfile, CategoryOptions } from '../types';
import toast from 'react-hot-toast';

export const useEmployeeProfile = (id: number | null) => {
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [options, setOptions] = useState<CategoryOptions>({
        divisions: [],
        departments: [],
        subDepartments: [],
        units: [],
        lines: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const [profileData, optionsData] = await Promise.all([
                employeeApi.getEmployeeProfile(id),
                employeeApi.getCategoryOptions()
            ]);

            if (profileData) {
                setProfile(profileData);
            } else {
                setError('Profile not found');
            }
            setOptions(optionsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profile');
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const updateProfile = async (data: EmployeeProfile) => {
        setLoading(true);
        const toastId = toast.loading('Updating profile...');
        try {
            const response = await employeeApi.updateEmployeeProfile(data);
            if (response.success) {
                setProfile(prev => ({ ...prev, ...data } as EmployeeProfile));
                toast.success(response.message, { id: toastId });
                return true;
            } else {
                toast.error(response.message, { id: toastId });
                return false;
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile', { id: toastId });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateLeaveBalance = async (annual: number | null, sick: number | null) => {
        if (!id) return false;
        setLoading(true);
        const toastId = toast.loading('Updating leave balance...');
        try {
            const response = await employeeApi.updateLeaveBalance(id, annual, sick);
            if (response.success && response.data) {
                setProfile(prev => prev ? ({
                    ...prev,
                    annual_leave_balance: response.data!.annual_leave_balance,
                    sick_leave_balance: response.data!.sick_leave_balance
                }) : null);
                toast.success(response.message, { id: toastId });
                return true;
            } else {
                toast.error(response.message, { id: toastId });
                return false;
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update leave balance', { id: toastId });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        options,
        loading,
        error,
        fetchProfile,
        updateProfile,
        updateLeaveBalance
    };
};
