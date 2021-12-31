import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

// React redirect router
import { Link } from 'react-router-dom';

export default function Login(props) {
    return(
        <Container>
            <Container className="pt-3">
                <h1 className="mb-0" style={{textAlign: 'center'}}>
                    <FontAwesomeIcon icon={faCar} className="mx-2" />
                    RoadTrip
                </h1>
                <p style={{textAlign: 'center', color: 'grey'}}>Login</p>
            </Container>
            <Form onSubmit={props.handleLogin}>
                <Form.Group className="mb-3 mt-3" controlId="formBasicText">
                    <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" value={props.username} onChange={(e) => props.setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3 mt-3" controlId="formBasicPassword">
                    <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={props.password} onChange={(e) => props.setPassword(e.target.value)} />
                </Form.Group>
                <div style={{textAlign: 'center'}} className='mt-4 mb-4'>
                    <Button variant="dark" type="submit">Login</Button>
                </div>
            </Form>
            {props.error && <div className="mt-3" style={{textAlign: 'center'}}>
                <p style={{color: 'red'}}>{props.error}</p>
            </div>}
            <div className="mt-3">
                <Link onClick={() => {
                    props.setError(null);
                    props.setUsernameRegister('');
                    props.setEmailRegister('');
                    props.setPasswordRegister('');
                    props.setConfirmRegister('');
                }} style={{textDecoration: 'none'}} to="/register"><p style={{textAlign: 'center', color: 'grey'}}>Not registered? Click here to create an account.</p></Link>
            </div>
        </Container>
    )
}