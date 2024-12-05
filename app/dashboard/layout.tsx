import React, { Suspense } from "react";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata = {
  title: "Dashboard",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
