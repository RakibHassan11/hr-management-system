import { useState } from 'react';
import { authApi } from '../api';
import { ChangePasswordRequest } from '../types';
import toast from 'react-hot-toast';

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const changePassword = async (data: ChangePasswordRequest) => {
        setLoading(true);
        const toastId = toast.loading('Changing password...');
        try {
            const response = await authApi.changePassword(data);
            if (response.success) {
                toast.success(response.message, { id: toastId });
                return true;
            } else {
                toast.error(response.message, { id: toastId });
                return false;
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to change password', { id: toastId });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        changePassword,
        loading
    };
};
