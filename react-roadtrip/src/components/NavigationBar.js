// Bootstrap Components
import {Container} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';

// FontAwesome Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCarSide} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt, faUserFriends, faBell} from '@fortawesome/free-solid-svg-icons';

// NavLink is used to add styling on a link
import {NavLink} from 'react-router-dom';

// Typeahead
import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';

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
                    </Nav>
                    <Nav>
                        {/* For searching users */}
                        {/* src: https://github.com/ericgio/react-bootstrap-typeahead/blob/master/docs/Rendering.md */}
                        <Typeahead 
                            id="user_search"
                            className="mx-2"
                            renderMenu={(results, menuProps) => (
                                <Menu {...menuProps}>
                                    {results.map((result, index) => (
                                        <MenuItem
                                            key={index}
                                            option={result}
                                            position={index}
                                            onClick={() => props.navigate(`/profiles/${result.id}`)}
                                        >
                                            <h6>{result.username}</h6>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            )}
                            labelKey="username"
                            onChange={props.setUserQuery}
                            options={props.users}
                            placeholder="Search for a user..."
                            selected={props.userQuery}
                        />
                        <NavDropdown style={{fontSize: '20px', fontWeight: 'bold'}} title={props.user[0].toUpperCase() + props.user.slice(1)} className="mx-2" id="basic-nav-dropdown">
                            <NavDropdown.Item className="mb-1 mt-1" href="/notifications" style={{fontSize: '18px'}}><FontAwesomeIcon icon={faBell} /> Notifications</NavDropdown.Item>
                            <NavDropdown.Item className="mb-1 mt-1" href="/addfriends" style={{fontSize: '18px'}}><FontAwesomeIcon icon={faUserFriends} /> Add Friends</NavDropdown.Item>
                            <NavDropdown.Item className="mb-1 mt-1" onClick={props.handleLogout} style={{fontSize: '18px'}}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}