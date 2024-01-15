import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import validator from 'validator';
import axios from 'axios';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.srmd.org/">
                SRMD
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Register(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validator.isEmail(email)) {
            Swal.fire({
                title: 'Error!',
                text: 'Invalid Email Address!',
                icon: 'error',
                confirmButtonText: 'Close',
            });
        } else if (password !== passwordConfirmation) {
            Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match!',
                icon: 'error',
                confirmButtonText: 'Close',
            });
        } else {
            Swal.fire({
                title: 'Success!',
                text: 'You have been registered!',
                icon: 'success',
                confirmButtonText: 'Close',
            }).then((result) => {
                axios
                    .post('https://vaani.srmd.org/api/v1/users', {
                        userType: 'user',
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                    })
                    .then(function (response) {
                        console.log(response.data);
                        window.location.href = '/login';
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register For An Account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                        />
                        <TextField
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                        />
                        <TextField
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <TextField
                            onChange={(e) => {
                                setPasswordConfirmation(e.target.value);
                            }}
                            margin="normal"
                            required
                            fullWidth
                            name="passwordConfirmation"
                            label="Confirm Password"
                            type="password"
                            id="passwordConfirmation"
                            autoComplete="current-password"
                        />

                        <Button
                            disabled={
                                firstName === '' ||
                                lastName === '' ||
                                email === '' ||
                                password === '' ||
                                passwordConfirmation === ''
                            }
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {'Already have an account? Log in'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
