import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function Register({redirectToLogin}) {
    return(
        <Container>
            <Form>
                <Form.Group className="mb-3 mt-3" controlId="formBasicEmail">
                    <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3 mt-3" controlId="formBasicText">
                    <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Create a Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" />
                </Form.Group>

                <Form.Group className="mb-3 mt-3" controlId="formBasicPassword">
                    <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Form.Group className="mb-3 mt-3" controlId="formBasicPassword">
                    <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" />
                </Form.Group>

                <div style={{textAlign: 'center'}}>
                    <Button variant="primary" type="submit">Register</Button>
                </div>
            </Form>
            <div className="mt-3">
                <p style={{textAlign: 'center', color: 'grey'}} onClick={redirectToLogin}>Already have an account? Click here to login.</p>
            </div>
        </Container>
    )
}

export default Register