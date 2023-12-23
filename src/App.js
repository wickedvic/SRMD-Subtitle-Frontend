import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Help from './components/Help';
import Users from './components/Users';
import Videos from './components/Videos';

import { Backdrop, CircularProgress } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Login from './components/Login';
import Register from './components/Register';

import 'core-js';
import 'normalize.css';
import { setLocale, setTranslations } from 'react-i18nify';
import i18n from './i18n';
import './libs/contextmenu.css';
import VideoPlayerApp from './VideoPlayerApp';

setTranslations(i18n);
const language = navigator.language.toLowerCase();
const defaultLang = i18n[language] ? language : 'en';
setLocale(defaultLang);

const pages = ['Videos', 'Users', 'Help'];
const settings = ['Logout'];

const App = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [authToken, setAuthToken] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (e) => {
        if (e === 'Users') {
            window.location.href = '/users';
        }

        if (e === 'Videos') {
            window.location.href = '/videos';
        }

        if (e === 'Help') {
            window.location.href = '/help';
        }
    };

    const handleCloseUserMenu = (e) => {
        if (e === 'Logout') {
            localStorage.removeItem('authToken');

            setAuthToken(null);
        }

        setAnchorElUser(null);
    };

    useEffect(() => {
        setIsLoading(true);
        const authToken = localStorage.getItem('authToken');

        setAuthToken(authToken);

        setTimeout(() => {
            setIsLoading(false);
        }, '2000');
    }, []);

    if (isLoading) {
        return (
            <>
                <AppBar position="static" style={{ backgroundColor: '#2C3D50' }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component={'a'}
                                target="_blank"
                                href="https://www.srmd.org/"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                <img
                                    style={{ width: '70px', height: '60px' }}
                                    className="SRMD-img"
                                    src={'/SRMD-Logo.png'}
                                    alt="SRMD_Logo"
                                ></img>
                            </Typography>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Backdrop
                    sx={{
                        color: '#FFF',
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
                        <AppBar position="static" style={{ backgroundColor: '#2C3D50' }}>
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component={'a'}
                                        target="_blank"
                                        href="https://www.srmd.org/"
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'none', md: 'flex' },
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <img
                                            style={{ width: '70px', height: '60px' }}
                                            className="SRMD-img"
                                            src={'/SRMD-Logo.png'}
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
                        <AppBar position="static" style={{ backgroundColor: '#2C3D50' }}>
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component={'a'}
                                        target="_blank"
                                        href="https://www.srmd.org/"
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'none', md: 'flex' },
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <img
                                            style={{ width: '70px', height: '60px' }}
                                            className="SRMD-img"
                                            src={'/SRMD-Logo.png'}
                                            alt="SRMD_Logo"
                                        ></img>
                                    </Typography>

                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        {pages.map((page) => (
                                            <Button
                                                key={page}
                                                onClick={(e) => {
                                                    handleCloseNavMenu(page);
                                                }}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
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
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
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
                            <Route path="/" element={<Videos />} />
                            <Route exact path="/users" element={<Users />} />
                            <Route exact path="/videos" element={<Videos />} />
                            {/* <Route exact path="/videos/edit" element={<VideoEditor />} /> */}

                            <Route exact path="/videos/edit" element={<VideoPlayerApp defaultLang={defaultLang} />} />

                            <Route exact path="/help" element={<Help />} />

                            <Route path="*" element={<Navigate to="/videos" />} />
                        </Routes>
                    </>
                )}
            </Router>
        );
};

export default App;
