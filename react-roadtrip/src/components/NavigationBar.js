// Bootstrap Components
import {Container} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';

// FontAwesome Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCarSide} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

export default function NavigationBar({showCreateTrip, hideCreateTrip, showViewTrip, hideViewTrip, state, logoutFunc}) {
    // Functions for nav controls
    const createTrip = () => {
        showCreateTrip();
        hideViewTrip();
    }
    const viewTrip = () => {
        showViewTrip();
        hideCreateTrip();
    }
    return(
        <Navbar bg="dark" variant="dark" expand="lg" style={{display:state}}>
            <Container>
                <Navbar.Brand>
                    <FontAwesomeIcon icon={faCarSide} /> Road Trip
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={viewTrip}>My Trips</Nav.Link>
                        <Nav.Link onClick={createTrip}>Create Trip</Nav.Link>
                        <Nav.Link>Invites</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title="User" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={logoutFunc}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}