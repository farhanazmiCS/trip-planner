import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

export default function Register(props) {
    return(
        <Container>
            <Container className="pt-3">
                <h1 className="mb-0" style={{textAlign: 'center'}}><FontAwesomeIcon className="mx-2" icon={faCar} />RoadTrip</h1>
                <p style={{textAlign: 'center', color: 'grey'}}>Register for an account.</p>
            </Container>
            <Form onSubmit={props.handleRegister}>
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

                <div className="pt-3" style={{textAlign: 'center'}}>
                    <Button variant="dark" type="submit">Register</Button>
                </div>

                {props.error !== null && typeof props.error === 'string' && <div className="mt-3" style={{textAlign: 'center'}}>
                    <p style={{color: 'red'}}>{props.error}</p>
                </div>}
                {props.error !== null && typeof props.error === 'object' && 
                    <div className="mt-4 p-3" style={{ border: '2px solid grey', borderRadius: '7px' }}>
                        <h4 style={{ color: 'grey'}}>Some tips for choosing a password:</h4>
                        {props.error.map(e => (
                            <ul>
                                <li style={{color: 'red'}}>{e}</li>
                            </ul>
                        ))}
                    </div>
                }
            </Form>
            <div className="mt-3">
                <Link onClick={() => {
                    props.setError(null);
                    props.setUsername('');
                    props.setPassword('');
                }} style={{textDecoration: 'none'}} to="/login"><p style={{textAlign: 'center', color: 'grey'}}>Already have an account? Click here to login.</p></Link>
            </div>
        </Container>
    )
}