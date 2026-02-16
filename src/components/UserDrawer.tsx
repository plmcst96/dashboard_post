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
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState<{
    name?: string;
    surname?: string;
    email?: string;
    role?: string;
  }>({});

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
        setPassword(selectedUser.password || "");
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
        setPassword("password123");
      }
    }, 0);

    return () => clearTimeout(timer); // pulizia
  }, [open, selectedUser]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!surname.trim()) newErrors.surname = "Surname is required";
    if (!role.trim()) newErrors.role = "Role is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email is not valid";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const userData: Omit<User, "id"> = {
      name,
      surname,
      email,
      password, // opzionale per update
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
    setPassword("password123");

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
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={!!errors.name}
            helperText={errors.name}
            required
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
            onChange={(e) => {
              setSurname(e.target.value);
              setErrors((prev) => ({ ...prev, surname: undefined }));
            }}
            error={!!errors.surname}
            helperText={errors.surname}
            required
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
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            required
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
              required
              value={role}
              label="Role"
              onChange={(e) => {
                setRole(e.target.value as User["role"]);
                setErrors((prev) => ({ ...prev, role: undefined }));
              }}
              sx={{
                borderRadius: "30px",
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: "30px" },
              }}
              error={!!errors.role}
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
