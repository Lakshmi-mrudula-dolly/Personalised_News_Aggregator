import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, Typography, CssBaseline, Container, Box, AppBar, IconButton } from "@mui/material";
import { AccountCircle, Feed, Business, Sports, Tv, Public, Newspaper, Theaters, Home as HomeIcon } from "@mui/icons-material";
import MyAccount from "./MyAccount";
import MyFeed from "./MyFeed";
import CategoryPage from "./CategoryPage";

const categories = [
  { name: "Business", icon: <Business /> },
  { name: "Technology", icon: <Newspaper /> },
  { name: "Sports", icon: <Sports /> },
  { name: "Entertainment", icon: <Theaters /> },
  { name: "National", icon: <Tv /> },
  { name: "International", icon: <Public /> },
  { name: "Politics", icon: <Feed /> },
];

const drawerWidth = 260;

const Home = () => {
  return (
    <>
      <CssBaseline />
      {/* Top Navigation Bar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, background: "#1976d2" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Personalized News Aggregator
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", background: "#263238", color: "#fff" },
        }}
      >
        <Toolbar />
        <List>
        <ListItem button={true} component={Link} to="/my-account" sx={{ "&:hover": { background: "#455a64" } }}>
            <ListItemIcon sx={{ color: "white" }}><AccountCircle /></ListItemIcon>
            <ListItemText sx={{ color: "white" }} primary="My Account" />
        </ListItem>

          <ListItem button component={Link} to="/my-feed" sx={{ "&:hover": { background: "#455a64" } }}>
            <ListItemIcon sx={{ color: "white" }}><Feed /></ListItemIcon>
            <ListItemText sx={{ color: "white" }} primary="My Feed" />
          </ListItem>
          {categories.map(({ name, icon }) => (
            <ListItem button key={name} component={Link} to={`/category/${name.toLowerCase()}`} sx={{ "&:hover": { background: "#455a64" } }}>
              <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary={name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Container sx={{ marginLeft: `${drawerWidth + 20}px`, marginTop: "80px" }}>
        <Box sx={{ bgcolor: "#e3f2fd", p: 4, borderRadius: 2, textAlign: "center", boxShadow: 3 }}>
          <Typography variant="h4" fontWeight="bold">Welcome to Your Personalized News Aggregator</Typography>
          <Typography variant="h6" color="text.secondary">Stay updated with news that matters to you</Typography>
        </Box>

        <Routes>
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/my-feed" element={<MyFeed />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </Container>
    </>
  );
};

export default Home;
