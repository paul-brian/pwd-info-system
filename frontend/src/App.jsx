import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Landing
import PagesLandingLayouts from "./Layouts/PagesLandingLayout";
import LandingPages from "./pages/landing/LandingPages";

// Auth
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import AdminStaffLogin from "./pages/Auth/AdminStaffLogin";
import UserLogin from "./pages/Auth/UserLogin";
import RequestAccess from "./pages/Auth/RequestAccess";

// Pages
import PagesLayout from "./Layouts/PagesLayout";
import PagesDashboard from "./pages/dashboard/PagesDashboard";
import PagesProfiling from "./pages/profiling/PagesProfiling";
import PagesInventory from "./pages/inventory/PagesInventory";
import PagesHealthRecords from "./pages/health/PagesHealthRecords";
import PagesSms from "./pages/sms/PagesSms";
import PagesEvents from "./pages/events/PagesEvents";
import PagesSettings from "./pages/settings/PagesSettings";
import PagesAnnouncements from "./pages/Announcements/PagesAnnouncements";

// Auth
import ProtectedRoute from "./routes/ProtectedRouts";
import { ROLES } from "./pages/Auth/roles";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Landing */}
        <Route element={<PagesLandingLayouts />}>
          <Route path="/" element={<LandingPages />} />
        </Route>

        {/* Auth — ISANG BLOCK LANG */}
        <Route element={<AuthLayout />}>
          <Route path="/Login" element={<Login />} />
          <Route path="/AdminStaffLogin" element={<AdminStaffLogin />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/RequestAccess" element={<RequestAccess />} />
        </Route>

        {/* Protected Pages */}
        <Route element={<PagesLayout />}>

          {/* All roles */}
          <Route path="/PagesDashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.USER]}>
              <PagesDashboard />
            </ProtectedRoute>
          } />

          <Route path="/PagesProfiling" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.USER]}>
              <PagesProfiling />
            </ProtectedRoute>
          } />

          <Route path="/PagesEvents" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.USER]}>
              <PagesEvents />
            </ProtectedRoute>
          } />

          <Route path="/PagesSettings" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.USER]}>
              <PagesSettings />
            </ProtectedRoute>
          } />

          {/* Admin + Staff only */}
          <Route path="/PagesInventory" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
              <PagesInventory />
            </ProtectedRoute>
          } />

          <Route path="/PagesHealthRecords" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
              <PagesHealthRecords />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/PagesSms" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <PagesSms />
            </ProtectedRoute>
          } />

          {/* User only */}
          <Route path="/PagesAnnouncements" element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <PagesAnnouncements />
            </ProtectedRoute>
          } />

        </Route>

      </Routes>
    </Router>
  );
};

export default App;