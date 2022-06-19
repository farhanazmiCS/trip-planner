import { React, useState } from 'react'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';

function NavBar() {
    const [value, setValue] = useState(0)
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation 
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="My Trips" icon={<TimeToLeaveIcon />} />
                <BottomNavigationAction label="Create Trip" icon={<AddBoxIcon />} />
                <BottomNavigationAction label="Logout" icon={<LogoutIcon />} />
            </BottomNavigation>
        </Paper>
    )
}

export default NavBar