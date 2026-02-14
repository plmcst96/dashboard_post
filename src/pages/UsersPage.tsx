import { Box, Breadcrumbs, Button, Typography } from "@mui/material";
import { PageLayout } from "../components/PageLayout";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { UserTable } from "../components/UserTable";
import UserDrawer from "../components/UserDrawer";
import type { User } from "../auth/auth.store";

export const UsersPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  return (
    <PageLayout>
      <Box>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "text.secondary" }}
              onClick={() => window.history.back()}
            >
              Home
            </Typography>

            <Typography variant="body2" sx={{ color: "#191810" }}>
              Users Managment
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            my: 3,
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            Users Managment
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 5 }}
            onClick={() => {
              setOpen((prev) => !prev);
              setSelectedUser(null);
            }}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} />
            Create New User
          </Button>
        </Box>
        <Box>
          <UserTable setOpen={setOpen} setSelectedUser={setSelectedUser} />
        </Box>
        <UserDrawer open={open} setOpen={setOpen} selectedUser={selectedUser} />
      </Box>
    </PageLayout>
  );
};
