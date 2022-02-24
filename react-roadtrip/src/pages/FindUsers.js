// Bootstrap
import Container from 'react-bootstrap/Container';
// Typeahead
import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';

export default function FindUsers(props) {
    document.title = 'RoadTrip: Find Users';
    // Make a copy of the users array
    const users = [...props.users];
    // To exclude the logged on user
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === sessionStorage.getItem('username')) {
            users.splice(i, 1);
        }
    }
    return <Container>
        <Container className="mt-2">
            <h1 className="mb-3" style={{textAlign: 'center'}}>Find Users</h1>
            <Typeahead 
                id="user_search"
                minLength={3}
                renderMenu={(results, menuProps) => (
                    <Menu {...menuProps}>
                        {results.map((result, index) => (
                            <MenuItem
                                className="my-1.5"
                                key={index}
                                option={result}
                                position={index}
                                onClick={() => props.navigate(`/profile/${result.id}`)}
                            >
                                <h6>{result.username[0].toUpperCase() + result.username.slice(1)}</h6>
                            </MenuItem>
                        ))}
                    </Menu>
                )}
                labelKey="username"
                onChange={props.setUserQuery}
                options={users}
                placeholder="Search for a user..."
                selected={props.userQuery}
            />
        </Container>
    </Container>
}