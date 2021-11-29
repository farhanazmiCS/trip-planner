// Bootstrap Components
import {Container} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';

// FontAwesome Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCarSide} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

import {Link} from 'react-router-dom';

export default function NavigationBar() {
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>
                    <FontAwesomeIcon icon={faCarSide} /> Road Trip
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="trips"><Nav.Link>My Trips</Nav.Link></Link>
                        <Link to="createtrip"><Nav.Link>Create Trip</Nav.Link></Link>
                        <Nav.Link>Invites</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown id="basic-nav-dropdown">
                            <Link to="logout"><NavDropdown.Item ><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</NavDropdown.Item></Link>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}