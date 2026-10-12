import DashboardLayout from "./DashboardLayout";

export default function AdminLayout() {
  return (
    <DashboardLayout
      title="Admin Portal"
      links={[{ to: "/admin/dashboard", label: "Dashboard" }]}
    />
  );
}