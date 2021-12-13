import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Container } from "react-bootstrap";

export default function Notifications({notifications}) {
    var friendRequests = [];
    var tripRequests = [];
    // Separate the friend requests and the trip requests
    for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].is_addFriend === true) {
            friendRequests.push(notifications[i]);
        }
        else if (notifications[i].is_inviteToTrip === true) {
            tripRequests.push(notifications[i]);
        }
    }
    // Function to accept/decline request
    function accept() {
        // Todo
    }
    function decline() {
        // Todo
    }
    return (
        <Container>
            <Container>
                <h1 className="mt-2" style={{fontWeight: 'bolder', textAlign: 'center'}}>Notifications</h1>
                <hr className="mb-3 mt-0" />
            </Container>
            {friendRequests.map(request => (
                <Container className="mt-1" key={request.id}>
                    <h3 className="mt-0 mb-1" style={{fontWeight: 'bold'}}>Friend Request</h3>
                    <div style={{textAlign: 'right'}}>
                        <ButtonGroup aria-label="accept-reject">
                            <Button variant="dark"><FontAwesomeIcon icon={faCheck} /></Button>
                            <Button variant="dark"><FontAwesomeIcon icon={faTimes} /></Button>
                        </ButtonGroup>
                    </div>
                    <p style={{color: 'grey', fontSize: '20px'}}>{request.frm.username[0].toUpperCase() + request.frm.username.slice(1)}</p>
                    <hr />
                </Container>
            ))}
            {tripRequests.map(request => (
                <Container>
                    <h1>Trip request from {request.id}</h1>
                    <hr />
                </Container>
            ))}
        </Container>
    )
}