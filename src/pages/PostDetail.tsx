import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { usePostStore, type Post } from "../store/post";
import { PageLayout } from "../components/PageLayout";

import { useEffect, useState } from "react";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import avatar from "../assets/avatar_25.jpg";
import { useUserStore } from "../store/users";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import SlateEditor, { type CustomElement } from "../components/SlateEditor";
import type { Descendant } from "slate";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import {
  categoryColors,
  fileToBase64,
  formatDate,
  formatDate1,
  getPostImage,
} from "../utils/function";
import { IOSSwitch } from "../utils/styleMUI";
import { PostContent } from "../components/PostContent";

export const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    post,
    fetchPost,
    fetchState,
    updatePost,
    updateState,
    deletePost,
    deleteState,
    addComment,
  } = usePostStore();
  const [edit, setEdit] = useState(false);
  const { user, fetchUser, fetchUsers, users } = useUserStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl1);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [timeLecture, setTimeLecture] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<Post["category"]>("Travel");
  const [contentValue, setContentValue] = useState<Descendant[]>([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const [openComment, setOpenComment] = useState(false);
  const [titleComment, setTitleComment] = useState("");
  const [contentComment, setContentComment] = useState("");
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);

  //state iniziale dati
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchPost(id!);
  }, [fetchPost, id]);

  useEffect(() => {
    if (post?.userId) {
      fetchUser(post.userId);
    }
  }, [fetchUser, post?.userId]);

  const handleToggleEdit = () => {
    if (!edit && post) {
      setTitle(post.title);
      setTags(post.tags || []);
      setTimeLecture(post.timeLecture);
      setImage("");
      setCategory(post.category);
      setSelectedUser(post.userId);

      if (post.content) {
        try {
          setContentValue(JSON.parse(post.content));
        } catch {
          setContentValue([
            {
              type: "paragraph",
              children: [{ text: post.content }],
            } as CustomElement,
          ]);
        }
      }
    }

    setEdit((prev) => !prev);
  };

  //apre e chiude menu commenti
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    commentId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(commentId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //apre e chiude menu per cambiare autore
  const handleClick1 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setOpenDeleteDialog(false);
  };

  //render pagina il loading ed error
  if (fetchState.loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Post not found</Typography>
      </Box>
    );
  }

  //handle per i tag in fase di edit
  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const newTag = prompt("Insert new tag");
    if (newTag && newTag.trim() !== "") {
      setTags((prev) => [...prev, newTag.trim()]);
    }
  };

  const displayedAuthor = edit
    ? users.find((u) => u.id === selectedUser)
    : user;

  //handle image in fase di edit
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ validazione tipo
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only JPG and PNG images are allowed");
      return;
    }

    // ✅ validazione size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const base64 = await fileToBase64(file);
    setImage(base64);
  };

  const handleUpdate = async (status: string) => {
    if (!post) return;

    // Reset update state
    usePostStore.setState((state) => ({
      updateState: {
        ...state.updateState,
        error: null,
        success: null,
        loading: true,
      },
    }));

    try {
      await updatePost(id!, {
        userId: selectedUser,
        title,
        content: JSON.stringify(contentValue),
        tags,
        timeLecture: Number(timeLecture),
        image: image || post.image,
        category,
        status: status as Post["status"],
      });

      // Aggiorna i dati del post
      await fetchPost(id!);

      // Chiude edit solo se tutto è andato a buon fine
      setEdit(false);

      // Mostra messaggio di successo temporaneo
      const timer = setTimeout(() => {
        usePostStore.setState((state) => ({
          updateState: { ...state.updateState, success: null },
        }));
      }, 3000);
      return () => clearTimeout(timer);
    } catch (err) {
      // Mostra errore temporaneo e non chiude edit
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";

      usePostStore.setState((state) => ({
        updateState: {
          ...state.updateState,
          error: errorMessage,
          loading: false,
        },
      }));

      const timer = setTimeout(() => {
        usePostStore.setState((state) => ({
          updateState: { ...state.updateState, error: null },
        }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const handleDelete = () => {
    usePostStore.setState((state) => ({
      deleteState: {
        ...state.deleteState,
        error: null,
        success: null,
        loading: true,
      },
    }));
    try {
      deletePost(id!);
      setEdit(false);

      // Mostra messaggio di successo temporaneo
      const timer = setTimeout(() => {
        usePostStore.setState((state) => ({
          deleteState: { ...state.deleteState, success: null },
        }));
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    } catch (err) {
      // Mostra errore temporaneo e non chiude edit
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";

      usePostStore.setState((state) => ({
        deleteState: {
          ...state.deleteState,
          error: errorMessage,
          loading: false,
        },
      }));

      const timer = setTimeout(() => {
        usePostStore.setState((state) => ({
          deleteState: { ...state.deleteState, error: null },
        }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  };
  const handleSaveComment = async () => {
    if (!id || !titleComment.trim() || !contentComment.trim()) return;

    if (isEditingComment && selectedComment) {
      await usePostStore.getState().updateComment(id, selectedComment, {
        title: titleComment,
        content: contentComment,
      });
    } else {
      await addComment(id, {
        userId: user?.id || 1,
        title: titleComment,
        content: contentComment,
      });
    }

    await fetchPost(id);

    setTitleComment("");
    setContentComment("");
    setOpenComment(false);
    setIsEditingComment(false);
    setSelectedComment(null);
  };

  const handleDeleteComment = async () => {
    if (!id || !selectedComment) return;

    await usePostStore.getState().deleteComment(id, selectedComment);
    await fetchPost(id);

    setOpenDeleteCommentDialog(false);
    setSelectedComment(null);
  };

  return (
    <PageLayout>
      <Box>
        {/*HEADER POST DETAIL*/}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "text.secondary" }}
              onClick={() => window.history.back()}
            >
              Home
            </Typography>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "text.secondary" }}
              onClick={() => window.history.back()}
            >
              Posts
            </Typography>
            <Typography variant="body2">{post.title}</Typography>
          </Breadcrumbs>
          <Box
            display="flex"
            flexDirection="row"
            border="1px solid #F4D55D"
            width={250}
            justifyContent="space-between"
            p={1}
            borderRadius={20}
          >
            <Box p={1} ml={0.5}>
              <Typography fontWeight={600} color="#F4D55D">
                Status
              </Typography>
              <Typography>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </Typography>
            </Box>

            <hr color="#F4D55D" />
            <FormControlLabel
              control={<IOSSwitch sx={{ m: 1 }} />}
              label={edit ? "Edit" : "Show"}
              onChange={handleToggleEdit}
            />
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ flexGrow: 1, minHeight: 0 }}>
          {/*COLONNA SINISTRA*/}
          <Grid size={{ xs: 12, md: 8 }} sx={{ p: 4 }}>
            {/*CARD POST DETAIL*/}
            <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              {edit ? (
                <Select
                  fullWidth
                  labelId="category-label"
                  value={category}
                  label="Category"
                  onChange={(e) =>
                    setCategory(e.target.value as Post["category"])
                  }
                  sx={{
                    borderRadius: "30px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "30px",
                    },
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
              ) : (
                <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: categoryColors[post.category],
                      color: "#191810",
                    }}
                  >
                    <Typography variant="subtitle1">{post.category}</Typography>
                  </Box>
                </Box>
              )}
              {edit ? (
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
                />
              ) : (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {post.title}
                  </Typography>
                </Box>
              )}
              {edit ? (
                <Box>
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/png, image/jpeg" }}
                    onChange={handleImageUpload}
                    fullWidth
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "30px" },
                    }}
                  />

                  <Box sx={{ position: "relative", mt: 2 }}>
                    <CardMedia
                      component="img"
                      image={image ? image : getPostImage(post.image)}
                      alt={title}
                      sx={{
                        height: 400,
                        objectFit: "cover",
                        borderRadius: 3,
                      }}
                    />

                    {image && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => setImage("")}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          borderRadius: 5,
                        }}
                      >
                        Remove image
                      </Button>
                    )}
                  </Box>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={getPostImage(post.image)}
                  alt={post.title}
                  sx={{
                    height: 400,
                    objectFit: "cover",
                    borderRadius: 3,
                    mt: 3,
                  }}
                />
              )}

              {edit ? (
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
                    mt: 3,
                  }}
                >
                  <SlateEditor
                    value={contentValue}
                    setValue={setContentValue}
                  />
                </Box>
              ) : (
                <Typography component="div" variant="body1" sx={{ mt: 4 }}>
                  <Box sx={{ mt: 4 }}>
                    <PostContent content={post.content} />
                  </Box>

                  <Typography>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
                    blanditiis veritatis nam exercitationem ad esse saepe
                    molestias necessitatibus qui. Distinctio perferendis aliquam
                    aperiam, explicabo modi neque architecto nostrum ea nihil?
                  </Typography>

                  <Typography>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio maiores facilis officiis mollitia libero
                    consequuntur! Earum nam modi sit cum ipsa. Alias esse
                    veritatis saepe voluptatum reiciendis doloribus nihil ipsam?
                  </Typography>
                </Typography>
              )}
            </Card>
            {/*CARD comment*/}
            <Card elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
              <Box>
                <Grid container>
                  <Grid
                    size={{ xs: 12 }}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Box display="flex" flexDirection="row">
                      <QuestionAnswerOutlinedIcon
                        sx={{ mr: 2, color: "#F4D55D", fontSize: 30 }}
                      />
                      <Typography variant="h6">
                        Comments ({post.comments?.length})
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => setOpenComment(true)}
                      sx={{ borderRadius: 5 }}
                    >
                      Add Comment +
                    </Button>
                  </Grid>
                  {post.comments?.length && post.comments?.length > 2 ? (
                    <Grid
                      size={{ xs: 12, md: 6 }}
                      display="flex"
                      flexDirection="row"
                      justifyContent="end"
                    >
                      <Button size="large" variant="text">
                        View All
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
                <hr />
                <Grid container mt={2}>
                  {post.comments &&
                    post.comments.map((com) => (
                      <React.Fragment key={com.id}>
                        <Grid
                          size={{ xs: 6 }}
                          display="flex"
                          flexDirection="row"
                        >
                          <Avatar>
                            <img src={avatar} alt="avatar" width={40} />
                          </Avatar>
                          <Box sx={{ ml: 2 }}>
                            <Typography>
                              {user?.name + " " + user?.surname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(com.createdAt)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          size={{ xs: 6 }}
                          display="flex"
                          justifyContent="end"
                        >
                          <IconButton onClick={(e) => handleClick(e, com.id)}>
                            <MoreVertIcon />
                          </IconButton>

                          <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                const comment = post.comments?.find(
                                  (c) => c.id === selectedComment,
                                );
                                if (!comment) return;

                                setTitleComment(comment.title);
                                setContentComment(comment.content);
                                setIsEditingComment(true);
                                setOpenComment(true);
                                handleClose();
                              }}
                            >
                              <ModeEditOutlinedIcon
                                sx={{ fontSize: 20, mr: 1 }}
                              />
                              Edit Comment
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setOpenDeleteCommentDialog(true);
                                handleClose();
                              }}
                            >
                              <DeleteOutlinedIcon
                                sx={{ fontSize: 20, mr: 1 }}
                              />
                              Delete Comment
                            </MenuItem>
                          </Menu>
                        </Grid>

                        <Grid mt={1} mb={2}>
                          <Typography variant="subtitle1">
                            {com.title}
                          </Typography>
                          <Typography variant="body2">{com.content}</Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                </Grid>
              </Box>
            </Card>
          </Grid>
          {/*COLONNA DESTRA*/}
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: 4 }}>
            {/*CARD AUTORE*/}
            <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                POST AUTHOR
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Avatar>
                  <img src={avatar} alt="avatar" width={40} />
                </Avatar>
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {displayedAuthor
                    ? displayedAuthor.name + " " + displayedAuthor.surname
                    : user?.name + " " + user?.surname}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Rating name="rate" value={post.rate} readOnly />
                <Typography variant="body2" component="legend" sx={{ ml: 2 }}>
                  ({post.rate}/5 rating)
                </Typography>
              </Box>
              {edit && (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, borderRadius: 5 }}
                  onClick={handleClick1}
                >
                  Change Author
                </Button>
              )}
              {open1 && (
                <Menu
                  anchorEl={anchorEl1}
                  open={open1}
                  onClose={() => handleClose1}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  {users.map((us) => (
                    <MenuItem
                      key={us.id}
                      onClick={() => {
                        setSelectedUser(us.id);
                        handleClose1();
                      }}
                    >
                      {us.name + " " + us.surname}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Card>
            {/*CARD METADATA*/}
            <Card elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                METADATA & STATS
              </Typography>
              {edit ? (
                <TextField
                  label="Time Lecture"
                  type="number"
                  value={timeLecture}
                  onChange={(e) => setTimeLecture(Number(e.target.value))}
                  fullWidth
                  margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
                />
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      my: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
                      <Typography variant="body1">Published</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {formatDate1(post.createdAt)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
                      <Typography variant="body1">Total Views</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      12.345
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <AccessTimeOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
                      <Typography variant="body1">Read Time</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {post.timeLecture + "min"}
                    </Typography>
                  </Box>
                </Box>
              )}

              <hr />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                TAGS
              </Typography>
              <Grid container gap={0.5}>
                {(edit ? tags : post.tags)?.map((t, i) => (
                  <Grid
                    size={{ xs: 5, lg: 3 }}
                    key={i}
                    sx={{ border: "1px solid", p: 1, borderRadius: 5 }}
                  >
                    {edit ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                      >
                        <Typography variant="body2">{t}</Typography>
                        <ClearOutlinedIcon
                          sx={{ fontSize: 12 }}
                          onClick={() => handleRemoveTag(i)}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2">{t}</Typography>
                    )}
                  </Grid>
                ))}
                {edit && (
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                    onClick={handleAddTag}
                  >
                    Add Tag +
                  </Button>
                )}
              </Grid>
            </Card>
            {updateState.error && (
              <Alert sx={{ mt: 2 }} severity="error">
                {updateState.error}
              </Alert>
            )}
            {updateState.success && (
              <Alert sx={{ mt: 2 }} severity="success">
                {updateState.success}
              </Alert>
            )}

            {deleteState.error && (
              <Alert sx={{ mt: 2 }} severity="error">
                {deleteState.error}
              </Alert>
            )}
            {deleteState.success && (
              <Alert sx={{ mt: 2 }} severity="success">
                {deleteState.success}
              </Alert>
            )}

            {edit && (
              <Card elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  ADMIN ACTIONS
                </Typography>
                <Grid container gap={2} mt={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ borderRadius: 6 }}
                      onClick={() => handleUpdate(post.status)}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ borderRadius: 6 }}
                      onClick={() => handleUpdate("published")}
                    >
                      Publish
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Button
                      color="error"
                      fullWidth
                      variant="contained"
                      sx={{ borderRadius: 6 }}
                      onClick={handleOpenDeleteDialog}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>

        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this post?
            <br />
            <strong>This action cannot be undone.</strong>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openComment}
        onClose={() => setOpenComment((prev) => !prev)}
        sx={{ padding: 3 }}
      >
        <DialogTitle id="delete-dialog-title">Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            label="Title Comment"
            value={titleComment}
            onChange={(e) => setTitleComment(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          />
          <TextField
            label="Content Comment"
            value={contentComment}
            onChange={(e) => setContentComment(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            sx={{ borderRadius: 5 }}
            onClick={handleSaveComment}
          >
            {isEditingComment ? "Update Comment" : "Save Comment"}
          </Button>

          <Button
            onClick={() => setOpenComment((prev) => !prev)}
            variant="outlined"
            sx={{ borderRadius: 5, color: "black", borderColor: "black" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteCommentDialog}
        onClose={() => setOpenDeleteCommentDialog(false)}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteCommentDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteComment}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};
