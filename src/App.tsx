import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ViewAttendance from "./pages/ViewAttendance.tsx";
import AllAttendance from "./pages/AllAttendance.tsx";
import TimeUpdate from "./pages/time_update/TimeUpdate";
import ViewLeave from "./pages/ViewLeave";
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
import {Layout} from "@/components/Layout";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import AdminHome from "./components/Admin/Home";
import AdminEmployee from "./components/Admin/AdminEmployee";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import UpdateEmployeeInfo from "./pages/employee/UpdateEmployeeInfo";
import LeaveRecords from "./pages/apply_leave/LeaveRecords";
import TimeUpdatesList from "./pages/time_update/TimeUpdatesList";
import TeamLeaveRecords from "./pages/TeamLeaveRecords";
import TeamAttendanceRecords from "./pages/TeamAttendanceRecord.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/adminlogin" element={<SuperAdminLogin />} />

            <Route path="/user" element={<Navigate to="/user/home" />} />
            <Route path="/user/*" element={<PrivateRoute element={<Layout><UserRoutes /></Layout>} />} />

            <Route path="/admin" element={<Navigate to="/admin/AdminHome" />} />
            <Route path="/admin/*" element={<PrivateRoute element={<AdminLayout><AdminRoutes /></AdminLayout>} />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

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
    <Route path="employee" element={<Employee />} />
    <Route path="employee/profile" element={<EmployeeProfile />} />
    <Route path="employee/edit/:emp_id" element={<UpdateEmployeeInfo />} />
    <Route path="team" element={<Team />} />
    <Route path="teamleaverecords" element={<TeamLeaveRecords/>} />
    <Route path="teamattendancerecords" element={<TeamAttendanceRecords/>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AdminRoutes = () => (
  <Routes>
    <Route path="home" element={<AdminHome />} />
    <Route path="employee" element={<AdminEmployee />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;