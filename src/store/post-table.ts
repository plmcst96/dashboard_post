import { create } from "zustand";
import type { MRT_ColumnFiltersState, MRT_SortingState } from "material-react-table";

type TableState = {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
  columnFilters: MRT_ColumnFiltersState;
  sorting: MRT_SortingState;
  
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setGlobalFilter: (filter: string) => void;
  setColumnFilters: (filters: MRT_ColumnFiltersState) => void;
  setSorting: (sorting: MRT_SortingState) => void;
};

export const useTableStore = create<TableState>((set) => ({
  pageIndex: 0,
  pageSize: 10,
  globalFilter: "",
  columnFilters: [],
  sorting: [],
  setPageIndex: (index: number) => set({ pageIndex: index }),
  setPageSize: (size: number) => set({ pageSize: size }),
  setGlobalFilter: (filter: string) => set({ globalFilter: filter }),
  setColumnFilters: (filters: MRT_ColumnFiltersState) => set({ columnFilters: filters }),
  setSorting: (sorting: MRT_SortingState) => set({ sorting }),
}));