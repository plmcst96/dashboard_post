import { useAuthStore } from "../auth/auth.store";
import Box from "@mui/material/Box";

import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLayoutStore } from "../store/useLayoutStore";
import logo from "../assets/logo.png";
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useMemo } from "react";
import { drawerWidth, FloatingDrawer } from "../utils/styleMUI";


type Props = {
  children: React.ReactNode;
};

export const PageLayout = ({ children }: Props) => {
  const logout = useAuthStore((state) => state.logout);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const drawerOpen = useLayoutStore((state) => state.drawerOpen);
  const selectedIndex = useLayoutStore((state) => state.selectedIndex);
  const setDrawerOpen = useLayoutStore((state) => state.setDrawerOpen);
  const setSelectedIndex = useLayoutStore((state) => state.setSelectedIndex);

  const items = ["Dashboard", "Post", "User"];
  const icons = [
    <DashboardOutlinedIcon />,
    <ArticleOutlinedIcon />,
    <PeopleOutlinedIcon />,
  ];
  const routes = useMemo(() => ["/", "/posts", "/users"], []);

  useEffect(() => {
  const currentIndex = routes.findIndex((r) => r === location.pathname);
  if (currentIndex !== -1 && currentIndex !== selectedIndex) {
    setSelectedIndex(currentIndex);
  }
}, [location.pathname, selectedIndex, setSelectedIndex, routes]);


  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
    navigate(routes[index]);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      <CssBaseline />

      {/* Drawer */}
      <FloatingDrawer variant="permanent" open={drawerOpen}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 35, margin: "12px 0 0 12px" }}
          />
          {drawerOpen && (
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", ml: 1, mt: 1 }}
            >
              AdminPortal
            </Typography>
          )}
        </Box>
        <List
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            mt: 5,
          }}
        >
          {items.map((text, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
                sx={{
                  justifyContent: "center",
                  px: 2.5,
                  minHeight: 64,
                  "&.Mui-selected": {
                    bgcolor: "transparent",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: "#F4D55D",
                    },
                  },
                  "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                    color: theme.palette.background.default,
                    transition: "color 0.3s",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : 0,
                    justifyContent: "center",
                    fontSize: 32,
                    "& svg": { fontSize: 32 },
                  }}
                >
                  {icons[index]}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ display: drawerOpen ? "block" : "none", ml: 1 }}
                />
              </ListItemButton>
              
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: "auto", mb: 2 }}>
            <ListItemButton
             sx={{
                  justifyContent: "center",
                  px: 2.5,
                  minHeight: 64,
                  "&.Mui-selected": {
                    bgcolor: "transparent",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: "#F4D55D",
                    },
                  },
                  "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                    color: theme.palette.background.default,
                    transition: "color 0.3s",
                  },
                }}
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 0,
                  justifyContent: "center",
                  fontSize: 32,
                  "& svg": { fontSize: 32 },
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ display: drawerOpen ? "block" : "none", ml: 1 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </FloatingDrawer>

      {/* Pulsante toggle */}
      <IconButton
        id="click-drawer"
        onClick={() => setDrawerOpen(!drawerOpen)}
        sx={{
          position: "absolute",
          top: 20,
          left: { xs: 16, sm: drawerOpen ? drawerWidth - 20 : 120 - 12 },
          zIndex: 120,
          backgroundColor: theme.palette.primary.main,
          boxShadow: 2,
          borderRadius: "50%",
        }}
      >
        {drawerOpen ? (
          <ChevronLeftIcon sx={{ color: theme.palette.primary.contrastText }} />
        ) : (
          <ChevronRightIcon
            sx={{ color: theme.palette.primary.contrastText }}
          />
        )}
      </IconButton>

      {/* Contenuto principale responsive */}
      {/* Contenuto + Footer */}
      <Box
        sx={{
          flexGrow: 1,
          ml: {
            xs: 0,
            sm: drawerOpen ? `${drawerWidth + 10}px` : "140px",
          },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        {/* MAIN scrollabile */}
        <Box
          component="main"
          sx={{
            mb: 2,
            flexGrow: 1,
            overflowY: "auto", // 👈 SOLO QUI lo scroll
            p: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Box>

        {/* FOOTER */}
        <Box
          component="footer"
          sx={{
            height: 56,
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <span style={{ marginLeft: 12, marginRight:12 }}>© 2026 My Admin</span>
          <span>v1.0.0</span>
        </Box>
      </Box>
    </Box>
  );
};
