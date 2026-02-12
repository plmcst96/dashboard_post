/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { PageLayout } from "../components/PageLayout";
import { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import img from "../assets/avatar_25.jpg";
import SearchIcon from "@mui/icons-material/Search";
import AirplanemodeActiveOutlinedIcon from "@mui/icons-material/AirplanemodeActiveOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EdgesensorLowOutlinedIcon from "@mui/icons-material/EdgesensorLowOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import { usePostStore } from "../store/post";
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
import { useNavigate } from "react-router";
import { useLayoutStore } from "../store/useLayoutStore";

export const DashboardPage = () => {
  const posts = usePostStore((state) => state.posts);
  const fetchPosts = usePostStore((state) => state.fetchPosts);
  const fetchState = usePostStore((state) => state.fetchState);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const selectedCategory = useLayoutStore((state) => state.selectedCategory);
  const setSelectedCategory = useLayoutStore(
    (state) => state.setSelectedCategory,
  );

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

  const category = [
    {
      name: "All",
      color: "#fdd58b",
      icon: (
        <CalendarViewMonthOutlinedIcon
          sx={{ color: "#191810", fontSize: 20 }}
        />
      ),
    },
    {
      name: "Travel",
      color: "#F4D55D",
      icon: (
        <AirplanemodeActiveOutlinedIcon
          sx={{ color: "#191810", fontSize: 20 }}
        />
      ),
    },
    {
      name: "Food",
      color: "#FFACA0",
      icon: <FastfoodOutlinedIcon sx={{ color: "#191810", fontSize: 20 }} />,
    },
    {
      name: "Fashion",
      color: "#b1e89b",
      icon: <DiamondOutlinedIcon sx={{ color: "#191810", fontSize: 20 }} />,
    },
    {
      name: "Technology",
      color: "#cccefd",
      icon: (
        <EdgesensorLowOutlinedIcon sx={{ color: "#191810", fontSize: 20 }} />
      ),
    },
    {
      name: "Health",
      color: "#b6ebfc",
      icon: (
        <FavoriteBorderOutlinedIcon sx={{ color: "#191810", fontSize: 20 }} />
      ),
    },
  ];

  const handleCardColor = (category: string) => {
    switch (category) {
      case "Travel":
        return "#F4D55D";
      case "Food":
        return "#FFACA0";
      case "Fashion":
        return "#b1e89b";
      case "Technology":
        return "#cccefd";
      case "Health":
        return "#b6ebfc";
      default:
        return "#fdd58b";
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filtra per categoria e ricerca
  const filteredPosts = posts.filter((p) => {
    const matchCategory =
      !selectedCategory || selectedCategory === "All"
        ? true
        : p.category === selectedCategory;
    const matchSearch = p.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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

  return (
    <PageLayout>
      <Box sx={{ p: 3, height: "100%" }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" sx={{ fontSize: 25 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "15px", height: 56, alignItems: "center" },
            }}
          />

          <IconButton
            sx={{
              borderRadius: "10px",
              border: "1px solid #ddd",
              mt: { xs: 2, sm: 0 },
            }}
          >
            <NotificationsNoneIcon />
          </IconButton>

          <Avatar sx={{ cursor: "pointer" }}>
            <img src={img} alt="User Avatar" width={40} />
          </Avatar>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
            Welcome back!
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            What will you create today?
          </Typography>
        </Box>

        {/* CATEGORIE */}
        <Box sx={{ mt: 4 }}>
          {category.map((cat) => (
            <Button
              onClick={() => setSelectedCategory(cat.name)}
              key={cat.name}
              sx={{
                pl: 1,
                pr: 2,
                py: 1,
                mr: 2,
                textTransform: "none",
                color: "#191810",
                border: `1px solid ${cat.color}`,
                borderRadius: "15px",
                backgroundColor:
                  selectedCategory === cat.name ? cat.color : "transparent",
              }}
            >
              <Box
                sx={{
                  backgroundColor: cat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                  p: 0.5,
                  borderRadius: "50%",
                }}
              >
                {cat.icon}
              </Box>
              {cat.name}
            </Button>
          ))}
        </Box>

        {/* CONTENUTO POST */}
        <Box sx={{ mt: 4 }}>
          {fetchState.loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          )}

          {fetchState.error && (
            <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>
              {fetchState.error}
            </Typography>
          )}

          {!fetchState.loading && !fetchState.error && (
            <Box
              sx={{
                display: "grid",
                gap: 4,
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                pb: 1,
              }}
            >
              {filteredPosts.map((post) => {
                const previwContent = extractTextFromSlate(post.content);
                return (
                  <Card
                    key={post.id}
                    sx={{ borderRadius: 3, boxShadow: 3 }}
                    style={{ backgroundColor: handleCardColor(post.category) }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={getPostImage(post.image)}
                      alt={post.title}
                    />

                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {previwContent.slice(0, 100) ||
                          post.content.slice(0, 100)}
                        ...
                      </Typography>
                      <Button
                        onClick={() => navigate(`/posts/${post.id}`)}
                        fullWidth
                        sx={{
                          mt: 2,
                          backgroundColor: "#191810",
                          color: "#fff",
                        }}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </PageLayout>
  );
};
