import { useState } from 'react';
import { leaveApi } from '../api';
import { LeaveRequest } from '../types';

export const useApplyLeave = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitLeave = async (request: LeaveRequest) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await leaveApi.submitLeave(request);
            if (response.success) {
                return true;
            } else {
                setError(response.message);
                return false;
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit leave request');
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        submitLeave,
        submitting,
        error
    };
};
