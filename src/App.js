import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Users from "./components/Users";
import Videos from "./components/Videos";
import Help from "./components/Help";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import VideoEditor from "./components/editComponent/videoEditor";
import Login from "./components/Login";
import { Backdrop, CircularProgress } from "@mui/material";
import Register from "./components/Register";

const pages = ["Home", "Users", "Videos", "Help"];
const settings = ["Logout"];

const App = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [authToken, setAuthToken] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e) => {
    if (e === "Home") {
      window.location.href = "/";
    }

    if (e === "Users") {
      window.location.href = "/users";
    }

    if (e === "Videos") {
      window.location.href = "/videos";
    }

    if (e === "Help") {
      window.location.href = "/help";
    }
  };

  const handleCloseUserMenu = (e) => {
    if (e === "Logout") {
      localStorage.removeItem("authToken");

      setAuthToken(null);
    }

    setAnchorElUser(null);
  };

  useEffect(() => {
    setIsLoading(true);
    const authToken = localStorage.getItem("authToken");

    setAuthToken(authToken);

    setTimeout(() => {
      setIsLoading(false);
    }, "2000");
  }, []);

  if (isLoading) {
    return (
      <>
        <AppBar position="static" style={{ backgroundColor: "#2C3D50" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component={"a"}
                target="_blank"
                href="https://www.srmd.org/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <img
                  style={{ width: "70px", height: "60px" }}
                  className="SRMD-img"
                  src={"/SRMD-Logo.png"}
                  alt="SRMD_Logo"
                ></img>
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        <Backdrop
          sx={{
            color: "#FFF",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  } else
    return (
      <Router>
        {authToken === null ? (
          <>
            <AppBar position="static" style={{ backgroundColor: "#2C3D50" }}>
              <Container maxWidth="xl">
                <Toolbar disableGutters>
                  <Typography
                    variant="h6"
                    noWrap
                    component={"a"}
                    target="_blank"
                    href="https://www.srmd.org/"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      style={{ width: "70px", height: "60px" }}
                      className="SRMD-img"
                      src={"/SRMD-Logo.png"}
                      alt="SRMD_Logo"
                    ></img>
                  </Typography>
                </Toolbar>
              </Container>
            </AppBar>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </>
        ) : (
          <>
            <AppBar position="static" style={{ backgroundColor: "#2C3D50" }}>
              <Container maxWidth="xl">
                <Toolbar disableGutters>
                  <Typography
                    variant="h6"
                    noWrap
                    component={"a"}
                    target="_blank"
                    href="https://www.srmd.org/"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      style={{ width: "70px", height: "60px" }}
                      className="SRMD-img"
                      src={"/SRMD-Logo.png"}
                      alt="SRMD_Logo"
                    ></img>
                  </Typography>

                  <Box
                    sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
                  >
                    {pages.map((page) => (
                      <Button
                        key={page}
                        onClick={(e) => {
                          handleCloseNavMenu(page);
                        }}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page}
                      </Button>
                    ))}
                  </Box>

                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar src="/static/images/avatar/2.jpg" />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem
                          key={setting}
                          onClick={(e) => {
                            handleCloseUserMenu(setting);
                          }}
                        >
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/users" element={<Users />} />
              <Route exact path="/videos" element={<Videos />} />
              <Route exact path="/videos/edit" element={<VideoEditor />} />
              <Route exact path="/help" element={<Help />} />
            </Routes>
          </>
        )}
      </Router>
    );
};

export default App;
