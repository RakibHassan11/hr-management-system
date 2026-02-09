import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '@/components/navigationUI/PrivateRoute';
import { Layout } from '@/components/navigationUI/Layout';
import { AdminLayout, AdminDashboard, AdminEmployee } from '@/features/admin';

// Auth Pages
import Login from '@/pages/auth/Login';
import SuperAdminLogin from '@/pages/auth/SuperAdminLogin';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// User Pages
import Home from '@/pages/dashboard/Home';
import Profile from '@/pages/profile/Profile';
import ChangePassword from '@/pages/profile/ChangePassword';

// Attendance Pages
import ViewAttendance from '@/pages/attendance/MyAttendance';
import AllAttendance from '@/pages/attendance/AllAttendance';
import DailyAttendance from '@/pages/attendance/DailyAttendance';
import MonthlySummary from '@/pages/attendance/MonthlySummary';

// Leave Pages
import ViewLeave from '@/pages/leave/LeaveRecords';
import ApplyLeave from '@/pages/leave/ApplyLeave';
import LeaveRecords from '@/pages/leave/LeaveRecords';

// Team Pages
import Team from '@/pages/team/Team';
import TeamLeaveRecords from '@/pages/team/TeamLeaveRecords';
import TeamAttendanceRecords from '@/pages/team/TeamAttendanceRecord';

// Time Update Pages
import TimeUpdate from '@/pages/time-update/TimeUpdate';
import TimeUpdatesList from '@/pages/time-update/TimeUpdatesList';

// Employee Pages
import Employee from '@/pages/employee/Employee';
import CreateEmployee from '@/pages/employee/CreateEmployee';
import EmployeeProfile from '@/pages/employee/EmployeeProfile';
// HR Pages - TODO: Create these pages later
// import EmployeeLeaveRecords from '@/pages/hr/EmployeeLeaveRecords.tsx';
// import EmployeeAttendanceRecords from '@/pages/hr/EmployeeAttendanceRecords.tsx';

// Shared Pages
import Holidays from '@/pages/shared/Holidays';
import MacAddress from '@/pages/shared/MacAddress';
import ImportantLinks from '@/pages/shared/ImportantLinks';

// Error Pages
import NotFound from '@/pages/errors/NotFound';

/**
 * User Routes
 * Routes accessible to authenticated regular users
 */
const UserRoutes = () => (
    <Routes>
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="view-attendance" element={<ViewAttendance />} />
        <Route path="daily-attendance" element={<DailyAttendance />} />
        <Route path="all-attendance" element={<AllAttendance />} />
        <Route path="montlhy-summary" element={<MonthlySummary />} />
        <Route path="time-update" element={<TimeUpdate />} />
        <Route path="time-update/time-update-list" element={<TimeUpdatesList />} />
        <Route path="view-leave" element={<ViewLeave />} />
        <Route path="apply-leave" element={<ApplyLeave />} />
        <Route path="apply-leave/leave-record-list" element={<LeaveRecords />} />
        <Route path="holidays" element={<Holidays />} />
        <Route path="mac-address" element={<MacAddress />} />
        <Route path="important-links" element={<ImportantLinks />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="employee" element={<Employee />} />
        <Route path="employee/create" element={<CreateEmployee />} />
        <Route path="employee/profile" element={<EmployeeProfile />} />
        {/* HR Pages - TODO: Uncomment when created */}
        {/* <Route path="employee/leave-records" element={<EmployeeLeaveRecords />} /> */}
        {/* <Route
            path="employee/attendance-records"
            element={<EmployeeAttendanceRecords />}
        /> */}
        <Route path="team" element={<Team />} />
        <Route path="team/leave-records" element={<TeamLeaveRecords />} />
        <Route path="team/attendance-records" element={<TeamAttendanceRecords />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

/**
 * Admin Routes
 * Routes accessible to super admin users
 */
const AdminRoutes = () => (
    <Routes>
        <Route path="AdminHome" element={<AdminDashboard />} />
        <Route path="employee" element={<AdminEmployee />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

/**
 * App Routes
 * Main application routing configuration
 */
export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
                path="/login"
                element={<PrivateRoute element={<Login />} />}
            />
            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />
            <Route
                path="/adminlogin"
                element={<PrivateRoute element={<SuperAdminLogin />} />}
            />

            {/* User Routes */}
            <Route path="/user" element={<Navigate to="/user/home" />} />
            <Route
                path="/user/*"
                element={
                    <PrivateRoute
                        element={
                            <Layout>
                                <UserRoutes />
                            </Layout>
                        }
                    />
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={<Navigate to="/admin/AdminHome" />}
            />
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute
                        element={
                            <AdminLayout>
                                <AdminRoutes />
                            </AdminLayout>
                        }
                    />
                }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
