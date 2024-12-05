import React, { Suspense } from "react";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import LoadingSpinner from "@/components/LoadingSpinner"; 

export const metadata = {
  title: "Dashboard",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Wrap children in Suspense to show loading spinner while loading */}
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
