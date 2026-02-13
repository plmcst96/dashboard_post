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
import { usePostStore, type Post } from "../store/post";
import { useTableStore } from "../store/post-table";
import { useNavigate } from "react-router";
import { useUserStore } from "../store/users";
import avatar from "../assets/avatar_25.jpg";
import { categoryColors } from "../utils/function";

export const PostsTable = () => {
  const {
    posts,
    fetchPosts,
    deletePost,
    fetchState,
    updateState,
    deleteState,
  } = usePostStore();
  const { fetchUsers, users } = useUserStore();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();

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
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = useMemo<MRT_ColumnDef<Post>[]>(
    () => [
      { accessorKey: "id", header: "ID", enableEditing: false, size: 80 },
      {
        accessorKey: "title",
        header: "Title",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.title,
          helperText: validationErrors.title,
          onFocus: () => setValidationErrors((e) => ({ ...e, title: "" })),
        },
      },
      {
        header: "Author",

        accessorFn: (row) => {
          const user = users.find((u) => u.id === row.userId);
          return user ? `${user.name} ${user.surname}` : "Unknown";
        },
        id: "author",
        editVariant: "select",
        editSelectOptions: users.map((user) => ({
          value: user.id,
          label: `${user.name} ${user.surname}`,
        })),
        Cell: ({ cell }) => {
          const userId = cell.row.original.userId;

          const user = users.find((u) => Number(u.id) === Number(userId));

          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar>
                <img src={avatar} alt="Avatar" width={40} />
              </Avatar>
              <Typography variant="body2">
                {user ? `${user.name} ${user.surname}` : "Unknown"}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        editVariant: "select",
        editSelectOptions: [
          "Travel",
          "Food",
          "Fashion",
          "Technology",
          "Health",
        ],
        Cell: ({ cell }) => {
          const value = cell.getValue<Post["category"]>();
          return (
            <Box
              component="span"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: categoryColors[value],
                color: "#191810",
                display: "inline-block",
              }}
            >
              {value}
            </Box>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        editVariant: "select",
        editSelectOptions: ["published", "draft"],
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        enableEditing: false,
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
    ],
    [validationErrors, users],
  );

  const handleDelete = (row: MRT_Row<Post>) => {
    if (window.confirm("Delete this post?")) {
      deletePost(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: posts,
    getRowId: (row) => row.id.toString(),
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
          <IconButton onClick={() => navigate(`/posts/${row.original.id}`)}>
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
