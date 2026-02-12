import { create } from "zustand";

interface LayoutState {
  drawerOpen: boolean;
  selectedIndex: number;
  selectedCategory: string | null;
  setDrawerOpen: (open: boolean) => void;
  setSelectedIndex: (index: number) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  drawerOpen: false,
  selectedIndex: 0,
  selectedCategory: "All",
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
