import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./store"; // Import store
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ViewAttendance from "./pages/ViewAttendance";
import TimeUpdate from "./pages/TimeUpdate";
import ViewLeave from "./pages/ViewLeave";
import ApplyLeave from "./pages/ApplyLeave";
import Holidays from "./pages/Holidays";
import MacAddress from "./pages/MacAddress";
import ImportantLinks from "./pages/ImportantLinks";
import Employee from "./pages/Employee";
import Team from "./pages/Team";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "@/components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}> {/* Wrap with Provider */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/view-attendance" element={<PrivateRoute element={<ViewAttendance />} />} />
            <Route path="/time-update" element={<PrivateRoute element={<TimeUpdate />} />} />
            <Route path="/view-leave" element={<PrivateRoute element={<ViewLeave />} />} />
            <Route path="/apply-leave" element={<PrivateRoute element={<ApplyLeave />} />} />
            <Route path="/holidays" element={<PrivateRoute element={<Holidays />} />} />
            <Route path="/mac-address" element={<PrivateRoute element={<MacAddress />} />} />
            <Route path="/important-links" element={<PrivateRoute element={<ImportantLinks />} />} />
            <Route path="/employee" element={<PrivateRoute element={<Employee />} />} />
            <Route path="/team" element={<PrivateRoute element={<Team />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;