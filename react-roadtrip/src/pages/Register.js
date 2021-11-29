import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';

export default function Register(props) {
    // State of username, password and confirm (for register form)
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    // State of error message
    const [error, setError] = useState(null);

    // Determine whether the login is successful or not
    const [login, setLogin] = useState(false);

    // Handle registering
    const handleRegister = (e) => {
        let url = 'http://127.0.0.1:8000/api/register';
        let request = new Request(url, {
            headers: {
                'X-CSRFToken': props.csrftoken
            }
        });
        fetch(request, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                confirm: confirm
            })
        })
        .then(response => {
        if (response.status === 200) {
            response.json().then(body => {
                sessionStorage.setItem(body['username'], body['token']);
                sessionStorage.setItem('username', body['username']);
            });
            setLogin(true);
        }
        else {
            response.json().then(body => {
                const error = body['error'];
                setError(error);
            })
        }
        })
        e.preventDefault();
    }

    return(
        <>
            {!login && <Container>
                <Form>
                    <Form.Group className="mb-3 mt-3" controlId="formEmail">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formUsername">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Create a Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formPassword">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 mt-3" controlId="formConfirm">
                        <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                    </Form.Group>

                    <div style={{textAlign: 'center'}}>
                        <Button variant="primary" type="submit" onClick={handleRegister}>Register</Button>
                    </div>

                    {error && <div className="mt-3" style={{textAlign: 'center'}}>
                        <p style={{color: 'red'}}>{error}</p>
                    </div>}
                </Form>
                <div className="mt-3">
                    <Link to="login"><p style={{textAlign: 'center', color: 'grey'}}>Already have an account? Click here to login.</p></Link>
                </div>
            </Container>}
            {login && <Navigate to="trips" />}
        </>
    )
}