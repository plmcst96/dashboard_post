import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import type {
  MRT_ColumnDef,
  MRT_Row,
  MRT_PaginationState,
  MRT_ColumnFiltersState,
  MRT_SortingState,
} from "material-react-table";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTableStore } from "../store/post-table";
import { useUserStore } from "../store/users";
import avatar from "../assets/avatar_25.jpg";
import type { User } from "../auth/auth.store";

type Props ={
  setOpen: (open: boolean) => void;
  setSelectedUser: (user: User) => void;
}

export const UserTable = ({setOpen, setSelectedUser}:Props) => {
  const {
    users,
    fetchUsers,
    deleteUser,
    fetchState,
    updateState,
    deleteState,
  } = useUserStore();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Zustand table store
  const pageIndex = useTableStore((state) => state.pageIndex);
  const pageSize = useTableStore((state) => state.pageSize);
  const globalFilter = useTableStore((state) => state.globalFilter);
  const columnFilters = useTableStore((state) => state.columnFilters);
  const sorting = useTableStore((state) => state.sorting);

  const setPageIndex = useTableStore((state) => state.setPageIndex);
  const setPageSize = useTableStore((state) => state.setPageSize);
  const setGlobalFilter = useTableStore((state) => state.setGlobalFilter);
  const setColumnFilters = useTableStore((state) => state.setColumnFilters);
  const setSorting = useTableStore((state) => state.setSorting);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "User",
        Cell: ({ row }) => {
          const user = row.original;

          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={avatar} />
              <Typography variant="body2">
                {user.name} {user.surname}
              </Typography>
            </Box>
          );
        },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.name,
          helperText: validationErrors.name,
          onFocus: () => setValidationErrors((e) => ({ ...e, name: "" })),
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        editVariant: "select",
        editSelectOptions: ["admin", "user"],
        Cell: ({ cell }) => (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              width: "50%",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textAlign: "center",
              backgroundColor:
                cell.getValue<string>() === "admin" ? "#FFD700" : "#f89122",
            }}
          >
            {cell.getValue<string>()}
          </Box>
        ),
      },
      {
        id: "fullAddress",
        header: "Address",
        Cell: ({ row }) => {
          const { address, zipCode, province, country } = row.original;

          return (
            <Box>
              <Typography variant="body2">{address}</Typography>
              <Typography variant="caption" color="text.secondary">
                {zipCode} {province}, {country}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [validationErrors],
  );

  const handleDelete = (row: MRT_Row<User>) => {
    if (window.confirm("Delete this user?")) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: users,
    getRowId: (row) => {
      if (row.id == null) {
        console.error("User without id:", row);
        return crypto.randomUUID();
      }
      return row.id.toString();
    },

    enableEditing: true,
    editDisplayMode: "modal",
    positionActionsColumn: "last",
    muiTablePaperProps: {
      elevation: 1,
      sx: { borderRadius: 5, border: "1px solid #E0E0E0" },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Edit">
          <IconButton
  onClick={() => {
    setSelectedUser(row.original);
    setOpen(true);
  }}
>
  <EditIcon sx={{ color: "#191810" }} />
</IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: fetchState.loading,
      isSaving: updateState.loading || deleteState.loading,
      showAlertBanner: !!fetchState.error,
      pagination: { pageIndex, pageSize },
      globalFilter,
      columnFilters,
      sorting,
    },
    onPaginationChange: (
      updaterOrValue:
        | MRT_PaginationState
        | ((old: MRT_PaginationState) => MRT_PaginationState),
    ) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue({ pageIndex, pageSize })
          : updaterOrValue;

      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    onGlobalFilterChange: (newFilter: string) => {
      setGlobalFilter(newFilter);
    },
    onColumnFiltersChange: (
      updaterOrValue:
        | MRT_ColumnFiltersState
        | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState),
    ) => {
      const newFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnFilters)
          : updaterOrValue;

      setColumnFilters(newFilters);
    },
    onSortingChange: (
      updaterOrValue:
        | MRT_SortingState
        | ((old: MRT_SortingState) => MRT_SortingState),
    ) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      setSorting(newSorting);
    },
    muiToolbarAlertBannerProps: fetchState.error
      ? { color: "error", children: fetchState.error }
      : undefined,
  });

  return <MaterialReactTable table={table} />;
};
