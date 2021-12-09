import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function getUser(users, id) {
    return (
        users.find(user => user.id === id)
    )
}

export default function Profile(props) {
    let params = useParams();
    let profile = getUser(props.users, parseInt(params.userId));
    // Returns an array, if the 'friends' array includes the logged on user's username
    const friends = profile.friends.map(friend => friend.username === sessionStorage.getItem('username'))
    if (friends.length === 0 && profile.username.toLowerCase() !== sessionStorage.getItem('username')) {
        return (
            <Container>
                <Container>
                    <div className="row mt-3">
                        <h1 style={{textAlign: 'center'}}>{profile.username}</h1>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Trips</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Friends</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.tripCounter}</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.friendCounter}</h4>
                        </div>
                    </div>
                    <div className="row">
                        <Button variant="dark">Add Friend</Button>
                    </div>
                    <hr />
                    <div className="row">
                        <h1 style={{textAlign: 'center'}}><FontAwesomeIcon icon={faLock} style={{textAlign: 'center'}} /></h1>
                        <h3 style={{textAlign: 'center'}}>This profile is private.</h3>
                    </div>
                </Container>
            </Container>
        )
    }
    else {
        return (
            <Container>
                <Container>
                    <div className="row mt-3">
                        <h1 style={{textAlign: 'center'}}>{profile.username}</h1>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Trips</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Friends</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.tripCounter}</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.friendCounter}</h4>
                        </div>
                    </div>
                    <hr />
                    {props.myTrips.map(trip => (
                        <Link style={{textDecoration: 'none'}} to={`/trips/${trip.id}`} key={trip.id}>
                            <Container key={`trips-${trip.id}`} className="d-grid gap-2">
                                <Button key={'button-' + trip.id} className="mb-2" variant="outline-dark" style={{textAlign: 'left'}}>
                                    <h3 key={trip.name}>{trip.name}</h3>
                                    <p key={trip.origin.name + '-' + trip.destination.name} className="mb-1" style={{fontSize: '16px', color: 'grey', display: 'inline-block'}}>Trip from {trip.origin.name} to {trip.destination.name}</p>
                                </Button>
                            </Container>
                        </Link>
                    ))}
                </Container>
            </Container>
        )
    }
}