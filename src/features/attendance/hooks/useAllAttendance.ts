import { useState, useCallback } from 'react';
import { attendanceApi } from '../api';

export const useAllAttendance = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        perPage: 30,
        totalItems: 0
    });

    const fetchRecords = useCallback(async (params: {
        page?: number;
        perPage?: number;
        sortDirection?: string;
        sortOn?: string;
        query?: string;
        startdate?: string;
        enddate?: string;
        comment?: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await attendanceApi.getAllAttendance(params);
            if (response.success) {
                setRecords(response.data);
                setPagination({
                    currentPage: response.extraData.currentPage,
                    totalPages: response.extraData.totalPages,
                    perPage: response.extraData.perPage,
                    totalItems: response.extraData.total
                });
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
        loading,
        error,
        pagination,
        fetchRecords
    };
};
