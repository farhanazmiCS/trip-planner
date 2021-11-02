import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function Login({ props, updateUsername, updatePassword }) {
    // FOR CSRF TOKEN: src: https://docs.djangoproject.com/en/3.2/ref/csrf/
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    // Declare CSRF Token
    const csrftoken = getCookie('csrftoken');
    
    const submitForm = (e) => {
        let url = 'http://127.0.0.1:8000/api/login';
        let request = new Request(
            url, {
            headers: {
                'X-CSRFToken': csrftoken
            }
        });
        fetch(request, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                username: props.username,
                password: props.password
            })
        })
        .then(res => console.log(res))
        e.preventDefault();
    }
    return(
        <Container >
            <Form style={{display: props.state}} onSubmit={submitForm}>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" value={props.username} onChange={(e) => updateUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={props.password} onChange={(e) => updatePassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    )
}

export default Login