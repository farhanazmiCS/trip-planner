import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

export default function ViewTrip({state}) {
    return (
        <>
            <Container style={{display: state}}>
                <h1>My Trips</h1>
                <hr />
            </Container>
        </>
    )
}