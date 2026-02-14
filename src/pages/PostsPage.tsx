import { Typography, Box, Breadcrumbs, Button } from "@mui/material";
import { PageLayout } from "../components/PageLayout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { PostsTable } from "../components/PostsTable";
import { useState } from "react";
import PostDrawer from "../components/PostDrawer";

export const PostsPage = () => {
  const [open, setOpen] = useState(false);

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
              Posts Managment
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
            Posts Managment
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 5 }}
            onClick={() => setOpen(!open)}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} />
            Create New User
          </Button>
        </Box>
        <Box>
          <PostsTable />
        </Box>
        <PostDrawer open={open} setOpen={setOpen} />
      </Box>
    </PageLayout>
  );
};
