import { useState, useCallback, useEffect } from 'react';
import { leaveApi } from '../api';
import { LeaveRecord } from '../types';

export const useLeaveRecords = () => {
    const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLeaveRecords = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leaveApi.getLeaveRecords();
            setLeaveRecords(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch leave records');
            setLeaveRecords([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaveRecords();
    }, [fetchLeaveRecords]);

    return {
        leaveRecords,
        loading,
        error,
        fetchLeaveRecords
    };
};
