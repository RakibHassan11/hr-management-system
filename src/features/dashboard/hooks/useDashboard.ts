import { useState, useEffect } from 'react';
import { attendanceApi } from '@/features/attendance/api';
import { leaveApi } from '@/features/leave/api';
import { AttendanceRecord, AttendanceStatistics } from '@/features/attendance/types';
import { LeaveBalance } from '@/features/leave/types';

export const useDashboard = () => {
    const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [leaves, records, stats] = await Promise.all([
                    leaveApi.getBalances(),
                    attendanceApi.getRecords('startDate', 'endDate'), // Mock dates
                    attendanceApi.getStatistics('Current Month'),
                ]);

                setLeaveBalances(leaves);
                setAttendanceRecords(records);
                setStatistics(stats);
            } catch (error) {
                console.error('Dashboard data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        leaveBalances,
        attendanceRecords,
        statistics,
        loading,
    };
};
