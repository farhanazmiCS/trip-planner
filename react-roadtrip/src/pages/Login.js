import {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// React redirect router
import {Link, Navigate} from 'react-router-dom';

export default function Login(props) {
    // State of username and password (for login form)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // State of user
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Handle login form submission
    const handleLogin = (e) => {
        let url = 'http://127.0.0.1:8000/api/login';
        let request = new Request(url, {
            headers: {
                'X-CSRFToken': props.csrftoken
            }
        });
        fetch(request, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(content => {
        if (content.status !== 200) {
            console.log(content.message);
            return;
        }
        const token = content['token'];
        const username = content['username'];
        // Save username and token to sessionStorage
        sessionStorage.setItem(username, token);
        sessionStorage.setItem('username', username);
        // Redirect to home page (Trips)
        setIsLoggedIn(true);
        })
        e.preventDefault();
    }
    return(
        <>
            {!isLoggedIn && 
                <Container >
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3 mt-3" controlId="formBasicText">
                            <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3 mt-3" controlId="formBasicPassword">
                            <Form.Label style={{fontSize: '20px', fontWeight: 'bolder'}}>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <div style={{textAlign: 'center'}}>
                            <Button variant="primary" type="submit">Login</Button>
                        </div>
                    </Form>
                    <div className="mt-3">
                        <Link to="register"><p style={{textAlign: 'center', color: 'grey'}}>Not registered? Click here to create an account.</p></Link>
                    </div>
                </Container>}
            {isLoggedIn && <Navigate to="trips" />}
        </>
    )
}