import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

export default function ViewTrip({state}) {
    return (
        <>
            <Container>
                <h1 style={{fontWeight: 'bolder'}} className="mt-2">My Trips</h1>
                <hr />
            </Container>
        </>
    )
}