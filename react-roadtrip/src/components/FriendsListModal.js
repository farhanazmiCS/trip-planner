import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

export default function FriendsListModal(props) {
    const { show, handleClose, friends } = props
    const navigate = useNavigate();
    // Function to redirect to the user's profile
    function profilePage(id) {
        navigate(`/profile/${id}`);
        handleClose();
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Friends</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {friends.length !== 0 && friends.map(friend => (
                    <div onClick={() => profilePage(friend.id)}>
                        <p style={{fontWeight: 'bold', fontSize: '18px'}}>{friend.username[0].toUpperCase() + friend.username.slice(1)}</p>
                    </div>
                ))}
                {friends.length === 0 && <Container>
                    <h3 style={{textAlign: 'center', color: 'grey'}}>No friends.</h3>
                </Container>}
            </Modal.Body>
        </Modal>
    )
}