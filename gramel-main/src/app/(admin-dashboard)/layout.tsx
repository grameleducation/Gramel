import { DashboardHeader } from "@/components/admin-dashboard/DashboardHeader";
import DashboardSidebar from "@/components/admin-dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <DashboardSidebar />

        <div className="w-full">
          <DashboardHeader />
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}
