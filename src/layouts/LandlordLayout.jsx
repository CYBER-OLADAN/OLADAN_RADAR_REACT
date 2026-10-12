import DashboardLayout from "./DashboardLayout";

export default function LandlordLayout() {
  return (
    <DashboardLayout
      title="Landlord Portal"
      links={[
        { to: "/landlord/dashboard", label: "Dashboard" },
        { to: "/landlord/properties", label: "My Properties" },
        { to: "/landlord/properties/new", label: "Add Property" },
        { to: "/landlord/applications", label: "Applications" },
        { to: "/landlord/tenants", label: "Tenants" },
        { to: "/landlord/profile", label: "Profile" },
      ]}
    />
  );
}