"use client"
import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useWorkspaceStore } from "@/lib/store";

// export const metadata = {
//   title: "Dashboard",
// };

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { selectedWorkspace } = useWorkspaceStore(); // Assuming this hook provides the workspace data
  const router = useRouter();

  useEffect(() => {
    if (selectedWorkspace === "") {
      router.push("/dashboard"); // Redirect to /dashboard if no workspace is selected
    }
  }, [selectedWorkspace, router]);

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
