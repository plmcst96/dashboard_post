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
import { usePostStore, type Post } from "../store/post";
import { useState} from "react";
import { theme } from "../main";
import { useAuthStore } from "../auth/auth.store";
import SlateEditor, { type CustomElement } from "./SlateEditor";
import type { Descendant } from "slate";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

// --- PostDrawer ---
export default function PostDrawer({ open, setOpen }: Props) {
  const { addPost } = usePostStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [timeLecture, setTimeLecture] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<Post["category"]>("Travel");
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "" }] } as CustomElement,
  ]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = (status: string) => {
    const content = JSON.stringify(value);
    const post: Omit<Post, "id"> = {
      userId: user?.id || 1,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags.split(",").map((t) => t.trim()),
      timeLecture: Number(timeLecture),
      rate: 0,
      image,
      category,
      status: status as Post["status"],
    };
    addPost(post);
    setOpen(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 600, p: 2 }}>
        <Typography variant="h5" mb={2}>
          Create New Post
        </Typography>
        <FormGroup>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
          />
          <Typography mb={1}>Content</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              minHeight: 200,
              maxHeight: 400,
              width: "100%",
              p: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <SlateEditor value={value} setValue={setValue}/>
            
          </Box>
          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
          />
          <TextField
            type="number"
            label="Time Lecture (minutes)"
            value={timeLecture}
            onChange={(e) => setTimeLecture(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
          />
          <TextField
            type="file"
            onChange={async (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files[0]) {
                const base64 = await fileToBase64(target.files[0]);
                setImage(base64);
              }
            }}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
          />
          <FormControl fullWidth variant="outlined" sx={{ my: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value as Post["category"])}
              sx={{
                borderRadius: "30px",
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: "30px" },
              }}
            >
              {["Travel", "Food", "Fashion", "Technology", "Health"].map(
                (cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
          <Box display="flex" gap={2} mt={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSave("draft")}
              sx={{
                borderRadius: "30px",
                borderColor: theme.palette.primary.contrastText,
                color: theme.palette.primary.contrastText,
              }}
            >
              Save Draft
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleSave("published")}
              sx={{ borderRadius: "30px" }}
            >
              Publish Post
            </Button>
          </Box>
        </FormGroup>
      </Box>
    </Drawer>
  );
}
