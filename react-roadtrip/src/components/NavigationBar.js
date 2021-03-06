// Bootstrap Components
import { Container, Dropdown } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUser, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';

// NavLink is used to add styling on a link
import { NavLink } from 'react-router-dom';

export default function NavigationBar(props) {
    // Make a copy of the users array
    const users = [...props.users];
    const setWaypoints = props.setWaypoints;
    // To store the userId
    var userId = null;
    // To exclude the logged on user
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === sessionStorage.getItem('username')) {
            userId = users[i].id;
            users.splice(i, 1);
        }
    }
    /**
     * Function to clear the waypoints array
     */
    function clearWaypoints() {
        setWaypoints([]);
    }
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>
                    <FontAwesomeIcon className="mx-2" icon={faCar} />Trip Planner
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className={({isActive}) => "mb-2 mt-2 mx-2 " + (!isActive ? "unselected" : "text-white bg-dark")} to="/trips" style={{textDecoration: 'none', color: 'grey', fontSize: '20px'}} onClick={clearWaypoints}>My Trips</NavLink>
                        <NavLink className={({isActive}) => "mb-2 mt-2 mx-2 " + (!isActive ? "unselected" : "text-white bg-dark")} to="/create-trip" style={{textDecoration: 'none', color: 'grey', fontSize: '20px'}} onClick={clearWaypoints}>Create Trip</NavLink>
                        <NavLink className={({isActive}) => "mb-2 mt-2 mx-2 " + (!isActive ? "unselected" : "text-white bg-dark")} to="/users"  style={{textDecoration: 'none', color: 'grey', fontSize: '20px'}}>Find Users</NavLink>
                    </Nav>
                    <Nav>
                        <NavDropdown style={{fontSize: '20px', fontWeight: 'bold'}} title={props.user[0].toUpperCase() + props.user.slice(1)} className="mx-2" id="basic-nav-dropdown">
                            <Dropdown className="mb-2 mt-2 mx-3"><NavLink to="/notifications" style={{fontSize: '18px', textDecoration: 'none', color: '#292b2c', fontWeight: 'normal'}}><FontAwesomeIcon icon={faBell} /> Notifications</NavLink></Dropdown>
                            <Dropdown className="mb-2 mt-2 mx-3"><NavLink to={`/profile/${userId}`} style={{fontSize: '18px', textDecoration: 'none', color: '#292b2c', fontWeight: 'normal'}}><FontAwesomeIcon icon={faUser} /> My Profile</NavLink></Dropdown>
                            <NavDropdown.Item className="mb-2 mt-2" onClick={props.handleLogout} style={{fontSize: '18px'}}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}