import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./pages/Home";
import Profile from "./pages/profile/Profile.tsx";
import ViewAttendance from "./pages/attendance/MyAttendance.tsx";
import AllAttendance from "./pages/attendance/AllAttendance.tsx";
import TimeUpdate from "./pages/time_update/TimeUpdate";
import ViewLeave from "./pages/LeaveRecords.tsx";
import ApplyLeave from "./pages/apply_leave/ApplyLeave";
import Holidays from "./pages/Holidays";
import MacAddress from "./pages/MacAddress";
import ImportantLinks from "./pages/ImportantLinks";
import Employee from "./pages/employee/Employee";
import Team from "./pages/Team";
import Login from "./pages/Login";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import NotFound from "./pages/NotFound";
import PrivateRoute from "@/components/PrivateRoute";
import { Layout } from "@/components/Layout";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import AdminHome from "./components/Admin/Home";
import AdminEmployee from "./components/Admin/AdminEmployee";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import LeaveRecords from "./pages/apply_leave/LeaveRecords";
import TimeUpdatesList from "./pages/time_update/TimeUpdatesList";
import TeamLeaveRecords from "./pages/TeamManager/TeamLeaveRecords.tsx";
import TeamAttendanceRecords from "./pages/TeamManager/TeamAttendanceRecord.tsx";
import EmployeeLeaveRecords from "./pages/HR/EmployeeLeaveRecords.tsx";
import EmployeeAttendanceRecords from "./pages/HR/EmployeeAttendanceRecords.tsx";
import ChangePassword from "./pages/profile/ChangePassword.tsx";
import CreateEmployee from "./pages/employee/CreateEmployee.tsx";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route
                path="/login"
                element={<PrivateRoute element={<Login />} />}
              />
              <Route
                path="/adminlogin"
                element={<PrivateRoute element={<SuperAdminLogin />} />}
              />

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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  );
};

const UserRoutes = () => (
  <Routes>
    <Route path="home" element={<Home />} />
    <Route path="profile" element={<Profile />} />
    <Route path="view-attendance" element={<ViewAttendance />} />
    <Route path="all-attendance" element={<AllAttendance />} />
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
    <Route path="employee/leave-records" element={<EmployeeLeaveRecords />} />
    <Route
      path="employee/attendance-records"
      element={<EmployeeAttendanceRecords />}
    />
    <Route path="team" element={<Team />} />
    <Route path="team/leave-records" element={<TeamLeaveRecords />} />
    <Route path="team/attendance-records" element={<TeamAttendanceRecords />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AdminRoutes = () => (
  <Routes>
    <Route path="AdminHome" element={<AdminHome />} />
    <Route path="employee" element={<AdminEmployee />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;