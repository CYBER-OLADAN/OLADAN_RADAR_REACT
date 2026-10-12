import DashboardLayout from "./DashboardLayout";

export default function TenantLayout() {
  return (
    <DashboardLayout
      title="Tenant Portal"
      links={[
        { to: "/tenant/dashboard", label: "Dashboard" },
        { to: "/tenant/properties", label: "Browse Properties" },
        { to: "/tenant/applications", label: "My Applications" },
        { to: "/tenant/saved", label: "Saved" },
        { to: "/tenant/profile", label: "Profile" },
      ]}
    />
  );
}