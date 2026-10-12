import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import TenantLayout from "./layouts/TenantLayout";
import LandlordLayout from "./layouts/LandlordLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";
import TenantDashboard from "./pages/TenantDashboard";
import TenantProperties from "./pages/TenantProperties";
import TenantApplications from "./pages/TenantApplications";
import TenantSaved from "./pages/TenantSaved";
import TenantProfile from "./pages/TenantProfile";
import LandlordDashboard from "./pages/LandlordDashboard";
import LandlordProperties from "./pages/LandlordProperties";
import LandlordCreateProperty from "./pages/LandlordCreateProperty";
import LandlordEditProperty from "./pages/LandlordEditProperty";
import LandlordApplications from "./pages/LandlordApplications";
import LandlordTenants from "./pages/LandlordTenants";
import LandlordProfile from "./pages/LandlordProfile";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
      </Route>

      <Route
        path="tenant"
        element={<ProtectedRoute requiredRole="tenant"><TenantLayout /></ProtectedRoute>}
      >
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="properties" element={<TenantProperties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="applications" element={<TenantApplications />} />
        <Route path="saved" element={<TenantSaved />} />
        <Route path="profile" element={<TenantProfile />} />
      </Route>

      <Route
        path="landlord"
        element={<ProtectedRoute requiredRole="landlord"><LandlordLayout /></ProtectedRoute>}
      >
        <Route path="dashboard" element={<LandlordDashboard />} />
        <Route path="properties" element={<LandlordProperties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="properties/new" element={<LandlordCreateProperty />} />
        <Route path="properties/:id/edit" element={<LandlordEditProperty />} />
        <Route path="applications" element={<LandlordApplications />} />
        <Route path="tenants" element={<LandlordTenants />} />
        <Route path="profile" element={<LandlordProfile />} />
      </Route>

      <Route
        path="admin"
        element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}
      >
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}