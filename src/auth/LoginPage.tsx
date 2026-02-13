import {
  Button,
  Container,
  TextField,
  Alert,
  Paper,
  Typography,
  Grid,
  Box,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuthStore } from "./auth.store";
import { useNavigate } from "react-router";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import logo from "../assets/logo.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState } from "react";

const ImageBox = styled(Paper)({
  height: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: 12,
});

export const LoginPage = () => {
  const { email, password, setEmail, setPassword, login, error } =
    useAuthStore();
  const [visualization, setVisualization] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await login(email, password);

    if (user) {
      navigate("/");
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflow: "hidden", // niente scroll
      }}
    >
      <Box
        component="header"
        sx={{
          height: 80,
          display: "flex",
          alignItems: "center",
          px: 4,
          borderBottom: "1px solid #ddd",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 50 }} />
        <Typography
          variant="h6"
          sx={{ color: "black", ml: 2, fontWeight: "bold" }}
        >
          AdminPortal
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          p: 8,
          minHeight: 0, // importante per far funzionare flex e scroll interni
        }}
      >
        <Grid
          container
          spacing={10}
          alignItems="stretch"
          sx={{ flexGrow: 1, minHeight: 0 }}
        >
          {/* SINISTRA - GRIGLIA IMMAGINI */}
          <Grid size={{ md: 7 }} sx={{ display: { xs: "none", md: "block" } }}>
            <Grid container spacing={2} height="100%">
              <Grid size={{ md: 8 }}>
                <ImageBox sx={{ backgroundImage: `url(${img1})` }} />
              </Grid>

              <Grid size={{ md: 4 }}>
                <ImageBox sx={{ backgroundImage: `url(${img2})` }} />
              </Grid>

              <Grid size={{ md: 4 }}>
                <ImageBox sx={{ backgroundImage: `url(${img3})` }} />
              </Grid>

              <Grid size={{ md: 8 }}>
                <ImageBox sx={{ backgroundImage: `url(${img4})` }} />
              </Grid>
            </Grid>
          </Grid>

          {/* DESTRA - LOGIN */}
          <Grid
            size={{ xs: 12, md: 5 }}
            display="flex"
            alignItems="anchor-center"
            justifyContent="center"
          >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" mb={2}>
                Log In
              </Typography>
              <Typography variant="body2" mb={3}>
                Please enter your credentials to manage the platform.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px", // rotondo
                  },
                }}
              />

              <TextField
                label="Password"
                type={visualization ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={() => setVisualization((prev) => !prev)}>
                        {visualization ? (
                          <VisibilityOffOutlinedIcon
                            color="action"
                            sx={{ fontSize: 25 }}
                          />
                        ) : (
                          <VisibilityOutlinedIcon
                            color="action"
                            sx={{ fontSize: 25 }}
                          />
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "15px",
                    height: 56,
                    alignItems: "center",
                  },
                }}
              />

              <Typography variant="body2" mt={1} color="textSecondary">
                Forgot your password?
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, borderRadius: "30px", padding: "10px 0" }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography sx={{ color: "black" }}>
          &copy; 2026 Nome Azienda. Tutti i diritti riservati.
        </Typography>
      </Box>
    </Container>
  );
};
