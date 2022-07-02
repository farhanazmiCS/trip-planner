import { useState } from 'react';

// MUI components
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// react-router-dom
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Axios
import axiosInstance from '../axios';

// User defined components
import Or from '../components/Or';

const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    username: '',
    password: '',
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (event) => {
    updateFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    axiosInstance
      .post(`/login/`, {
        username: formData.username,
        password: formData.password
      })
      .then((response) => {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 
          'JWT ' + localStorage.getItem('access');
        navigate('/');
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setErrorStatus({
            username: true, 
            message_username: error.response.data.message,
          });
        }
        else if (error.response.status === 401) {
          setErrorStatus({
            password: true, 
            message_password: error.response.data.message,
          });
        }
        else {
          const fields = error.response.data.fields;
          const empty_fields = {};
          for (let field_index in fields) {
            empty_fields[fields[field_index]] = true;
            empty_fields[`message_${fields[field_index]}`] = error.response.data.message;
          }
          setErrorStatus(empty_fields);
        }
      })
  }

  const [errorStatus, setErrorStatus] = useState({
    username: null,
    password: null,
  });

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
                error={errorStatus.username}
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={handleChange}
                helperText={errorStatus.message_username}
                autoFocus
              />
              <TextField
                error={errorStatus.password}
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                onChange={handleChange}
                helperText={errorStatus.message_password}
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
              <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '12px' }}>
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}