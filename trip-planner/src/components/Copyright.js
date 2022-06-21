import Typography from '@mui/material/Typography';
import React from 'react'
import Link from '@mui/material/Link';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Developed by '}
      <Link color="inherit" href="https://github.com/farhanazmiCS">
        Farhan Azmi
      </Link>{', '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright