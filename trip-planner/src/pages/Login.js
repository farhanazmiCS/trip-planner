import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Or from '../components/Or';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Copyright from '../components/Copyright';

const theme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://media.cntraveler.com/photos/5edfc029b16364ea435ca862/4:3/w_2664,h_1998,c_limit/Roadtrip-2020-GettyImages-1151192650.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 3,
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <DirectionsCarIcon sx={{ fontSize: 60 }} />
            <Typography 
              component="h1" 
              variant="h5"
              sx={{
                marginTop: 1
              }}
              >
              Log in to <b>Trip Planner</b>.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
              />
              <Button
                size="large"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <RouterLink to="/" style={{
                  color: '#1976d2'
                }}>
                  Forgotten password?
                </RouterLink>
              </div>
              <Or />
              <RouterLink to="/register" style={{
                textDecoration: 'none',
                color: 'white'
              }}>
                <Button
                  color="success"
                  size="large"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Create a New Account
                </Button>
              </RouterLink>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 2 }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}