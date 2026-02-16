/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useState } from "react";
import { theme } from "../main";
import { useAuthStore } from "../auth/auth.store";
import SlateEditor, { type CustomElement } from "./SlateEditor";
import { type Descendant } from "slate";
import { fileToBase64 } from "../utils/function";

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
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    timeLecture?: string;
    category?: string;
  }>({});

  const toggleDrawer = (newOpen: boolean) => () => {
    if (!newOpen) resetForm();
    setOpen(newOpen);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    const hasContent = value.some(
      (n) => "children" in n && n.children.some((c: any) => c.text?.trim()),
    );

    if (!hasContent) {
      newErrors.content = "Content is required";
    }

    if (!timeLecture || Number(timeLecture) <= 0) {
      newErrors.timeLecture = "Time lecture must be greater than 0";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setTags("");
    setTimeLecture("");
    setImage("");
    setCategory("Travel");
    setErrors({});
    setValue([
      {
        type: "paragraph",
        children: [{ text: "" }],
      } as CustomElement,
    ]);
  };

  const handleSave = (status: string) => {
    if (!validate()) return;
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
    resetForm();
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
            required
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
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
            <SlateEditor value={value} setValue={setValue} />
          </Box>
          {errors.content && (
            <Typography color="error" variant="caption">
              {errors.content}
            </Typography>
          )}

          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
          />
          <TextField
            required
            type="number"
            label="Time Lecture (minutes)"
            value={timeLecture}
            onChange={(e) => {
              setTimeLecture(e.target.value);
              setErrors((prev) => ({ ...prev, timeLecture: undefined }));
            }}
            error={!!errors.timeLecture}
            helperText={errors.timeLecture}
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
              required
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => {
                setCategory(e.target.value as Post["category"]);
                setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              error={!!errors.category}
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
