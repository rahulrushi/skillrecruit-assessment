import { create } from 'zustand';
import { ComponentType } from "react"; // Import ComponentType
import { LucideProps } from "lucide-react";
import { SquareTerminal, FolderGit, Settings, CalendarPlus, CalendarDays } from 'lucide-react';

type MenuItem = {
  name: string;
  path: string;
  icon: ComponentType<LucideProps>;
};

type WorkspaceState = {
  selectedWorkspace: string | null;
  workspaceMenus: {
    [workspace: string]: MenuItem[];
  };
  setSelectedWorkspace: (workspace: string) => void;
  setWorkspaceMenus: (workspace: string, menus: MenuItem[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedWorkspace: null, // Default no workspace selected
  workspaceMenus: {
    "Code Compiler": [
      { name: "New File", path: "/dashboard/compiler/new", icon: SquareTerminal },
      { name: "Projects", path: "/dashboard/compiler/projects", icon: FolderGit },
      { name: "Settings", path: "/dashboard/compiler/settings", icon: Settings },
    ],
    "Video Chat": [
      { name: "Join Meeting", path: "/dashboard/chat/join", icon: CalendarPlus },
      { name: "Scheduled Meetings", path: "/dashboard/chat/schedule", icon: CalendarDays },
      { name: "Chat Settings", path: "/dashboard/chat/settings", icon: Settings },
    ],
    "AI Interview": [
      { name: "Start Interview", path: "/dashboard/interview/start", icon: Settings },
      { name: "Interview History", path: "/dashboard/interview/history", icon: Settings },
      { name: "Interview Settings", path: "/dashboard/interview/settings", icon: Settings },
    ],
  },
  setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
  setWorkspaceMenus: (workspace, menus) => set((state) => ({
    workspaceMenus: {
      ...state.workspaceMenus,
      [workspace]: menus,
    },
  })),
}));
