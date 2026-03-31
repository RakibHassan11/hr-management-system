import { useState, useCallback } from 'react';
import { attendanceApi } from '../api';

export const useMyAttendance = (managerId: number | null = null) => {
    const [records, setRecords] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extraData, setExtraData] = useState<any>(null);

    const fetchRecords = useCallback(async (params: { startdate: string; enddate: string; page?: number; perPage?: number }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await attendanceApi.getMyAttendance(params);
            if (response.success) {
                setRecords(response.data.attendanceRecords);
                setStatistics(response.data.statistics);
                setExtraData(response.extraData);
            } else {
                setError(response.message || 'Failed to fetch attendance');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        records,
        statistics,
        loading,
        error,
        extraData,
        fetchRecords
    };
};
