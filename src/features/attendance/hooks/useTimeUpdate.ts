import { useState, useCallback } from 'react';
import { attendanceApi } from '../api';
import { TimeUpdateRequest, CreateTimeUpdateRequest } from '../types';
import toast from 'react-hot-toast';

export const useTimeUpdate = () => {
    const [requests, setRequests] = useState<TimeUpdateRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await attendanceApi.getTimeUpdateRequests();
            if (response.success) {
                setRequests(response.data);
                setError(null);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch time update requests');
        } finally {
            setLoading(false);
        }
    }, []);

    const createRequest = async (data: CreateTimeUpdateRequest) => {
        const toastId = toast.loading('Submitting request...');
        try {
            const response = await attendanceApi.createTimeUpdate(data);
            if (response.success) {
                toast.success(response.message, { id: toastId });
                fetchRequests(); // Refresh list
                return true;
            } else {
                toast.error(response.message, { id: toastId });
                return false;
            }
        } catch (err: any) {
            toast.error(err.message || 'Submission failed', { id: toastId });
            return false;
        }
    };

    return {
        requests,
        loading,
        error,
        fetchRequests,
        createRequest
    };
};
