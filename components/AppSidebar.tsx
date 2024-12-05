// src/components/AppSidebar.tsx
"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const AppSidebar = () => {
  const { selectedWorkspace, workspaceMenus, setSelectedWorkspace } =
    useWorkspaceStore();
  const router = useRouter();

  const handleMenuItemClick = (path: string) => {
    router.push(path);
  };

  const handleHomeClick = () => {
    setSelectedWorkspace(""); // Clear the selected workspace in Zustand state
    router.push("/dashboard"); // Redirect to the analytics dashboard
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          {/* Dropdown for Workspace Selection */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {selectedWorkspace || "Select Workspace"}{" "}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(workspaceMenus).map((workspace) => (
                  <DropdownMenuItem
                    key={workspace}
                    onClick={() => {
                      setSelectedWorkspace(workspace); // Set the selected workspace
                      handleMenuItemClick(workspaceMenus[workspace][0].path); // Redirect to the first menu item
                    }}
                  >
                    {workspace}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarGroupContent>
        {/* Home Menu Item */}
        <SidebarMenu>

        <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a onClick={handleHomeClick}>Home</a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        </SidebarMenu>

        {/* Workspace Menu Items */}
        <SidebarMenu>
          {selectedWorkspace &&
            workspaceMenus[selectedWorkspace]?.map((menuItem) => (
              <SidebarMenuItem key={menuItem.name}>
                <SidebarMenuButton asChild>

                <a onClick={() => handleMenuItemClick(menuItem.path)}>
                  {menuItem.name}
                </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </Sidebar>
  );
};

export default AppSidebar;
