import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// React redirect router
import {Link} from 'react-router-dom';

export default function Login(props) {
    return(
        <>
            <Container >
                <Form onSubmit={props.handleLogin}>
                    <Form.Group className="mb-3 mt-3" controlId="formBasicText">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" value={props.username} onChange={(e) => props.setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formBasicPassword">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={props.password} onChange={(e) => props.setPassword(e.target.value)} />
                    </Form.Group>
                    <div style={{textAlign: 'center'}}>
                        <Button variant="primary" type="submit">Login</Button>
                    </div>
                </Form>
                <div className="mt-3">
                    <Link style={{textDecoration: 'none'}} to="/register"><p style={{textAlign: 'center', color: 'grey'}}>Not registered? Click here to create an account.</p></Link>
                </div>
            </Container>
        </>
    )
}