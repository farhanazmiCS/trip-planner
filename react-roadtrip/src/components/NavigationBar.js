// Bootstrap Components
import {Container} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';

// FontAwesome Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCarSide} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

import {NavLink} from 'react-router-dom';

export default function NavigationBar(props) {
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>
                    <FontAwesomeIcon icon={faCarSide} /> Road Trip
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className={({isActive}) => "mb-2 mt-2 mx-2 " + (!isActive ? "unselected" : "text-white bg-dark")} to="/trips" style={{textDecoration: 'none', color: 'grey', fontSize: '20px'}}>My Trips</NavLink>
                        <NavLink className={({isActive}) => "mb-2 mt-2 mx-2 " + (!isActive ? "unselected" : "text-white bg-dark")} to="/create-trip" style={{textDecoration: 'none', color: 'grey', fontSize: '20px'}}>Create Trip</NavLink>
                        <NavLink className={({isActive}) => "mb-2 mt-2 mx-2 " + (!isActive ? "unselected" : "text-white bg-dark")} to="/invites" style={{textDecoration: 'none', color: 'grey', fontSize: '20px'}}>Invites</NavLink>
                    </Nav>
                    <Nav>
                        <NavDropdown style={{fontSize: '20px', fontWeight: 'bold'}} title={props.user[0].toUpperCase() + props.user.slice(1)} className="mx-2" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={props.handleLogout} style={{fontSize: '20px'}}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}