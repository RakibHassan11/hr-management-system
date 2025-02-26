
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/view-attendance" element={<ViewAttendance />} />
          <Route path="/time-update" element={<TimeUpdate />} />
          <Route path="/view-leave" element={<ViewLeave />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/mac-address" element={<MacAddress />} />
          <Route path="/important-links" element={<ImportantLinks />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/team" element={<Team />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;