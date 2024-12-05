import { create } from 'zustand';

type MenuItem = {
  name: string;
  path: string;
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
      { name: "New File", path: "/dashboard/compiler/new" },
      { name: "Projects", path: "/dashboard/compiler/projects" },
      { name: "Settings", path: "/dashboard/compiler/settings" },
    ],
    "Video Chat": [
      { name: "Join Meeting", path: "/dashboard/chat/join" },
      { name: "Scheduled Meetings", path: "/dashboard/chat/schedule" },
      { name: "Chat Settings", path: "/dashboard/chat/settings" },
    ],
    "AI Interview": [
      { name: "Start Interview", path: "/dashboard/interview/start" },
      { name: "Interview History", path: "/dashboard/interview/history" },
      { name: "Interview Settings", path: "/dashboard/interview/settings" },
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
