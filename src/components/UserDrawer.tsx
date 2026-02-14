import Drawer from "@mui/material/Drawer";
import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/users";
import type { User } from "../auth/auth.store";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedUser: User | null;
};

export default function UserDrawer({ open, setOpen, selectedUser }: Props) {
  const { addUser, userState, updateState, updateUser } = useUserStore();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<User["role"]>("user");

  useEffect(() => {
    // Aggiorna i campi solo quando il drawer è aperto
    if (!open) return;

    // Posticipa l'aggiornamento di stato al "next tick" di React
    const timer = setTimeout(() => {
      if (selectedUser) {
        setName(selectedUser.name);
        setSurname(selectedUser.surname);
        setEmail(selectedUser.email);
        setCountry(selectedUser.country || "");
        setProvince(selectedUser.province || "");
        setZipCode(selectedUser.zipCode || "");
        setAddress(selectedUser.address || "");
        setRole(selectedUser.role);
      } else {
        // reset campi
        setName("");
        setSurname("");
        setEmail("");
        setCountry("");
        setProvince("");
        setZipCode("");
        setAddress("");
        setRole("user");
      }
    }, 0);

    return () => clearTimeout(timer); // pulizia
  }, [open, selectedUser]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const handleSave = async () => {
    if (!name || !surname || !email) return;

    const userData: Omit<User, "id"> = {
      name,
      surname,
      email,
      password: "", // opzionale per update
      country,
      province,
      zipCode,
      address,
      city: null,
      role,
    };

    if (selectedUser) {
      // MODIFICA UTENTE
      await updateUser(selectedUser.id, userData);
    } else {
      // CREAZIONE NUOVO UTENTE
      await addUser(userData);
    }

    // reset campi
    setName("");
    setSurname("");
    setEmail("");
    setCountry("");
    setProvince("");
    setZipCode("");
    setAddress("");
    setRole("user");

    setOpen(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 500, p: 3 }}>
        <Typography variant="h5" mb={2}>
          Create New User
        </Typography>

        <FormGroup>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px", // rotondo
              },
            }}
          />

          <TextField
            label="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px", // rotondo
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
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
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px", // rotondo
              },
            }}
          />

          <TextField
            label="Province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px", // rotondo
              },
            }}
          />

          <TextField
            label="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px", // rotondo
              },
            }}
          />

          <TextField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px", // rotondo
              },
            }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as User["role"])}
              sx={{
                borderRadius: "30px",
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: "30px" },
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, borderRadius: "30px" }}
            onClick={handleSave}
            disabled={userState.loading || updateState.loading} // se vuoi bloccare anche update
          >
            {selectedUser
              ? updateState.loading
                ? "Updating..."
                : "Update User"
              : userState.loading
                ? "Saving..."
                : "Create User"}
          </Button>
        </FormGroup>
      </Box>
    </Drawer>
  );
}
