"use client";
import { useWorkspaceStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { selectedWorkspace, workspaceMenus } = useWorkspaceStore();
  const router = useRouter();

  useEffect(() => {
    if (selectedWorkspace) {
      // If a workspace is selected, redirect to the first menu item of that workspace
      const firstMenuItem = workspaceMenus[selectedWorkspace]?.[0];
      if (firstMenuItem) {
        router.replace(firstMenuItem.path); // Redirect to the first menu item of the selected workspace
      }
    }
  }, [selectedWorkspace, workspaceMenus, router]);

  if (!selectedWorkspace) {
    // If no workspace is selected, render the analytics dashboard
    return (
      <div>
        <h1>Analytics Dashboard</h1>
        {/* Place your Analytics components here */}
      </div>
    );
  }

  return null; // This shouldn't be hit because of the redirect above, but it's safe to return null here.
};

export default DashboardPage;
