/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardMedia,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import { usePostStore } from "../store/post";
import { PageLayout } from "../components/PageLayout";
import travel1 from "../assets/posts/travel1.jpg";
import travel2 from "../assets/posts/travel2.jpg";
import food1 from "../assets/posts/food1.jpg";
import food2 from "../assets/posts/food2.jpg";
import fashion1 from "../assets/posts/fashion1.jpg";
import fashion2 from "../assets/posts/fashion2.jpg";
import tech1 from "../assets/posts/tech1.jpg";
import tech2 from "../assets/posts/tech2.jpg";
import health1 from "../assets/posts/health1.jpg";
import health2 from "../assets/posts/health2.jpg";
import { useEffect, useState } from "react";
import Switch, { type SwitchProps } from "@mui/material/Switch";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import avatar from "../assets/avatar_25.jpg";
import { useUserStore } from "../store/users";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#F4D55D",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#F4D55D",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#F4D55D",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

export const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { post, fetchPost, fetchState } = usePostStore();
  const [edit, setEdit] = useState(false);
  const { user, fetchUser } = useUserStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchPost(Number(id));
  }, [fetchPost, id]);

  useEffect(() => {
    if (post?.userId) {
      fetchUser(post.userId);
    }
  }, [fetchUser, post?.userId]);

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

  const imageMap: Record<string, string> = {
    "travel1.jpg": travel1,
    "travel2.jpg": travel2,
    "food1.jpg": food1,
    "food2.jpg": food2,
    "fashion1.jpg": fashion1,
    "fashion2.jpg": fashion2,
    "tech1.jpg": tech1,
    "tech2.jpg": tech2,
    "health1.jpg": health1,
    "health2.jpg": health2,
  };

  const extractTextFromSlate = (content: string): string => {
    try {
      const nodes = JSON.parse(content);
      return nodes
        .map((n: any) => n.children?.map((c: any) => c.text).join(""))
        .join(" ");
    } catch {
      return "";
    }
  };

  const getPostImage = (image?: string) => {
    if (!image) return health1;

    // ✅ Caso Base64
    if (image.startsWith("data:image")) {
      return image;
    }

    // ✅ Caso path del db: "../assets/posts/health2.jpg"
    const fileName = image.split("/").pop() || "";

    if (imageMap[fileName]) {
      return imageMap[fileName];
    }

    // ❌ fallback finale
    return health1;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
  };

  return (
    <PageLayout>
      <Box>
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
              onChange={() => setEdit(true)}
            />
          </Box>
        </Box>
        <Grid
          container
          spacing={3}
          sx={{ flexGrow: 1, minHeight: 0 }}
        >
          <Grid size={{ xs: 12, md: 8 }} sx={{ p: 4 }}>
            <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {post.title}
                </Typography>
              </Box>

              <CardMedia
                component="img"
                height="300"
                image={getPostImage(post.image)}
                alt={post.title}
                sx={{ borderRadius: 3, mt: 3 }}
              />

              <Typography component="div" variant="body1" sx={{ mt: 4 }}>
                <Typography>
                  {post.content || extractTextFromSlate(post.content)}
                </Typography>

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
            </Card>
            <Card elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
              <Box>
                <Grid container>
                  <Grid
                    size={{ xs: 12, md: 6 }}
                    display="flex"
                    flexDirection="row"
                  >
                    <QuestionAnswerOutlinedIcon
                      sx={{ mr: 2, color: "#F4D55D", fontSize: 30 }}
                    />
                    <Typography variant="h6">
                      Comments ({post.comments?.length})
                    </Typography>
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
                <Grid container>
                  {post.comments &&
                    post.comments.map((com) => (
                      <React.Fragment key={com.id}>
                        <Grid
                          size={{ xs: 12, md: 6 }}
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
                          size={{ xs: 12, md: 6 }}
                          display="flex"
                          justifyContent="end"
                        >
                         
                              <IconButton onClick={handleClick}>
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
                                <MenuItem onClick={handleClose}>
                                  <ModeEditOutlinedIcon
                                    sx={{ fontSize: 20, mr: 1 }}
                                  />
                                  Edit Comment
                                </MenuItem>

                                <MenuItem onClick={handleClose}>
                                  <AddCircleOutlineOutlinedIcon
                                    sx={{ fontSize: 20, mr: 1 }}
                                  />
                                  Add Comment
                                </MenuItem>

                                <MenuItem onClick={handleClose}>
                                  <DeleteOutlinedIcon
                                    sx={{ fontSize: 20, mr: 1 }}
                                  />
                                  Delete Comment
                                </MenuItem>
                              </Menu>
                      
                        </Grid>
                        <Grid mt={2}>
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
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: 4 }}>
            <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>

            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageLayout>
  );
};
