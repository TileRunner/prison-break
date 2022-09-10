import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login = ({loggedIn, setLoggedIn, username, setUsername}) => {
    function isDataAcceptable() {
        return username.length > 0 && isValidFormat(username);
    }
    function handleSubmit(event) {
        event.preventDefault();
        setLoggedIn(true);
    }
    function isValidFormat(s) {
        let alphanumericPattern = /^[ A-Za-z0-9]+$/;
        return alphanumericPattern.test(s);
    }
    const UserLogout = <div className='Logout'>
        <Row>
            <Col xs="auto">
                Username: {username}
            </Col>
            <Col>
                <Button onClick={() => {setLoggedIn(false);}}>Log out</Button>
            </Col>
        </Row>
    </div>;
    const UserLogin = <div className="Login">
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="username">
                <Form.Label column sm={2}>Username:</Form.Label>
                <Col sm={7}>
                    <Form.Control
                        className="mb-3"
                        type="text"
                        value={username}
                        onChange={e => { setUsername(e.target.value); } }
                        isInvalid={username && !isValidFormat(username)} />
                    <Form.Control.Feedback type="invalid" className='trWarning'>Must only use letters and/or numbers and/or spaces</Form.Control.Feedback>
                </Col>
                <Col sm={1}>
                    <Button variant="primary" disabled={!isDataAcceptable()} type="submit">Submit</Button>
                </Col>
            </Form.Group>
        </Form>
        <p className='trEmphasis'>Username distinguishes players in multi-player games. No passwords.</p>
    </div>;
    return (
        loggedIn ? UserLogout : UserLogin
    );
}

export default Login;