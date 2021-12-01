import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import {Link} from 'react-router-dom';

export default function Register(props) {
    return(
        <>
            <Container>
                <Form>
                    <Form.Group className="mb-3 mt-3" controlId="formEmail">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={props.email} onChange={e => props.setEmailRegister(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formUsername">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Create a Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" value={props.username} onChange={e => props.setUsernameRegister(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formPassword">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={props.password} onChange={e => props.setPasswordRegister(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formConfirm">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" value={props.confirm} onChange={e => props.setConfirmRegister(e.target.value)} />
                    </Form.Group>

                    <div style={{textAlign: 'center'}}>
                        <Button variant="primary" type="submit" onClick={props.handleRegister}>Register</Button>
                    </div>

                    {props.error && <div className="mt-3" style={{textAlign: 'center'}}>
                        <p style={{color: 'red'}}>{props.error}</p>
                    </div>}
                </Form>
                <div className="mt-3">
                    <Link style={{textDecoration: 'none'}} to="/login"><p style={{textAlign: 'center', color: 'grey'}}>Already have an account? Click here to login.</p></Link>
                </div>
            </Container>
        </>
    )
}