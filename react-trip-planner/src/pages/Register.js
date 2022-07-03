import { useState } from 'react';

// Material UI
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import FormHelperText from '@mui/material/FormHelperText';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Axios
import axiosInstance from '../axios';

// React-Router-DOM
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// User defined components
import Or from '../components/Or';

const theme = createTheme();

export default function Register() {
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    email: '',
    username: '',
    password: '',
    confirm: '',
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

    axiosInstance
      .post(`/register/`, {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm: formData.confirm,
      })
      .then((response) => {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 
          'JWT ' + localStorage.getItem('access');
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          if (error.response.data.message === 'Email already used.') {
            setErrorStatus({
              email: true,
              message_email: error.response.data.message,
            });
          }
          else {
            setErrorStatus({
              username: true,
              message_username: error.response.data.message,
            });
          }
        }
        else {
          if (error.response.data.message === 'Passwords must match.') {
            setErrorStatus({
              password: true,
              confirm: true,
              message_password: error.response.data.message,
              message_confirm: error.response.data.message,
            });
          }
          else if (error.response.data.message === 'Field is empty.') {
            const fields = error.response.data.fields;
            const empty_fields = {};
            for (let field_index in fields) {
              empty_fields[fields[field_index]] = true;
              empty_fields[`message_${fields[field_index]}`] = error.response.data.message;
            }
            setErrorStatus(empty_fields);
          }
          else {
            setErrorStatus({
              password: true,
              confirm: true,
              message_password: error.response.data.message,
            });
          }
        }
        console.log(errorStatus);
      });
  }

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const initialErrorStatus = Object.freeze({
    email: false,
    message_email: null,
    username: false,
    message_username: null,
    password: false,
    message_password: null,
    confirm: false,
    message_confirm: null,
  });
  const [errorStatus, setErrorStatus] = useState(initialErrorStatus);

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
              Create a <b>Trip Planner</b> account.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                error={errorStatus.email}
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                helperText={errorStatus.message_email}
                autoFocus
              />
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
              />
              <FormControl 
                fullWidth 
                margin="normal">
                <InputLabel 
                  error={errorStatus.password}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  error={errorStatus.password}
                  name="password"
                  label="Password"
                  type={passwordVisibility ? "text" : "password"}
                  id="password"
                  autoComplete="password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={handleChange}
                />
                {!Array.isArray(errorStatus.message_password) && 
                  <FormHelperText style={{color: '#d32f2f'}}>{errorStatus.message_password}</FormHelperText>
                }
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel 
                  error={errorStatus.confirm}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  error={errorStatus.confirm}
                  name="confirm"
                  label="confirm password"
                  type={passwordVisibility ? "text" : "password"}
                  id="confirm"
                  autoComplete="confirm"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={handleChange}
                />
                {!Array.isArray(errorStatus.message_confirm) && 
                  <FormHelperText style={{color: '#d32f2f'}}>{errorStatus.message_confirm}</FormHelperText>
                }
              </FormControl>
              {Array.isArray(errorStatus.message_password) ? <Alert 
                sx={{marginTop: '16px'}}
                severity="error"
              >
                <AlertTitle>Password Tip(s) </AlertTitle>
                { 
                  errorStatus.message_password.map((message) => (
                    <p key={message}>{message}</p>
                  ))
                }
              </Alert> : null}
              <Button
                color="success"
                size="large"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Account
              </Button>
              <Or />
              <div style={{textAlign: 'center', marginTop: '12px', marginBottom: '32px' }}>
                <RouterLink to="/login" style={{
                  color: '#1976d2'
                }}>
                  Already have an account?
                </RouterLink>
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}